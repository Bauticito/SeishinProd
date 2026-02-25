import { Shield } from "lucide-react";
import { useJarvisMetrics } from "@/hooks/useJarvis";

const stateConfig = {
  green: {
    color: "bg-green-500",
    glow: "shadow-[0_0_20px_rgba(0,255,0,0.5)]",
    textColor: "text-green-400",
    label: "Sin amenazas detectadas",
    animate: "",
  },
  yellow: {
    color: "bg-yellow-400",
    glow: "shadow-[0_0_20px_rgba(255,255,0,0.5)]",
    textColor: "text-yellow-400",
    label: "Amenaza detectada",
    animate: "animate-pulse",
  },
  red: {
    color: "bg-red-500",
    glow: "shadow-[0_0_20px_rgba(255,0,0,0.6)]",
    textColor: "text-red-400",
    label: "ALERTA MAXIMA",
    animate: "animate-pulse",
  },
};

export function ContentionWidget() {
  const { data: metrics } = useJarvisMetrics();
  const contention = metrics?.contention;
  const state = contention?.state ?? "green";
  const cfg = stateConfig[state];

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-primary" />
        <p className="metric-label">CONTENCION</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Semáforo */}
        <div
          className={`w-12 h-12 rounded-full border-2 border-border ${cfg.color} ${cfg.glow} ${cfg.animate} shrink-0`}
        />

        <div className="min-w-0">
          <p className={`text-sm font-mono font-semibold ${cfg.textColor}`}>
            {contention?.message ?? "Preparado!"}
          </p>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">
            {cfg.label}
          </p>
          {contention && contention.max_time_in_zone > 0 && (
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              Tiempo en zona: {contention.max_time_in_zone.toFixed(1)}s
            </p>
          )}
          {state === "red" && contention?.time_remaining != null && (
            <p className="text-xs font-mono text-red-400 mt-0.5">
              Reset en: {contention.time_remaining.toFixed(0)}s
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
