import { useEffect, useMemo, useState } from "react";
import { Lock, Puzzle, Power } from "lucide-react";
import { usePermission } from "@/components/PermissionGate";
import { useAudit } from "@/context/AuditContext";
import { jarvisApi } from "@/services/jarvisApi";
import type { JarvisRuntimeModules } from "@/services/jarvisApi";

type ModuleKey = keyof JarvisRuntimeModules;

const moduleLabels: Record<ModuleKey, { title: string; desc: string }> = {
  inference: {
    title: "Inferencia",
    desc: "Ejecuta detección del modelo en cada frame.",
  },
  alerts: {
    title: "Alertas",
    desc: "Genera alertas y screenshots por permanencia en zona.",
  },
  contention: {
    title: "Contención",
    desc: "Actualiza y evalúa el semáforo de contención.",
  },
  overlays: {
    title: "Overlays",
    desc: "Dibuja cajas, zonas y HUD sobre el stream.",
  },
  stream: {
    title: "Stream MJPEG",
    desc: "Publica frames por /stream para consumo del frontend.",
  },
};

const defaultModules: JarvisRuntimeModules = {
  inference: true,
  alerts: true,
  contention: true,
  overlays: true,
  stream: true,
};

export default function ModulesPage() {
  const canUpdate = usePermission("modules.update");
  const { log } = useAudit();
  const [modules, setModules] = useState<JarvisRuntimeModules>(defaultModules);
  const [updatedAt, setUpdatedAt] = useState<string>("--");
  const [savingKey, setSavingKey] = useState<ModuleKey | null>(null);

  useEffect(() => {
    let alive = true;

    const refresh = async () => {
      try {
        const cfg = await jarvisApi.getRuntimeConfig();
        if (!alive) return;
        setModules(cfg.modules);
        setUpdatedAt(new Date().toLocaleTimeString());
      } catch {
        if (!alive) return;
        setUpdatedAt("sin conexión");
      }
    };

    refresh();
    const timer = window.setInterval(refresh, 5000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  const activeCount = useMemo(
    () => Object.values(modules).filter(Boolean).length,
    [modules],
  );

  const handleToggle = async (key: ModuleKey) => {
    if (!canUpdate || savingKey) return;
    const nextModules = { ...modules, [key]: !modules[key] };
    setModules(nextModules);
    setSavingKey(key);
    try {
      const next = await jarvisApi.updateRuntimeConfig({ modules: nextModules });
      setModules(next.modules);
      log(
        next.modules[key] ? "Activó módulo" : "Desactivó módulo",
        "system",
        `${key}`,
      );
    } catch {
      setModules(modules);
      log("No se pudo cambiar estado del módulo", "system", key);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Puzzle className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">MÓDULOS ACTIVOS</h1>
        {!canUpdate && (
          <span className="ml-auto status-indicator border border-border text-muted-foreground">
            <Lock className="w-3 h-3" />
            Solo lectura
          </span>
        )}
      </div>

      <div className="glow-line" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <p className="metric-label mb-1">Activos</p>
          <p className="metric-value text-status-ok">{activeCount}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label mb-1">Totales</p>
          <p className="metric-value">{Object.keys(modules).length}</p>
        </div>
        <div className="metric-card col-span-2">
          <p className="metric-label mb-1">Última actualización</p>
          <p className="metric-value text-base">{updatedAt}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {(Object.keys(modules) as ModuleKey[]).map((key) => {
          const active = modules[key];
          const meta = moduleLabels[key];
          return (
            <div key={key} className="metric-card space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-mono font-medium text-foreground">{meta.title}</p>
                  <p className="text-[11px] font-mono text-muted-foreground">{meta.desc}</p>
                </div>
                <span className="status-indicator">
                  <span className={`status-dot ${active ? "status-dot-ok" : "status-dot-warning"}`} />
                  <span className={`text-[10px] ${active ? "text-status-ok" : "text-status-warning"}`}>
                    {active ? "ACTIVO" : "PAUSADO"}
                  </span>
                </span>
              </div>

              <button
                onClick={() => handleToggle(key)}
                disabled={!canUpdate || savingKey !== null}
                className="status-indicator border border-border px-3 py-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <Power className="w-3.5 h-3.5" />
                {savingKey === key ? "Aplicando..." : active ? "Desactivar" : "Activar"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
