import { useEffect, useMemo, useState } from "react";
import { Bot, ShieldAlert, Flame, Bell, Link2, Route, Siren, Save, Database } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AUTOMATION_CAMERA_PREF_KEY, cameraInventory } from "@/lib/cameraInventory";
import {
  loadAutomationConfig,
  resolveTenantId,
  saveAutomationConfig,
  type AutomationAgentType,
  type Integration,
  type Rule,
} from "@/lib/automationsStore";

const CHANNEL_OPTIONS = [
  "Slack #security-alerts",
  "Email oncall@empresa.com",
  "Telegram SOC",
  "Webhook SIEM",
  "WhatsApp on-call",
];

const agentTemplates: { key: AutomationAgentType; label: string; description: string }[] = [
  { key: "security-agent", label: "Agente de Seguridad", description: "Detecta intrusiones, merodeo y actividad fuera de horario." },
  { key: "fire-detector", label: "Detector de Incendios", description: "Detecta humo/fuego y dispara alertas críticas con escalamiento." },
  { key: "intrusion-zone", label: "Intrusión en Zona", description: "Vigila zonas prohibidas y cruces de perímetro virtual." },
  { key: "fall-detection", label: "Persona caída", description: "Detecta caídas o inmovilidad anómala para respuesta rápida." },
  { key: "ppe-compliance", label: "Cumplimiento EPP", description: "Valida casco/chaleco/guantes según política de planta." },
  { key: "occupancy-counter", label: "Conteo de ocupación", description: "Controla aforo y zonas de alta densidad." },
  { key: "abandoned-object", label: "Objeto abandonado", description: "Detecta objetos sin movimiento en zonas sensibles." },
  { key: "unauthorized-vehicle", label: "Vehículo no autorizado", description: "Detecta ingreso de vehículos fuera de whitelist." },
];

const defaultIntegrations: Integration[] = [
  { name: "Email SMTP", category: "Comunicaciones", status: "configured", lastSync: "2026-02-19 16:22" },
  { name: "SMS Gateway", category: "Comunicaciones", status: "pending", lastSync: "-" },
  { name: "WhatsApp Business API", category: "Comunicaciones", status: "pending", lastSync: "-" },
  { name: "Telegram Bot", category: "Comunicaciones", status: "configured", lastSync: "2026-02-19 14:03" },
  { name: "Slack", category: "Colaboración", status: "configured", lastSync: "2026-02-19 15:41" },
  { name: "Microsoft Teams", category: "Colaboración", status: "pending", lastSync: "-" },
  { name: "Webhook Genérico", category: "Orquestación", status: "configured", lastSync: "2026-02-19 16:11" },
  { name: "Zapier", category: "Orquestación", status: "pending", lastSync: "-" },
  { name: "Make", category: "Orquestación", status: "pending", lastSync: "-" },
  { name: "MQTT Broker", category: "IoT", status: "configured", lastSync: "2026-02-19 15:16" },
  { name: "VMS/NVR", category: "Video", status: "configured", lastSync: "2026-02-19 11:58" },
  { name: "ERP/CRM Callback", category: "Enterprise", status: "error", lastSync: "2026-02-18 20:10" },
  { name: "SIEM", category: "Seguridad", status: "pending", lastSync: "-" },
  { name: "PagerDuty", category: "Incidentes", status: "pending", lastSync: "-" },
  { name: "Opsgenie", category: "Incidentes", status: "pending", lastSync: "-" },
  { name: "Sirena IoT Relay", category: "Actuadores", status: "configured", lastSync: "2026-02-19 09:45" },
];

const defaultRules: Rule[] = [
  {
    id: "r1",
    name: "Fuego confirmado",
    enabled: true,
    condition: "IF confidence(fire) >= 0.72 durante 2 frames",
    action: "THEN crear incidente CRITICAL + notificar canales críticos + activar sirena",
    severity: "CRITICAL",
    cooldownSeconds: 15,
  },
  {
    id: "r2",
    name: "Intrusión fuera de horario",
    enabled: true,
    condition: "IF persona en zona restringida AND horario=fuera_turno",
    action: "THEN alerta HIGH + snapshot + webhook al SOC",
    severity: "HIGH",
    cooldownSeconds: 45,
  },
  {
    id: "r3",
    name: "Sin casco detectado",
    enabled: false,
    condition: "IF worker sin casco >= 5s",
    action: "THEN alerta MEDIUM + registro en auditoría",
    severity: "MEDIUM",
    cooldownSeconds: 120,
  },
];

function statusClasses(status: Integration["status"]) {
  if (status === "configured") return "text-status-ok";
  if (status === "pending") return "text-status-warning";
  return "text-status-error";
}

export default function AutomationsPage() {
  const { user } = useAuth();
  const preferredCamera = localStorage.getItem(AUTOMATION_CAMERA_PREF_KEY);
  const initialCamera = preferredCamera && cameraInventory.some((c) => c.id === preferredCamera) ? preferredCamera : cameraInventory[0].id;

  const [selectedCameraId, setSelectedCameraId] = useState(initialCamera);
  const [selectedAgent, setSelectedAgent] = useState<AutomationAgentType>("security-agent");
  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [alerts247, setAlerts247] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [ackWindow, setAckWindow] = useState(5);
  const [escalationEnabled, setEscalationEnabled] = useState(true);
  const [primaryChannel, setPrimaryChannel] = useState(CHANNEL_OPTIONS[0]);
  const [integrations, setIntegrations] = useState<Integration[]>(defaultIntegrations);
  const [savedVersion, setSavedVersion] = useState<number | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [lastSimulation, setLastSimulation] = useState("Sin simulaciones ejecutadas.");
  const [saveMessage, setSaveMessage] = useState("Configuración sin guardar.");

  const tenantId = user ? resolveTenantId({ role: user.role, email: user.email }) : "tenant-unknown";

  useEffect(() => {
    if (!user) return;
    const loaded = loadAutomationConfig(tenantId, selectedCameraId);
    if (!loaded) {
      setSelectedAgent("security-agent");
      setRules(defaultRules);
      setAlerts247(true);
      setQuietHours(false);
      setAckWindow(5);
      setEscalationEnabled(true);
      setPrimaryChannel(CHANNEL_OPTIONS[0]);
      setIntegrations(defaultIntegrations);
      setSavedVersion(null);
      setSavedAt(null);
      setSaveMessage("Configuración nueva para esta cámara/tenant.");
      return;
    }

    setSelectedAgent(loaded.selectedAgent);
    setRules(loaded.rules);
    setAlerts247(loaded.alerts247);
    setQuietHours(loaded.quietHours);
    setAckWindow(loaded.ackWindow);
    setEscalationEnabled(loaded.escalationEnabled);
    setPrimaryChannel(loaded.primaryChannel);
    setIntegrations(loaded.integrations);
    setSavedVersion(loaded.version);
    setSavedAt(loaded.updatedAt);
    setSaveMessage(`Configuración cargada (v${loaded.version}).`);
  }, [selectedCameraId, tenantId, user]);

  const integrationStats = useMemo(() => {
    const configured = integrations.filter((i) => i.status === "configured").length;
    const pending = integrations.filter((i) => i.status === "pending").length;
    const error = integrations.filter((i) => i.status === "error").length;
    return { configured, pending, error };
  }, [integrations]);

  const activeAgent = agentTemplates.find((a) => a.key === selectedAgent) ?? agentTemplates[0];

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const cycleIntegrationStatus = (name: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.name !== name) return item;
        const nextStatus = item.status === "configured" ? "pending" : item.status === "pending" ? "error" : "configured";
        return {
          ...item,
          status: nextStatus,
          lastSync: nextStatus === "configured" ? new Date().toLocaleString("es-ES") : item.lastSync,
        };
      }),
    );
  };

  const runSimulation = () => {
    const now = new Date().toLocaleString("es-ES");
    setLastSimulation(
      `Simulación OK (${now}): ${activeAgent.label} en ${selectedCameraId} disparó flujo completo con ACK en ${ackWindow} min y escalamiento ${escalationEnabled ? "activo" : "desactivado"}.`,
    );
  };

  const saveCurrentConfig = () => {
    if (!user) return;
    const saved = saveAutomationConfig({
      tenantId,
      cameraId: selectedCameraId,
      selectedAgent,
      rules,
      alerts247,
      quietHours,
      ackWindow,
      escalationEnabled,
      primaryChannel,
      integrations,
    });

    setSavedVersion(saved.version);
    setSavedAt(saved.updatedAt);
    setSaveMessage(`Guardado exitoso (v${saved.version}).`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bot className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">AUTOMATIZACIONES</h1>
        <span className="ml-auto status-indicator border border-border text-muted-foreground">
          Visible solo para ADMIN / OPERADOR
        </span>
      </div>

      <div className="glow-line" />

      <div className="metric-card flex flex-wrap items-center gap-3">
        <label className="text-xs font-mono text-muted-foreground">
          Cámara objetivo
          <select
            value={selectedCameraId}
            onChange={(e) => {
              setSelectedCameraId(e.target.value);
              localStorage.setItem(AUTOMATION_CAMERA_PREF_KEY, e.target.value);
            }}
            className="ml-2 bg-background border border-border rounded px-2 py-1"
          >
            {cameraInventory.map((cam) => (
              <option key={cam.id} value={cam.id}>
                {cam.name}
              </option>
            ))}
          </select>
        </label>

        <span className="status-indicator border border-border text-muted-foreground">
          Tenant: {tenantId}
        </span>

        <span className="status-indicator border border-border text-muted-foreground">
          Versión: {savedVersion ? `v${savedVersion}` : "sin guardar"}
        </span>

        <button
          onClick={saveCurrentConfig}
          className="ml-auto text-xs font-mono px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10"
        >
          <Save className="w-3 h-3 inline mr-2" />
          Guardar configuración
        </button>
      </div>

      <div className="metric-card text-xs font-mono text-muted-foreground">
        <Database className="w-4 h-4 inline mr-2 text-primary" />
        {saveMessage} {savedAt ? `Última actualización: ${new Date(savedAt).toLocaleString("es-ES")}` : ""}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="metric-card xl:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <p className="metric-label">Plantillas de Agente</p>
          </div>
          <div className="space-y-2">
            {agentTemplates.map((agent) => (
              <button
                key={agent.key}
                onClick={() => setSelectedAgent(agent.key)}
                className={`w-full text-left text-xs font-mono p-2 rounded border transition-colors ${
                  selectedAgent === agent.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <p className="font-semibold">{agent.label}</p>
                <p className="text-[10px] mt-1">{agent.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="metric-card xl:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary" />
            <p className="metric-label">Agente Activo</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <label className="space-y-1">
              <span className="text-muted-foreground">Caso de uso</span>
              <input value={activeAgent.label} readOnly className="w-full bg-background border border-border rounded px-2 py-1.5" />
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Nivel base de severidad</span>
              <select className="w-full bg-background border border-border rounded px-2 py-1.5">
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>CRITICAL</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Modelo asociado</span>
              <input defaultValue="YOLOv8n-custom v2.3" className="w-full bg-background border border-border rounded px-2 py-1.5" />
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Cámara objetivo</span>
              <input
                value={cameraInventory.find((c) => c.id === selectedCameraId)?.name ?? selectedCameraId}
                readOnly
                className="w-full bg-background border border-border rounded px-2 py-1.5"
              />
            </label>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            Configuración orientada a operación real: reglas IF/THEN + alertas + integraciones + escalamiento.
          </p>
        </div>
      </div>

      <div className="metric-card space-y-4">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-primary" />
          <p className="metric-label">Reglas de Automatización (IF/THEN)</p>
        </div>
        <div className="space-y-2">
          {rules.map((rule) => (
            <div key={rule.id} className="border border-border rounded p-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`px-2 py-1 rounded border ${rule.enabled ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
                >
                  {rule.enabled ? "ACTIVA" : "INACTIVA"}
                </button>
                <span className="text-foreground font-semibold">{rule.name}</span>
                <span className="ml-auto text-muted-foreground">Severidad: {rule.severity}</span>
              </div>
              <p className="text-muted-foreground mt-2">{rule.condition}</p>
              <p className="text-muted-foreground">{rule.action}</p>
              <p className="text-muted-foreground mt-1">Cooldown: {rule.cooldownSeconds}s</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="metric-card space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <p className="metric-label">Alertas y Horarios</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={alerts247} onChange={(e) => setAlerts247(e.target.checked)} />
              Activar alertas 24/7
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={quietHours} onChange={(e) => setQuietHours(e.target.checked)} />
              Modo silencio por turnos
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Ventana ACK (min)</span>
              <input
                type="number"
                min={1}
                value={ackWindow}
                onChange={(e) => setAckWindow(Number(e.target.value) || 1)}
                className="w-full bg-background border border-border rounded px-2 py-1.5"
              />
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Canal primario</span>
              <select
                value={primaryChannel}
                onChange={(e) => setPrimaryChannel(e.target.value)}
                className="w-full bg-background border border-border rounded px-2 py-1.5"
              >
                {CHANNEL_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            Recomendado: 24/7 para incendios y seguridad perimetral; por turnos para casos operativos no críticos.
          </p>
        </div>

        <div className="metric-card space-y-4">
          <div className="flex items-center gap-2">
            <Siren className="w-4 h-4 text-primary" />
            <p className="metric-label">Escalamiento</p>
          </div>
          <label className="flex items-center gap-2 text-xs font-mono">
            <input type="checkbox" checked={escalationEnabled} onChange={(e) => setEscalationEnabled(e.target.checked)} />
            Escalamiento automático habilitado
          </label>
          <div className="space-y-2 text-xs font-mono">
            <div className="border border-border rounded p-2">Nivel 1: Canal primario + ACK requerido</div>
            <div className="border border-border rounded p-2">Nivel 2 (sin ACK en {ackWindow} min): SMS + supervisor</div>
            <div className="border border-border rounded p-2">Nivel 3 (persistencia): llamada + sirena IoT + incidente CRITICAL</div>
          </div>
          <button
            onClick={runSimulation}
            className="text-xs font-mono px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10"
          >
            Simular incidente end-to-end
          </button>
          <p className="text-xs font-mono text-muted-foreground">{lastSimulation}</p>
        </div>
      </div>

      <div className="metric-card overflow-x-auto">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="w-4 h-4 text-primary" />
          <p className="metric-label">Integraciones (catálogo amplio)</p>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs font-mono">
          <div className="status-indicator border border-border">Configuradas: {integrationStats.configured}</div>
          <div className="status-indicator border border-border">Pendientes: {integrationStats.pending}</div>
          <div className="status-indicator border border-border">Error: {integrationStats.error}</div>
        </div>
        <table className="table-industrial">
          <thead>
            <tr>
              <th>Integración</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Último Sync</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map((integration) => (
              <tr key={integration.name}>
                <td>{integration.name}</td>
                <td className="text-muted-foreground">{integration.category}</td>
                <td className={statusClasses(integration.status)}>{integration.status.toUpperCase()}</td>
                <td className="text-muted-foreground">{integration.lastSync}</td>
                <td>
                  <button
                    onClick={() => cycleIntegrationStatus(integration.name)}
                    className="text-[10px] font-mono px-2 py-1 rounded border border-border hover:border-primary/40"
                  >
                    Cambiar estado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs font-mono text-muted-foreground mt-3">
          Seguridad: secretos ocultos, solo estado/rotación visibles en UI.
        </p>
      </div>
    </div>
  );
}
