import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Wrench } from "lucide-react";
import { cameraInventory } from "@/lib/cameraInventory";

export default function CamerasPage() {
  const navigate = useNavigate();

  const health = useMemo(() => {
    const online = cameraInventory.filter((c) => c.status === "online").length;
    const warning = cameraInventory.filter((c) => c.status === "warning").length;
    const offline = cameraInventory.filter((c) => c.status === "offline").length;
    return { online, warning, offline };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Camera className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">CÁMARAS</h1>
        <span className="ml-auto status-indicator border border-border text-muted-foreground">
          Visible solo para OPERADOR / SUPERADMIN
        </span>
      </div>

      <div className="glow-line" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <p className="metric-label">Cámaras Online</p>
          <p className="metric-value text-xl text-status-ok">{health.online}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Con Degradación</p>
          <p className="metric-value text-xl text-status-warning">{health.warning}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Offline</p>
          <p className="metric-value text-xl text-status-error">{health.offline}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Total</p>
          <p className="metric-value text-xl">{cameraInventory.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="metric-card">
          <p className="metric-label mb-2">Inventario y Estado</p>
          <p className="text-xs font-mono text-muted-foreground mb-3">
            Estado detallado por cámara, endpoint, FPS, latencia y pérdida.
          </p>
          <button
            onClick={() => navigate("/cameras/inventory")}
            className="text-xs font-mono px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10"
          >
            Abrir Inventario
          </button>
        </div>

        <div className="metric-card">
          <p className="metric-label mb-2">Validación y Onboarding</p>
          <p className="text-xs font-mono text-muted-foreground mb-3">
            Wizard de onboarding, pruebas automáticas y jobs de validación.
          </p>
          <button
            onClick={() => navigate("/cameras/validation")}
            className="text-xs font-mono px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10"
          >
            Abrir Validación
          </button>
        </div>
      </div>

      <div className="metric-card">
        <p className="metric-label mb-2">Delimitación de Zonas</p>
        <p className="text-xs font-mono text-muted-foreground mb-3">
          Editor visual de zonas con importación JSON y reemplazo de coordenadas.
        </p>
        <button
          onClick={() => navigate("/cameras/delimiter")}
          className="text-xs font-mono px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10"
        >
          Abrir Delimitador
        </button>
      </div>

      <div className="metric-card">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="w-4 h-4 text-primary" />
          <p className="metric-label">Fase 2 de Modularización</p>
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          La validación se movió a <span className="text-foreground">/cameras/validation</span> y el delimitador a{" "}
          <span className="text-foreground">/cameras/delimiter</span>.
        </p>
      </div>
    </div>
  );
}
