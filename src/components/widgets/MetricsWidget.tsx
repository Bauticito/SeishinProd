import { BarChart3 } from "lucide-react";
import { useJarvisMetrics } from "@/hooks/useJarvis";

export function MetricsWidget() {
  const { data: metrics, isError } = useJarvisMetrics();

  const items = [
    { label: "FPS", value: metrics?.fps ?? 0, color: "text-status-ok" },
    { label: "EN ESCENA", value: metrics?.tracked_count ?? 0, color: "text-primary" },
    { label: "ALERTAS", value: metrics?.total_alerts ?? 0, color: metrics?.total_alerts ? "text-status-warning" : "text-status-ok" },
    { label: "UPTIME", value: metrics?.uptime ?? "--:--", color: "text-primary" },
  ];

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-primary" />
        <p className="metric-label">METRICAS</p>
        {isError && (
          <span className="ml-auto text-[10px] font-mono text-status-error">OFFLINE</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="bg-background rounded p-3 text-center border border-border">
            <p className={`text-xl font-mono font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Métricas especiales */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-background rounded p-2 text-center border border-border">
          <p className="text-sm font-mono font-bold text-status-warning">
            {(metrics?.blind_camera_seconds ?? 0).toFixed(1)}s
          </p>
          <p className="text-[9px] font-mono text-muted-foreground">CAMARA CIEGA</p>
        </div>
        <div className="bg-background rounded p-2 text-center border border-border">
          <p className="text-sm font-mono font-bold text-status-warning">
            {(metrics?.contention?.max_time_in_zone ?? 0).toFixed(1)}s
          </p>
          <p className="text-[9px] font-mono text-muted-foreground">MAX TIEMPO ZONA</p>
        </div>
      </div>
    </div>
  );
}
