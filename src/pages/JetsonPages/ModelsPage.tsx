import { useEffect, useMemo, useState } from "react";
import { Box, Play, Download, RefreshCw } from "lucide-react";
import { PermissionGate } from "@/components/PermissionGate";
import { useAudit } from "@/context/AuditContext";
import { agentRegistry } from "@/services/agentRegistry";
import { jarvisApi } from "@/services/jarvisApi";

interface Model {
  id: string;
  name: string;
  version: string;
  size: string | null;
  type: "ONNX" | "TensorRT" | "PyTorch";
  source: string;
  status: "active" | "ready" | "converting" | "error";
}

function modelTypeFromPath(path: string): Model["type"] {
  const lower = path.toLowerCase();
  if (lower.endsWith(".engine")) return "TensorRT";
  if (lower.endsWith(".onnx")) return "ONNX";
  return "PyTorch";
}

const statusBadge = (status: Model["status"]) => {
  switch (status) {
    case "active":
      return <span className="status-indicator"><span className="status-dot status-dot-ok" />ACTIVO</span>;
    case "ready":
      return <span className="status-indicator text-muted-foreground"><span className="status-dot bg-muted-foreground" />LISTO</span>;
    case "converting":
      return <span className="status-indicator"><span className="status-dot status-dot-warning animate-pulse-glow" />CONVIRTIENDO</span>;
    case "error":
      return <span className="status-indicator"><span className="status-dot status-dot-error" />ERROR</span>;
  }
};

const typeBadge = (type: Model["type"]) => {
  const colors: Record<string, string> = {
    TensorRT: "text-primary border-primary/30 bg-primary/10",
    ONNX: "text-status-warning border-status-warning/30 bg-status-warning/10",
    PyTorch: "text-status-error border-status-error/30 bg-status-error/10",
  };
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${colors[type]}`}>
      {type}
    </span>
  );
};

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [confThres, setConfThres] = useState(0.25);
  const [performanceProfile, setPerformanceProfile] = useState<"eco" | "balanced" | "max">("balanced");
  const [frameSkip, setFrameSkip] = useState(1);
  const [jpegQuality, setJpegQuality] = useState(70);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const { log } = useAudit();

  useEffect(() => {
    let alive = true;
    const agents = agentRegistry.getAll();

    const refresh = async () => {
      const [nextModels, runtimeCfg] = await Promise.all([
        Promise.all(
        agents.map(async (agent) => {
          let status: Model["status"] = "ready";
          try {
            const res = await fetch(`${agent.baseUrl}${agent.healthCheck}`);
            if (!res.ok) status = "error";
            else {
              const data = await res.json();
              status = String(data?.status ?? "").toLowerCase() === "running" ? "active" : "ready";
            }
          } catch {
            status = "error";
          }

          return {
            id: agent.id,
            name: agent.model,
            version: agent.version,
            size: null,
            type: modelTypeFromPath(agent.model),
            source: agent.name,
            status,
          };
        }),
        ),
        jarvisApi.getRuntimeConfig().catch(() => null),
      ]);

      if (!alive) return;
      setModels(nextModels);
      if (runtimeCfg) {
        setConfThres(runtimeCfg.conf_thres);
        setPerformanceProfile(runtimeCfg.performance_profile ?? "balanced");
        setFrameSkip(runtimeCfg.frame_skip ?? 1);
        setJpegQuality(runtimeCfg.jpeg_quality ?? 70);
      }
    };

    refresh();
    const timer = window.setInterval(refresh, 8000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  const displayModels = useMemo(() => models, [models]);

  const activateModel = (model: Model) => {
    log("Solicitó activar modelo", "models", `${model.name} ${model.version}`);
  };

  const saveRuntimeConfig = async () => {
    try {
      setIsSavingConfig(true);
      const next = await jarvisApi.updateRuntimeConfig({
        conf_thres: confThres,
        performance_profile: performanceProfile,
        frame_skip: frameSkip,
        jpeg_quality: jpegQuality,
      });
      setConfThres(next.conf_thres);
      setPerformanceProfile(next.performance_profile);
      setFrameSkip(next.frame_skip);
      setJpegQuality(next.jpeg_quality);
      log(
        "Actualizó perfil runtime",
        "models",
        `profile=${next.performance_profile} conf=${next.conf_thres} skip=${next.frame_skip} q=${next.jpeg_quality}`,
      );
    } catch {
      log("No se pudo actualizar configuración runtime", "models");
    } finally {
      setIsSavingConfig(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Box className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">GESTIÓN DE MODELOS</h1>
      </div>

      <div className="glow-line" />

      <div className="metric-card space-y-4">
        <p className="metric-label">Parámetros de inferencia (runtime)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-muted-foreground">Threshold (CONF_THRES)</label>
            <input
              type="number"
              min={0.01}
              max={0.99}
              step={0.01}
              value={confThres}
              onChange={(e) => setConfThres(Number(e.target.value))}
              className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-muted-foreground">Perfil de rendimiento</label>
            <select
              value={performanceProfile}
              onChange={(e) => setPerformanceProfile(e.target.value as "eco" | "balanced" | "max")}
              className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm font-mono"
            >
              <option value="eco">ECO</option>
              <option value="balanced">BALANCEADO</option>
              <option value="max">MAX</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-muted-foreground">Frame Skip (1-6)</label>
            <input
              type="number"
              min={1}
              max={6}
              step={1}
              value={frameSkip}
              onChange={(e) => setFrameSkip(Number(e.target.value))}
              className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-muted-foreground">Calidad MJPEG (40-95)</label>
            <input
              type="number"
              min={40}
              max={95}
              step={1}
              value={jpegQuality}
              onChange={(e) => setJpegQuality(Number(e.target.value))}
              className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm font-mono"
            />
          </div>
          <div>
            <button
              onClick={saveRuntimeConfig}
              disabled={isSavingConfig}
              className="status-indicator px-3 py-1 rounded border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-50"
            >
              {isSavingConfig ? "Guardando..." : "Guardar Runtime"}
            </button>
          </div>
        </div>
        <p className="text-[11px] font-mono text-muted-foreground">
          IMGSZ no se modifica desde consola para evitar pérdida de detección.
        </p>
      </div>

      <div className="metric-card overflow-x-auto">
        <table className="table-industrial">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Versión</th>
              <th>Tamaño</th>
              <th>Tipo</th>
              <th>Fuente</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {displayModels.map((model) => (
              <tr key={model.id}>
                <td className="text-foreground font-medium">{model.name}</td>
                <td className="text-muted-foreground">{model.version}</td>
                <td className="text-muted-foreground">{model.size ?? "N/D"}</td>
                <td>{typeBadge(model.type)}</td>
                <td className="text-muted-foreground">{model.source}</td>
                <td>{statusBadge(model.status)}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <PermissionGate permission="models.activate" fallback="disable">
                      <button
                        onClick={() => activateModel(model)}
                        className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-status-ok transition-colors"
                        title="Activar"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </PermissionGate>
                    <PermissionGate permission="models.convert" fallback="disable">
                      <button
                        className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-primary transition-colors"
                        title="Convertir TensorRT"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </PermissionGate>
                    <PermissionGate permission="models.export" fallback="disable">
                      <button
                        onClick={() => log("Exportó modelo", "models", `${model.name} ${model.version}`)}
                        className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
                        title="Exportar"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </PermissionGate>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
