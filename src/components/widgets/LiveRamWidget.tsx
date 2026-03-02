import { useEffect, useMemo, useState } from "react";
import { MemoryStick } from "lucide-react";
import { useJarvisSystemStats } from "@/hooks/useJarvis";

export function LiveRamWidget() {
  const { data, isError } = useJarvisSystemStats();
  const ram = data?.ram_percent ?? null;
  const [history, setHistory] = useState<number[]>([]);

  const ramColor =
    ram == null ? "text-muted-foreground" : ram >= 90 ? "text-status-error" : ram >= 75 ? "text-status-warning" : "text-status-ok";

  useEffect(() => {
    if (ram == null) return;
    setHistory((prev) => [...prev.slice(-29), ram]);
  }, [ram]);

  const points = useMemo(() => {
    const last = ram ?? 0;
    const values = history.length > 1 ? history : [0, last];
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
  }, [history, ram]);

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-3">
        <MemoryStick className="w-4 h-4 text-primary" />
        <p className="metric-label">RAM EN VIVO</p>
        {isError && <span className="ml-auto text-[10px] font-mono text-status-error">OFFLINE</span>}
      </div>

      <div className="bg-background rounded p-2 border border-border">
        <svg viewBox="0 0 420 120" className="w-full h-24">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={ramColor}
            points={points}
          />
        </svg>
        <p className="text-[10px] font-mono text-muted-foreground text-center mt-1">
          RAM actual: <span className={ramColor}>{ram == null ? "--" : `${ram.toFixed(0)}%`}</span>
        </p>
      </div>
    </div>
  );
}
