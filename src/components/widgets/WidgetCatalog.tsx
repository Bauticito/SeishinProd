import { Plus, X, GripVertical, LayoutDashboard } from "lucide-react";
import { agentRegistry } from "@/services/agentRegistry";

interface WidgetCatalogProps {
  activeWidgetIds: string[];
  onToggleWidget: (widgetId: string) => void;
  onClose: () => void;
}

export function WidgetCatalog({ activeWidgetIds, onToggleWidget, onClose }: WidgetCatalogProps) {
  const allWidgets = agentRegistry.getAllWidgets();

  // Group widgets by agent
  const grouped = new Map<string, typeof allWidgets>();
  for (const w of allWidgets) {
    const list = grouped.get(w.agentId) ?? [];
    list.push(w);
    grouped.set(w.agentId, list);
  }

  return (
    <div className="metric-card border-primary/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-primary" />
          <p className="metric-label">CONFIGURAR WIDGETS</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs font-mono text-muted-foreground mb-4">
        Selecciona los widgets que quieres ver en tu dashboard. Cada agente desplegado aporta sus propios widgets.
      </p>

      {Array.from(grouped.entries()).map(([agentId, widgets]) => (
        <div key={agentId} className="mb-4">
          <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-2">
            {widgets[0].agentName}
          </p>
          <div className="space-y-1">
            {widgets.map((w) => {
              const isActive = activeWidgetIds.includes(w.id);
              return (
                <button
                  key={w.id}
                  onClick={() => onToggleWidget(w.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors ${
                    isActive
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-background border border-border hover:border-muted-foreground"
                  }`}
                >
                  <GripVertical className="w-3 h-3 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono font-medium truncate">
                      {w.name}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground truncate">
                      {w.description}
                    </p>
                  </div>
                  {isActive ? (
                    <X className="w-3.5 h-3.5 text-status-error shrink-0" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
