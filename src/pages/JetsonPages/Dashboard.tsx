import { useState, useCallback, useEffect, type ComponentType } from "react";
import { Activity, Settings2, Save } from "lucide-react";
import { useJarvisHealth } from "@/hooks/useJarvis";
import {
  ContentionWidget,
  MetricsWidget,
  CapturesWidget,
  ZonesWidget,
  AlertsWidget,
  LiveRamWidget,
  LiveFpsWidget,
  PerformanceProfileWidget,
  WidgetCatalog,
} from "@/components/widgets";

const widgetComponents: Record<string, ComponentType> = {
  "jarvis-contention": ContentionWidget,
  "jarvis-metrics": MetricsWidget,
  "jarvis-captures": CapturesWidget,
  "jarvis-zones": ZonesWidget,
  "jarvis-alerts": AlertsWidget,
  "jarvis-live-ram": LiveRamWidget,
  "jarvis-live-fps": LiveFpsWidget,
  "jarvis-performance-profile": PerformanceProfileWidget,
};

const widgetSizes: Record<string, string> = {
  "jarvis-contention": "col-span-1",
  "jarvis-metrics": "col-span-1 row-span-2",
  "jarvis-captures": "col-span-1",
  "jarvis-zones": "col-span-1",
  "jarvis-alerts": "col-span-1 md:col-span-2 lg:col-span-1 row-span-2",
  "jarvis-live-ram": "col-span-1",
  "jarvis-live-fps": "col-span-1",
  "jarvis-performance-profile": "col-span-1",
};

const STORAGE_KEY = "thor-dashboard-widgets";
const DEFAULT_WIDGETS = [
  "jarvis-contention",
  "jarvis-metrics",
  "jarvis-live-fps",
  "jarvis-live-ram",
  "jarvis-performance-profile",
  "jarvis-captures",
  "jarvis-zones",
  "jarvis-alerts",
];

function loadSavedWidgets(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        return parsed;
      }
    }
  } catch { /* ignore */ }
  return DEFAULT_WIDGETS;
}

export default function Dashboard() {
  const [activeWidgets, setActiveWidgets] = useState<string[]>(loadSavedWidgets);
  const [showCatalog, setShowCatalog] = useState(false);
  const { data: health } = useJarvisHealth();

  const jarvisOnline = health?.status === "ok" || health?.status === "running";

  const toggleWidget = useCallback((widgetId: string) => {
    setActiveWidgets((prev) => {
      const next = prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId];
      return next;
    });
  }, []);

  const saveLayout = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeWidgets));
  }, [activeWidgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeWidgets));
  }, [activeWidgets]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Activity className="w-5 h-5 text-[#E31E24]" />
        <h1 className="text-lg font-mono font-semibold tracking-widest uppercase text-[var(--text-primary)]">
          Dashboard
        </h1>

        {/* Jarvis status */}
        <div className="flex items-center gap-2 ml-4">
          <span
            className={`w-2 h-2 rounded-full ${
              jarvisOnline
                ? "bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                : "bg-[#E31E24]"
            }`}
          />
          <span className="text-[10px] font-mono text-[var(--text-secondary)]">
            JARVIS {jarvisOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={saveLayout}
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--border-color-light)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#E31E24]/40 transition-all duration-200"
          >
            <Save className="w-3 h-3" />
            GUARDAR
          </button>
          <button
            onClick={() => setShowCatalog(!showCatalog)}
            className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-200 ${
              showCatalog
                ? "border-[#E31E24]/50 bg-[#E31E24]/10 text-[#E31E24]"
                : "border-[var(--border-color-light)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#E31E24]/40"
            }`}
          >
            <Settings2 className="w-3 h-3" />
            WIDGETS
          </button>
        </div>
      </div>

      <div className="glow-line" />

      {/* Widget catalog */}
      {showCatalog && (
        <WidgetCatalog
          activeWidgetIds={activeWidgets}
          onToggleWidget={toggleWidget}
          onClose={() => setShowCatalog(false)}
        />
      )}

      {/* Widget grid */}
      {activeWidgets.length === 0 ? (
        <div className="metric-card flex flex-col items-center justify-center py-16">
          <Settings2 className="w-10 h-10 text-[var(--text-secondary)] opacity-30 mb-3" />
          <p className="text-sm font-mono text-[var(--text-secondary)]">No hay widgets seleccionados</p>
          <button
            onClick={() => setShowCatalog(true)}
            className="mt-3 text-xs font-mono text-[#E31E24] hover:underline"
          >
            Configurar widgets
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
          {activeWidgets.map((widgetId) => {
            const Component = widgetComponents[widgetId];
            if (!Component) return null;
            const sizeClass = widgetSizes[widgetId] ?? "col-span-1";
            return (
              <div key={widgetId} className={sizeClass}>
                <Component />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
