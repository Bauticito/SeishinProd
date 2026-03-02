import { useMemo, useState } from "react";
import {
  Settings,
  ShieldCheck,
  Server,
  Users,
  Network,
  ClipboardList,
  DatabaseBackup,
  Wrench,
} from "lucide-react";
import { PermissionGate } from "@/components/PermissionGate";
import { ConfirmAction } from "@/components/ConfirmAction";
import { useAudit } from "@/context/AuditContext";

type AdminSection =
  | "panel"
  | "system"
  | "users"
  | "network"
  | "audit"
  | "backups"
  | "maintenance";

type HealthLevel = "ok" | "warning" | "error";
type SystemMode = "Producción" | "Mantenimiento";

const navSections: { key: AdminSection; label: string; icon: typeof Settings; permission: string }[] = [
  { key: "panel", label: "Panel", icon: ShieldCheck, permission: "admin.panel.read" },
  { key: "system", label: "Sistema", icon: Server, permission: "admin.system.read" },
  { key: "users", label: "Usuarios y Roles", icon: Users, permission: "admin.users.read" },
  { key: "network", label: "Red", icon: Network, permission: "admin.network.read" },
  { key: "audit", label: "Auditoría", icon: ClipboardList, permission: "admin.audit.read" },
  { key: "backups", label: "Backups", icon: DatabaseBackup, permission: "admin.backups.read" },
  { key: "maintenance", label: "Mantenimiento", icon: Wrench, permission: "admin.maintenance.read" },
];

const criticalServices = [
  { name: "API", status: "Operativo" },
  { name: "Workers de inferencia", status: "Operativo" },
  { name: "Base de datos", status: "Operativo" },
  { name: "Almacenamiento", status: "Degradado" },
  { name: "Sistema de colas", status: "Operativo" },
];

const recentEvents = [
  { time: "2026-02-19 14:30", type: "Deploy", detail: "Despliegue frontend v1.6.2", level: "INFO" },
  { time: "2026-02-19 13:42", type: "Admin", detail: "Cambio de umbral de confianza", level: "WARN" },
  { time: "2026-02-19 12:08", type: "Servicio", detail: "Reinicio de worker #3", level: "INFO" },
  { time: "2026-02-19 10:16", type: "Crítico", detail: "Latencia elevada en almacenamiento", level: "ERROR" },
];

const userRows = [
  { name: "Javier F.", email: "bautista.javier.figueroa@gmail.com", role: "Superadmin", status: "Activo", lastAccess: "2026-02-19 14:39" },
  { name: "Operador Planta A", email: "operador.a@thor.local", role: "Operador", status: "Activo", lastAccess: "2026-02-19 14:11" },
  { name: "Label Team 02", email: "label02@thor.local", role: "Etiquetador", status: "Bloqueado", lastAccess: "2026-02-18 21:02" },
  { name: "Cliente Demo", email: "cliente.demo@external.local", role: "Cliente", status: "Activo", lastAccess: "2026-02-18 09:54" },
];

const permissionsMatrix = [
  { role: "Superadmin", dashboard: "Administrar", models: "Administrar", datasets: "Administrar", inference: "Administrar", admin: "Administrar" },
  { role: "Admin", dashboard: "Editar", models: "Editar", datasets: "Editar", inference: "Ejecutar", admin: "Editar" },
  { role: "Operador", dashboard: "Ver", models: "Ver", datasets: "Ver", inference: "Ejecutar", admin: "Ver" },
  { role: "Etiquetador", dashboard: "Ver", models: "Ver", datasets: "Editar", inference: "Ver", admin: "Ver" },
  { role: "Cliente", dashboard: "Ver", models: "Ver", datasets: "Ver", inference: "Ejecutar", admin: "Ver" },
];

const interfaceRows = [
  { name: "eth0", state: "Up", mode: "Estático", ip: "192.168.10.24", gateway: "192.168.10.1", dns: "1.1.1.1, 8.8.8.8" },
  { name: "wlan0", state: "Down", mode: "DHCP", ip: "10.10.2.41", gateway: "10.10.2.1", dns: "10.10.2.2" },
  { name: "vpn0", state: "Up", mode: "Estático", ip: "172.22.4.17", gateway: "172.22.4.1", dns: "172.22.4.2" },
];

const servicePorts = [
  { service: "API Gateway", port: "443", exposed: "Sí", origin: "Whitelist corporativa" },
  { service: "SSH", port: "22", exposed: "No", origin: "Solo VPN" },
  { service: "Inference gRPC", port: "50051", exposed: "No", origin: "Red interna" },
  { service: "Prometheus", port: "9090", exposed: "No", origin: "NOC" },
];

const operationalLogs = [
  { level: "ERROR", service: "storage", time: "2026-02-19 10:16:45", msg: "IO latency above threshold" },
  { level: "WARN", service: "api", time: "2026-02-19 10:10:31", msg: "High request queue depth" },
  { level: "INFO", service: "workers", time: "2026-02-19 09:58:08", msg: "Worker #2 completed warmup" },
  { level: "INFO", service: "database", time: "2026-02-19 09:31:52", msg: "Replica checkpoint completed" },
];

const backupRows = [
  { enabled: "Activado", freq: "Cada 6h", destination: "s3://prod-backups/jetson", lastRun: "2026-02-19 12:00", status: "OK" },
];

function maskIp(ip: string) {
  const parts = ip.split(".");
  if (parts.length !== 4) return "***.***.***.***";
  return `${parts[0]}.${parts[1]}.***.***`;
}

function maskEmail(value: string) {
  const [name, domain] = value.split("@");
  if (!name || !domain) return "***";
  return `${name.slice(0, 2)}***@${domain}`;
}

function levelColor(level: string) {
  if (level === "ERROR" || level === "DENEGADO") return "text-status-error";
  if (level === "WARN") return "text-status-warning";
  return "text-status-ok";
}

function statusDot(status: string) {
  if (status === "Operativo" || status === "Activo" || status === "OK" || status === "Up" || status === "Sí") return "status-dot-ok";
  if (status === "Degradado" || status === "Bloqueado") return "status-dot-warning";
  return "status-dot-error";
}

export default function AdminPage() {
  const [section, setSection] = useState<AdminSection>("panel");
  const [mode, setMode] = useState<SystemMode>("Producción");
  const [filters, setFilters] = useState({ level: "ALL", service: "ALL", range: "24h" });
  const { entries, log, exportJSON, exportCSV } = useAudit();

  const filteredLogs = useMemo(() => {
    return operationalLogs.filter((l) => {
      const byLevel = filters.level === "ALL" || l.level === filters.level;
      const byService = filters.service === "ALL" || l.service === filters.service;
      return byLevel && byService;
    });
  }, [filters.level, filters.service]);

  const systemHealth: HealthLevel = criticalServices.some((s) => s.status === "Degradado") ? "warning" : "ok";
  const healthText = systemHealth === "ok" ? "Operativo" : "Degradado";

  const handleExport = (format: "json" | "csv") => {
    const data = format === "json" ? exportJSON() : exportCSV();
    const blob = new Blob([data], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    log(`Exportó auditoría (${format.toUpperCase()})`, "admin.audit");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">ADMINISTRACIÓN</h1>
        <span className="ml-auto status-indicator border border-border text-muted-foreground">
          Estado global: {healthText}
        </span>
      </div>

      <div className="glow-line" />

      {/* Section tabs */}
      <div className="metric-card">
        <div className="flex flex-wrap gap-2">
          {navSections.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${
                section === item.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* === PANEL === */}
      {section === "panel" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="metric-card"><p className="metric-label">Estado Global</p><p className={`metric-value text-xl ${systemHealth === "ok" ? "text-status-ok" : "text-status-warning"}`}>{healthText}</p></div>
            <div className="metric-card"><p className="metric-label">CPU / GPU</p><p className="metric-value text-xl">42% / 67%</p></div>
            <div className="metric-card"><p className="metric-label">RAM</p><p className="metric-value text-xl">12.4 / 32 GB</p></div>
            <div className="metric-card"><p className="metric-label">Disco</p><p className="metric-value text-xl">1.9 / 3.8 TB</p></div>
            <div className="metric-card"><p className="metric-label">Temp / Energía</p><p className="metric-value text-xl">64°C / 84W</p></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="metric-card">
              <p className="metric-label mb-3">Servicios Críticos</p>
              <div className="space-y-2">
                {criticalServices.map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between text-xs font-mono border-b border-border pb-2">
                    <span>{svc.name}</span>
                    <span className="status-indicator"><span className={`status-dot ${statusDot(svc.status)}`} />{svc.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="metric-card">
              <p className="metric-label mb-3">Versionado</p>
              <div className="space-y-2 text-xs font-mono">
                <p className="text-muted-foreground">Backend: <span className="text-foreground">v2.9.4</span></p>
                <p className="text-muted-foreground">Frontend: <span className="text-foreground">v1.6.2</span></p>
                <p className="text-muted-foreground">Modelo Activo: <span className="text-foreground">YOLOv8n-custom v2.3</span></p>
                <p className="text-muted-foreground">Drivers/Runtime: <span className="text-foreground">CUDA 12.6 / TRT 10.2</span></p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <p className="metric-label mb-3">Eventos Recientes</p>
            <div className="space-y-2">
              {recentEvents.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs font-mono border-b border-border pb-2">
                  <span className="text-muted-foreground shrink-0">{event.time}</span>
                  <span className={`shrink-0 ${levelColor(event.level)}`}>[{event.level}]</span>
                  <span className="text-foreground">{event.type}: {event.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === SYSTEM === */}
      {section === "system" && (
        <div className="space-y-4">
          <PermissionGate permission="admin.system.update" fallback={
            <div className="metric-card"><p className="text-xs font-mono text-muted-foreground">Solo lectura — se requiere rol Superadmin para editar.</p></div>
          }>
            <div className="metric-card">
              <p className="metric-label mb-3">Identidad y Entorno</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <label className="space-y-1"><span className="text-muted-foreground">Nombre lógico del nodo</span><input defaultValue="thor-node-a1" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
                <label className="space-y-1"><span className="text-muted-foreground">Zona horaria</span><input defaultValue="America/Mexico_City" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
                <label className="space-y-1"><span className="text-muted-foreground">Configuración NTP</span><input defaultValue="pool.ntp.org" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
                <label className="space-y-1"><span className="text-muted-foreground">Modo</span>
                  <select value={mode} onChange={(e) => setMode(e.target.value as SystemMode)} className="w-full bg-background border border-border rounded px-2 py-1.5">
                    <option>Producción</option><option>Mantenimiento</option>
                  </select>
                </label>
              </div>
            </div>
          </PermissionGate>

          <div className="metric-card overflow-x-auto">
            <p className="metric-label mb-3">Almacenamiento y Retención</p>
            <table className="table-industrial">
              <thead><tr><th>Recurso</th><th>Límite</th><th>Retención</th><th>Limpieza Auto</th></tr></thead>
              <tbody>
                <tr><td>Datasets</td><td>1.2 TB</td><td>120 días</td><td>02:00 AM</td></tr>
                <tr><td>Modelos</td><td>400 GB</td><td>180 días</td><td>03:00 AM</td></tr>
                <tr><td>Logs</td><td>250 GB</td><td>45 días</td><td>04:00 AM</td></tr>
                <tr><td>Temporales</td><td>90 GB</td><td>7 días</td><td>Cada 6h</td></tr>
              </tbody>
            </table>
          </div>

          <div className="metric-card">
            <p className="metric-label mb-3">Modelo e Inferencia</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <label className="space-y-1"><span className="text-muted-foreground">Modelo activo</span><input defaultValue="YOLOv8n-custom v2.3" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
              <label className="space-y-1"><span className="text-muted-foreground">Umbral de confianza</span><input type="number" step="0.01" defaultValue="0.62" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
              <label className="space-y-1"><span className="text-muted-foreground">NMS / IoU</span><input type="number" step="0.01" defaultValue="0.45" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
              <label className="space-y-1"><span className="text-muted-foreground">Resolución entrada</span><input defaultValue="1280x720" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
              <label className="space-y-1"><span className="text-muted-foreground">Límite FPS</span><input type="number" defaultValue="30" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
              <label className="space-y-1"><span className="text-muted-foreground">Modo de ejecución</span><select className="w-full bg-background border border-border rounded px-2 py-1.5"><option>Solo inferencia</option><option>Inferencia + registro controlado</option></select></label>
            </div>
          </div>

          <div className="metric-card">
            <p className="metric-label mb-3">Integraciones</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              <div className="status-indicator"><span className="status-dot status-dot-ok" />Almacenamiento externo: Activo</div>
              <div className="status-indicator"><span className="status-dot status-dot-warning" />Webhooks: Degradado</div>
              <div className="status-indicator"><span className="status-dot status-dot-ok" />Autenticación externa: Activa</div>
              <div className="status-indicator"><span className="status-dot status-dot-ok" />Rotación de credenciales: Habilitada (sin secretos)</div>
            </div>
            <ConfirmAction
              label="Rotar credenciales"
              permission="admin.integrations.rotate"
              severity="warning"
              onConfirm={() => {}}
              onAudit={(action) => log(action, "admin.integrations")}
              className="mt-3"
            />
          </div>
        </div>
      )}

      {/* === USERS === */}
      {section === "users" && (
        <div className="space-y-4">
          <div className="metric-card overflow-x-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="metric-label">Usuarios</p>
              <PermissionGate permission="admin.users.create" fallback="hide">
                <button className="text-xs font-mono px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10">Crear usuario</button>
              </PermissionGate>
            </div>
            <table className="table-industrial">
              <thead><tr><th>Nombre</th><th>Email / Usuario</th><th>Rol</th><th>Estado</th><th>Último acceso</th><th>Acciones</th></tr></thead>
              <tbody>
                {userRows.map((u) => (
                  <tr key={u.email}>
                    <td>{u.name}</td>
                    <td className="text-muted-foreground">{maskEmail(u.email)}</td>
                    <td>{u.role}</td>
                    <td><span className="status-indicator"><span className={`status-dot ${statusDot(u.status)}`} />{u.status}</span></td>
                    <td className="text-muted-foreground">{u.lastAccess}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        <PermissionGate permission="admin.users.block" fallback="disable">
                          <button className="text-[10px] px-2 py-1 rounded border border-border">Bloquear/Desbloquear</button>
                        </PermissionGate>
                        <PermissionGate permission="admin.users.resetmfa" fallback="disable">
                          <button className="text-[10px] px-2 py-1 rounded border border-border">Reset MFA</button>
                        </PermissionGate>
                        <PermissionGate permission="admin.users.revoke" fallback="hide">
                          <ConfirmAction
                            label="Revocar sesiones"
                            severity="danger"
                            onConfirm={() => {}}
                            onAudit={(action) => log(`${action} — ${u.name}`, "admin.users")}
                          />
                        </PermissionGate>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="metric-card overflow-x-auto">
            <p className="metric-label mb-3">Roles (RBAC)</p>
            <table className="table-industrial">
              <thead><tr><th>Rol</th><th>Dashboard</th><th>Modelos</th><th>Datasets</th><th>Inferencia</th><th>Administración</th></tr></thead>
              <tbody>
                {permissionsMatrix.map((row) => (
                  <tr key={row.role}><td>{row.role}</td><td>{row.dashboard}</td><td>{row.models}</td><td>{row.datasets}</td><td>{row.inference}</td><td>{row.admin}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <PermissionGate permission="admin.users.update" fallback="hide">
            <div className="metric-card">
              <p className="metric-label mb-3">Políticas de Seguridad</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> MFA obligatorio</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Bloqueo por intentos fallidos</label>
                <label className="space-y-1"><span className="text-muted-foreground">Regla de contraseña</span><input defaultValue="12+ chars, mayúsc/minúsc, número, símbolo" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
                <label className="space-y-1"><span className="text-muted-foreground">Duración máxima de sesión (min)</span><input type="number" defaultValue="480" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
                <label className="space-y-1"><span className="text-muted-foreground">Inactividad permitida (min)</span><input type="number" defaultValue="30" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
              </div>
            </div>
          </PermissionGate>
        </div>
      )}

      {/* === NETWORK === */}
      {section === "network" && (
        <div className="space-y-4">
          <div className="metric-card overflow-x-auto">
            <p className="metric-label mb-3">Interfaces</p>
            <table className="table-industrial">
              <thead><tr><th>Nombre</th><th>Estado</th><th>DHCP / Estático</th><th>IP (enmascarada)</th><th>Gateway (enmascarado)</th><th>DNS</th></tr></thead>
              <tbody>
                {interfaceRows.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td><span className="status-indicator"><span className={`status-dot ${statusDot(row.state)}`} />{row.state}</span></td>
                    <td>{row.mode}</td>
                    <td>{maskIp(row.ip)}</td>
                    <td>{maskIp(row.gateway)}</td>
                    <td className="text-muted-foreground">{row.dns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="metric-card overflow-x-auto">
            <p className="metric-label mb-3">Puertos y Servicios</p>
            <table className="table-industrial">
              <thead><tr><th>Servicio</th><th>Puerto</th><th>Expuesto</th><th>Origen Permitido</th></tr></thead>
              <tbody>
                {servicePorts.map((svc) => (
                  <tr key={svc.service}>
                    <td>{svc.service}</td><td>{svc.port}</td>
                    <td><span className="status-indicator"><span className={`status-dot ${statusDot(svc.exposed)}`} />{svc.exposed}</span></td>
                    <td>{svc.origin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-xs font-mono text-muted-foreground">Lista blanca: 192.168.***.***, 10.10.***.*** | Acceso remoto: Solo VPN</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="metric-card">
              <p className="metric-label mb-3">TLS y Dominio</p>
              <div className="space-y-2 text-xs font-mono">
                <p className="text-muted-foreground">Dominio configurado: <span className="text-foreground">ops.seishinia.com</span></p>
                <p className="text-muted-foreground">Certificado: <span className="text-status-ok">Válido</span></p>
                <p className="text-muted-foreground">Expira: <span className="text-foreground">2026-09-14</span></p>
                <p className="text-muted-foreground">Redirect HTTP→HTTPS: <span className="text-status-ok">Habilitado</span></p>
                <p className="text-muted-foreground">Cabeceras seguras: <span className="text-status-ok">Habilitadas</span></p>
              </div>
            </div>
            <div className="metric-card">
              <p className="metric-label mb-3">VPN / Wi-Fi</p>
              <div className="space-y-2 text-xs font-mono">
                <p className="text-muted-foreground">VPN: <span className="text-status-ok">Conectada</span></p>
                <p className="text-muted-foreground">Identificador lógico: <span className="text-foreground">vpn-prod-a</span></p>
                <p className="text-muted-foreground">Última conexión: <span className="text-foreground">2026-02-19 13:55</span></p>
                <p className="text-muted-foreground">Wi-Fi: <span className="text-status-warning">No aplica en nodo actual</span></p>
                <p className="text-muted-foreground">Claves: <span className="text-foreground">No visibles</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === AUDIT — now uses live AuditContext === */}
      {section === "audit" && (
        <div className="space-y-4">
          <div className="metric-card overflow-x-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="metric-label">Registro de Auditoría ({entries.length} eventos)</p>
              <PermissionGate permission="admin.audit.export" fallback="hide">
                <div className="flex gap-2">
                  <button onClick={() => handleExport("csv")} className="text-xs font-mono px-3 py-1.5 rounded border border-border hover:bg-muted/30">Exportar CSV</button>
                  <button onClick={() => handleExport("json")} className="text-xs font-mono px-3 py-1.5 rounded border border-border hover:bg-muted/30">Exportar JSON</button>
                </div>
              </PermissionGate>
            </div>
            <table className="table-industrial">
              <thead><tr><th>Usuario</th><th>Rol</th><th>Acción</th><th>Recurso</th><th>Detalle</th><th>Fecha y hora</th><th>Resultado</th><th>Origen</th></tr></thead>
              <tbody>
                {entries.slice(0, 20).map((row) => (
                  <tr key={row.id}>
                    <td>{row.actor}</td>
                    <td className="text-muted-foreground text-[10px]">{row.actorRole}</td>
                    <td>{row.action}</td>
                    <td className="text-primary text-[10px]">{row.resource}</td>
                    <td className="text-muted-foreground">{row.detail ?? "—"}</td>
                    <td className="text-muted-foreground">{row.timestamp}</td>
                    <td className={levelColor(row.result)}>{row.result}</td>
                    <td className="text-muted-foreground">{maskIp(row.origin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="metric-card">
            <p className="metric-label mb-3">Logs Operativos</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-xs font-mono">
              <select value={filters.level} onChange={(e) => setFilters((p) => ({ ...p, level: e.target.value }))} className="bg-background border border-border rounded px-2 py-1.5">
                <option value="ALL">Nivel: ALL</option><option value="ERROR">ERROR</option><option value="WARN">WARN</option><option value="INFO">INFO</option>
              </select>
              <select value={filters.service} onChange={(e) => setFilters((p) => ({ ...p, service: e.target.value }))} className="bg-background border border-border rounded px-2 py-1.5">
                <option value="ALL">Servicio: ALL</option><option value="api">api</option><option value="storage">storage</option><option value="workers">workers</option><option value="database">database</option>
              </select>
              <select value={filters.range} onChange={(e) => setFilters((p) => ({ ...p, range: e.target.value }))} className="bg-background border border-border rounded px-2 py-1.5">
                <option value="24h">Rango: 24h</option><option value="7d">7 días</option><option value="30d">30 días</option>
              </select>
            </div>
            <div className="space-y-2">
              {filteredLogs.map((l, idx) => (
                <div key={idx} className="text-xs font-mono border-b border-border pb-2 flex items-start gap-2">
                  <span className={levelColor(l.level)}>[{l.level}]</span>
                  <span className="text-muted-foreground">{l.time}</span>
                  <span className="text-primary">{l.service}</span>
                  <span>{l.msg}</span>
                </div>
              ))}
              {filteredLogs.length === 0 && <p className="text-xs font-mono text-muted-foreground">Sin resultados para los filtros seleccionados.</p>}
            </div>
            <ConfirmAction
              label="Descargar paquete diagnóstico (sin secretos)"
              permission="admin.audit.diagnostic"
              severity="warning"
              onConfirm={() => {}}
              onAudit={(action) => log(action, "admin.audit")}
              className="mt-3"
            />
          </div>
        </div>
      )}

      {/* === BACKUPS === */}
      {section === "backups" && (
        <div className="space-y-4">
          <div className="metric-card overflow-x-auto">
            <p className="metric-label mb-3">Backups</p>
            <table className="table-industrial">
              <thead><tr><th>Estado</th><th>Frecuencia</th><th>Destino lógico</th><th>Última ejecución</th><th>Resultado</th></tr></thead>
              <tbody>
                {backupRows.map((b, i) => (
                  <tr key={i}><td>{b.enabled}</td><td>{b.freq}</td><td>{b.destination}</td><td>{b.lastRun}</td><td className="text-status-ok">{b.status}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="metric-card">
            <p className="metric-label mb-3">Restauración</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Configuración</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Usuarios y roles</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Proyectos / Datasets</label>
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-3">Checksum verificado: <span className="text-status-ok">SHA256 válido</span></p>
            <ConfirmAction
              label="Iniciar restauración"
              permission="admin.backups.restore"
              severity="danger"
              onConfirm={() => {}}
              onAudit={(action) => log(action, "admin.backups")}
              className="mt-3"
            />
          </div>
        </div>
      )}

      {/* === MAINTENANCE === */}
      {section === "maintenance" && (
        <div className="space-y-4">
          <div className="metric-card">
            <p className="metric-label mb-3">Acciones Controladas</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {["Reinicio de servicio", "Reinicio de sistema", "Rotación de logs", "Reindexación"].map((action) => (
                <ConfirmAction
                  key={action}
                  label={action}
                  permission="admin.maintenance.execute"
                  severity="warning"
                  onConfirm={() => {}}
                  onAudit={(a) => log(a, "admin.maintenance")}
                />
              ))}
            </div>
          </div>
          <div className="metric-card">
            <p className="metric-label mb-3">Ventana de Mantenimiento</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <label className="space-y-1"><span className="text-muted-foreground">Fecha</span><input type="date" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
              <label className="space-y-1"><span className="text-muted-foreground">Hora inicio</span><input type="time" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
              <label className="space-y-1"><span className="text-muted-foreground">Duración (min)</span><input type="number" defaultValue="45" className="w-full bg-background border border-border rounded px-2 py-1.5" /></label>
            </div>
            <ConfirmAction
              label="Programar ventana (registrar en auditoría)"
              permission="admin.maintenance.schedule"
              severity="primary"
              onConfirm={() => {}}
              onAudit={(a) => log(a, "admin.maintenance")}
              className="mt-3"
            />
          </div>
        </div>
      )}

      {/* Security rules footer */}
      <div className="metric-card">
        <p className="metric-label mb-2">Reglas de seguridad UI</p>
        <p className="text-xs font-mono text-muted-foreground">
          Se enmascaran IP, identificadores sensibles y rutas internas. Nunca se muestran secretos.
          Acciones críticas requieren doble confirmación con timeout automático.
        </p>
      </div>
    </div>
  );
}
