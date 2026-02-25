import { AlertTriangle } from "lucide-react";
import { useJarvisAlerts } from "@/hooks/useJarvis";

export function AlertsWidget() {
  const { data: alerts } = useJarvisAlerts();
  const items = alerts ?? [];

  return (
    <div className="metric-card flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-status-warning" />
        <p className="metric-label">ALERTAS RECIENTES</p>
        {items.length > 0 && (
          <span className="ml-auto text-[10px] font-mono text-status-error">
            {items.length} ALERTAS
          </span>
        )}
      </div>

      <div className="space-y-2 max-h-[250px] overflow-y-auto">
        {items.length === 0 && (
          <p className="text-xs font-mono text-muted-foreground">Sin alertas activas</p>
        )}
        {items.slice(0, 10).map((alert) => (
          <div
            key={alert.id}
            className="bg-background rounded p-2.5 border-l-2 border-status-error border-r border-t border-b border-r-border border-t-border border-b-border"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground">
                {alert.time_str}
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                alert.severity === "HIGH"
                  ? "bg-red-500/10 text-status-error"
                  : "bg-yellow-500/10 text-status-warning"
              }`}>
                {alert.severity}
              </span>
            </div>
            <p className="text-xs font-mono mt-1">
              <span className="text-status-warning">{alert.zone}</span>
              {" — "}
              <span className="text-status-error">{alert.objects.join(", ")}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
