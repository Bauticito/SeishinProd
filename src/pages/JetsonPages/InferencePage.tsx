import { useEffect, useState } from "react";
import { Video, Eye, EyeOff, Camera, Bug, RefreshCw } from "lucide-react";
import { PermissionGate } from "@/components/PermissionGate";
import { useAudit } from "@/context/AuditContext";
import { useJarvisMetrics, useJarvisAlerts } from "@/hooks/useJarvis";
import { jarvisApi } from "@/services/jarvisApi";

const SECURITY_CLASSES = [
  { name: "person", color: "text-status-ok" },
  { name: "car", color: "text-status-warning" },
  { name: "motorcycle", color: "text-status-warning" },
  { name: "truck", color: "text-status-error" },
  { name: "bicycle", color: "text-muted-foreground" },
  { name: "bus", color: "text-status-error" },
];

export default function InferencePage() {
  const { data: metrics } = useJarvisMetrics();
  const { data: alerts } = useJarvisAlerts();
  const [hiddenClasses, setHiddenClasses] = useState<Set<string>>(new Set());
  const [debugMode, setDebugMode] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<string[]>(SECURITY_CLASSES.map((c) => c.name));
  const [streamKey, setStreamKey] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(
    typeof document === "undefined" ? true : document.visibilityState === "visible",
  );
  const { log } = useAudit();

  const captures = metrics?.captures_by_type ?? {};

  const toggleClass = (name: string) => {
    setHiddenClasses((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      const nextVisible = availableClasses.filter((cls) => !next.has(cls));
      jarvisApi
        .updateRuntimeConfig({ visible_classes: nextVisible })
        .catch(() => log("No se pudo sincronizar clases visibles", "inference"));
      return next;
    });
  };

  const handleCapture = () => {
    window.open(jarvisApi.getSnapshotUrl(), "_blank");
    log("Captura de frame", "inference", `tracked=${metrics?.tracked_count ?? 0}`);
  };

  const handleDebugToggle = () => {
    const next = !debugMode;
    setDebugMode(next);
    jarvisApi
      .updateRuntimeConfig({ debug_overlay: next })
      .then(() => {
        log(next ? "Activó modo debug" : "Desactivó modo debug", "inference");
      })
      .catch(() => {
        setDebugMode(!next);
        log("No se pudo cambiar modo debug", "inference");
      });
  };

  // Build log lines from real alerts
  const logLines = (alerts ?? []).slice(0, 8).map((a) => {
    const severity = a.severity === "HIGH" ? "ERR" : "WRN";
    return `[${a.time_str}] ${severity} zone=${a.zone} objects=${a.objects.join(",")}`;
  });

  useEffect(() => {
    const onVisibilityChange = () => setIsPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    let alive = true;
    jarvisApi
      .getRuntimeConfig()
      .then((cfg) => {
        if (!alive) return;
        const classes = cfg.available_classes?.length ? cfg.available_classes : SECURITY_CLASSES.map((c) => c.name);
        const visible = new Set(cfg.visible_classes ?? classes);
        setAvailableClasses(classes);
        setHiddenClasses(new Set(classes.filter((cls) => !visible.has(cls))));
        setDebugMode(Boolean(cfg.debug_overlay));
      })
      .catch(() => {
        if (!alive) return;
        setAvailableClasses(SECURITY_CLASSES.map((c) => c.name));
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center gap-3">
        <Video className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">INFERENCE — TIEMPO REAL</h1>
        <div className="ml-auto flex items-center gap-2">
          <PermissionGate permission="inference.debug" fallback="hide">
            <button
              onClick={handleDebugToggle}
              className={`status-indicator px-3 py-1 rounded border transition-colors ${
                debugMode
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bug className="w-3 h-3" />
              DEBUG
            </button>
          </PermissionGate>
          <PermissionGate permission="inference.capture" fallback="disable">
            <button
              onClick={handleCapture}
              className="status-indicator px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <Camera className="w-3 h-3" />
              CAPTURAR
            </button>
          </PermissionGate>
        </div>
      </div>

      <div className="glow-line" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 min-h-0">
        {/* Live MJPEG stream from Jarvis */}
        <div className="metric-card flex flex-col">
          <div className="flex-1 bg-black rounded border border-border overflow-hidden relative min-h-[400px]">
            <img
              key={streamKey}
              src={isPageVisible ? `${jarvisApi.getStreamUrl()}?t=${streamKey}` : ""}
              alt="Jarvis Inference Feed"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setStreamKey((k) => k + 1)}
              className="absolute top-2 right-2 p-1.5 rounded bg-black/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Reconectar stream"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            {debugMode && (
              <div className="absolute inset-0 bg-primary/5 border-2 border-primary/20 rounded flex items-center justify-center pointer-events-none">
                <p className="text-xs font-mono text-primary/60">[ACTIVATION MAP OVERLAY]</p>
              </div>
            )}
            {!isPageVisible && (
              <div className="absolute inset-0 bg-black/55 rounded flex items-center justify-center pointer-events-none">
                <p className="text-xs font-mono text-muted-foreground">Stream pausado (pestaña inactiva)</p>
              </div>
            )}
          </div>
        </div>

        {/* Side panel — real data */}
        <div className="flex flex-col gap-4 min-h-0">
          <div className="metric-card space-y-3">
            <p className="metric-label">Estadísticas</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground">FPS</p>
                <p className="text-lg font-mono font-semibold text-status-ok">
                  {metrics?.fps ?? 0}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground">EN ESCENA</p>
                <p className="text-lg font-mono font-semibold text-primary">
                  {metrics?.tracked_count ?? 0}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground">ALERTAS</p>
                <p className="text-lg font-mono font-semibold text-foreground">
                  {metrics?.total_alerts ?? 0}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground">UPTIME</p>
                <p className="text-lg font-mono font-semibold text-foreground">
                  {metrics?.uptime ?? "--:--"}
                </p>
              </div>
            </div>
          </div>

          <div className="metric-card space-y-3">
            <p className="metric-label">Clases Detectadas</p>
            <div className="space-y-2">
              {availableClasses.map((className) => {
                const fallback = SECURITY_CLASSES.find((entry) => entry.name === className);
                const classColor = fallback?.color ?? "text-muted-foreground";
                const count = captures[className] ?? 0;
                const active = !hiddenClasses.has(className);
                return (
                  <button
                    key={className}
                    onClick={() => toggleClass(className)}
                    className="w-full flex items-center gap-2 text-xs font-mono px-2 py-1.5 rounded hover:bg-muted/30 transition-colors"
                  >
                    {active ? <Eye className="w-3 h-3 text-primary" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
                    <span className={active ? classColor : "text-muted-foreground line-through"}>{className}</span>
                    <span className="ml-auto text-muted-foreground">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="metric-card flex-1 min-h-0 flex flex-col">
            <p className="metric-label mb-2">Alertas en Vivo</p>
            <div className="flex-1 overflow-auto space-y-1">
              {logLines.length === 0 && (
                <p className="text-[10px] font-mono text-muted-foreground">Sin alertas recientes</p>
              )}
              {logLines.map((line, i) => (
                <p
                  key={i}
                  className={`text-[10px] font-mono leading-relaxed ${
                    line.includes("ERR") ? "text-status-error" : line.includes("WRN") ? "text-status-warning" : "text-muted-foreground"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
