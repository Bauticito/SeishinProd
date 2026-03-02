import { useEffect, useMemo, useState } from "react";
import { FileText, Download } from "lucide-react";
import { jarvisApi } from "@/services/jarvisApi";
import type { JarvisLogCategory, JarvisRuntimeLog } from "@/services/jarvisApi";

type LogCategory = Exclude<JarvisLogCategory, "all">;

const categories: { key: LogCategory; label: string }[] = [
  { key: "system", label: "Sistema" },
  { key: "gpu", label: "GPU" },
  { key: "inference", label: "Inferencia" },
  { key: "training", label: "Entrenamiento" },
  { key: "critical", label: "Errores Críticos" },
];

export default function LogsPage() {
  const [activeCategory, setActiveCategory] = useState<LogCategory>("system");
  const [logs, setLogs] = useState<JarvisRuntimeLog[]>([]);
  const [criticalCount, setCriticalCount] = useState(0);
  const [statusText, setStatusText] = useState("Conectando con backend...");

  useEffect(() => {
    let alive = true;
    let timeoutId: number | null = null;
    let inFlight = false;

    const nextDelay = () => (document.visibilityState === "visible" ? 2000 : 8000);

    const pullLogs = async () => {
      if (!alive || inFlight) return;
      inFlight = true;
      const [activeRes, criticalRes] = await Promise.allSettled([
        jarvisApi.getRuntimeLogs(activeCategory, 300),
        jarvisApi.getRuntimeLogs("critical", 300),
      ]);
      if (!alive) {
        inFlight = false;
        return;
      }

      if (activeRes.status === "fulfilled") {
        setLogs(activeRes.value.logs);
        setStatusText(`Mostrando ${activeRes.value.count} logs de ${activeCategory}.`);
      } else {
        setLogs([]);
        setStatusText("No se pudo leer la categoría seleccionada.");
      }

      if (criticalRes.status === "fulfilled") {
        setCriticalCount(criticalRes.value.count);
      } else {
        setCriticalCount(0);
      }

      inFlight = false;
      timeoutId = window.setTimeout(pullLogs, nextDelay());
    };

    const onVisibilityChange = () => {
      if (!alive) return;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(pullLogs, 150);
    };

    pullLogs();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      alive = false;
      inFlight = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [activeCategory]);

  const downloadableLogs = useMemo(
    () => logs.map((line) => `[${line.time_str}] ${line.category.toUpperCase()} ${line.message}`).join("\n"),
    [logs],
  );

  const exportLogs = () => {
    const blob = new Blob([downloadableLogs], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jarvis-logs-${activeCategory}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">LOGS</h1>
        <button
          onClick={exportLogs}
          className="ml-auto status-indicator px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download className="w-3 h-3" />
          EXPORTAR .LOG
        </button>
      </div>

      <div className="glow-line" />

      {/* Category Tabs */}
      <div className="flex gap-1 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${
              activeCategory === cat.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            }`}
          >
            {cat.label}
            {cat.key === "critical" && (
              <span className="ml-2 text-[10px] text-status-error">{criticalCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Log Output */}
      <div className="metric-card flex-1 min-h-0 overflow-auto">
        <div className="space-y-1">
          {logs.length === 0 && (
            <p className="text-xs font-mono text-muted-foreground">{statusText}</p>
          )}
          {logs.map((log, i) => (
            <p
              key={i}
              className={`text-xs font-mono leading-relaxed ${
                log.category === "critical"
                  ? "text-status-error"
                  : log.message.toUpperCase().includes("WRN")
                  ? "text-status-warning"
                  : "text-muted-foreground"
              }`}
            >
              [{log.time_str}] {log.category.toUpperCase()} {log.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
