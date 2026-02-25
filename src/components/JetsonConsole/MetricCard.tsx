interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  status?: "ok" | "warning" | "error";
}

export function MetricCard({ label, value, unit, trend, status = "ok" }: MetricCardProps) {
  const statusColor = status === "ok" ? "text-status-ok" : status === "warning" ? "text-status-warning" : "text-status-error";
  const trendText =
    trend === "up" ? "▲" : trend === "down" ? "▼" : trend === "stable" ? "●" : null;
  const trendColor =
    trend === "up"
      ? "text-status-ok"
      : trend === "down"
      ? "text-status-error"
      : "text-muted-foreground";

  return (
    <div className="metric-card">
      <p className="metric-label mb-2">{label}</p>
      <p className={`metric-value ${statusColor}`}>
        {value}
        {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
      </p>
      {trendText && <p className={`text-[11px] font-mono mt-2 ${trendColor}`}>{trendText}</p>}
    </div>
  );
}
