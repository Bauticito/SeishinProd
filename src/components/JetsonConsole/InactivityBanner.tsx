import { useAuth } from "@/context/AuthContext";
import { AlertTriangle } from "lucide-react";

export function InactivityBanner() {
  const { inactivityWarning, dismissInactivityWarning, logout } = useAuth();

  if (!inactivityWarning) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-status-warning/10 border-b border-status-warning/40 px-4 py-2 flex items-center justify-center gap-3">
      <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
      <p className="text-xs font-mono text-status-warning">
        Sesión inactiva — se cerrará automáticamente en breve.
      </p>
      <button
        onClick={dismissInactivityWarning}
        className="text-xs font-mono px-3 py-1 rounded border border-status-warning/40 text-status-warning hover:bg-status-warning/10 transition-colors"
      >
        Continuar
      </button>
      <button
        onClick={logout}
        className="text-xs font-mono px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
