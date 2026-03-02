import { useEffect, useMemo, useState } from "react";
import { Gauge } from "lucide-react";
import { useJarvisMetrics } from "@/hooks/useJarvis";

export function LiveFpsWidget() {
  const { data, isError } = useJarvisMetrics();
  const fps = data?.fps ?? 0;
  const fpsColor = fps >= 24 ? "text-status-ok" : fps >= 15 ? "text-status-warning" : "text-status-error";
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    setHistory((prev) => [...prev.slice(-29), fps]);
  }, [fps]);

  const points = useMemo(() => {
    const values = history.length > 1 ? history : [0, fps];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    const width = 420;
    const height = 120;
    return values
      .map((v, i) => {
        const x = (i / (values.length - 1)) * (width - 8) + 4;
        const y = height - (((v - min) / range) * (height - 16) + 8);
        return `${x},${y}`;
      })
      .join(" ");
  }, [history, fps]);

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="w-4 h-4 text-primary" />
        <p className="metric-label">FPS EN VIVO</p>
        {isError && <span className="ml-auto text-[10px] font-mono text-status-error">OFFLINE</span>}
      </div>

      <div className="bg-background rounded p-2 border border-border">
        <svg viewBox="0 0 420 120" className="w-full h-24">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={fpsColor}
            points={points}
          />
        </svg>
        <p className="text-[10px] font-mono text-muted-foreground text-center mt-1">
          FPS actual: <span className={fpsColor}>{fps}</span>
        </p>
      </div>
    </div>
  );
}
