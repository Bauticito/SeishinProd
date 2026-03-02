import { MapPin } from "lucide-react";
import { useJarvisMetrics } from "@/hooks/useJarvis";

export function ZonesWidget() {
  const { data: metrics } = useJarvisMetrics();
  const activeZones = metrics?.active_zones ?? [];
  const totalZones = metrics?.zones_monitored ?? 0;

  // Build zone names from what we know
  const zones: string[] = [];
  if (totalZones > 0) {
    zones.push("principal");
    for (let i = 1; i < totalZones; i++) {
      zones.push(`zona_${i}`);
    }
  }

  // Merge in any active zones we haven't listed yet
  for (const z of activeZones) {
    if (!zones.includes(z)) zones.push(z);
  }

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-primary" />
        <p className="metric-label">ZONAS MONITOR</p>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">
          {activeZones.length}/{zones.length} ACTIVAS
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {zones.length === 0 && (
          <p className="text-xs font-mono text-muted-foreground">Sin zonas configuradas</p>
        )}
        {zones.map((zone) => {
          const isActive = activeZones.includes(zone);
          return (
            <div
              key={zone}
              className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
                isActive
                  ? "border-status-error bg-red-500/10 text-status-error animate-pulse"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {zone}
            </div>
          );
        })}
      </div>
    </div>
  );
}
