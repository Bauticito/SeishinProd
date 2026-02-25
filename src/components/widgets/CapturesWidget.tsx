import { Camera } from "lucide-react";
import { useJarvisMetrics } from "@/hooks/useJarvis";

const classIcons: Record<string, string> = {
  person: "🚶",
  car: "🚗",
  truck: "🚚",
  motorcycle: "🏍️",
  bicycle: "🚲",
  bus: "🚌",
};

export function CapturesWidget() {
  const { data: metrics } = useJarvisMetrics();
  const captures = metrics?.captures_by_type ?? {};

  const entries = Object.entries(captures).length > 0
    ? Object.entries(captures)
    : [["person", 0], ["car", 0], ["truck", 0]];

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-4 h-4 text-primary" />
        <p className="metric-label">CAPTURAS POR TIPO</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {entries.map(([type, count]) => (
          <div key={type} className="bg-background rounded p-2 text-center border border-border">
            <p className="text-lg">{classIcons[type as string] ?? "📦"}</p>
            <p className="text-lg font-mono font-bold text-primary">{count}</p>
            <p className="text-[9px] font-mono text-muted-foreground uppercase">{type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
