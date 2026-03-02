import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Clock3, Cpu, RefreshCcw, Shield } from "lucide-react";
import { PermissionGate } from "@/components/PermissionGate";
import { cameraInventory } from "@/lib/cameraInventory";

function statusClasses(status: "online" | "warning" | "offline") {
  if (status === "online") return "status-dot-ok";
  if (status === "warning") return "status-dot-warning";
  return "status-dot-error";
}

export default function CamerasInventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Camera className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">INVENTARIO DE CÁMARAS</h1>
        <Link
          to="/cameras"
          className="ml-auto status-indicator px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Volver a Cámaras
        </Link>
      </div>

      <div className="glow-line" />

      <div className="metric-card overflow-x-auto">
        <p className="metric-label mb-3">Estado por Cámara</p>
        <table className="table-industrial">
          <thead>
            <tr>
              <th>Cámara</th>
              <th>Tipo</th>
              <th>Endpoint</th>
              <th>Estado</th>
              <th>FPS Ingest</th>
              <th>FPS Inferencia</th>
              <th>Latencia</th>
              <th>Loss</th>
              <th>Último Frame</th>
            </tr>
          </thead>
          <tbody>
            {cameraInventory.map((cam) => (
              <tr key={cam.id}>
                <td className="text-foreground font-medium">{cam.name}</td>
                <td>{cam.kind}</td>
                <td className="text-muted-foreground text-[11px]">{cam.endpoint}</td>
                <td>
                  <span className="status-indicator">
                    <span className={`status-dot ${statusClasses(cam.status)}`} />
                    {cam.status.toUpperCase()}
                  </span>
                </td>
                <td>{cam.fpsIngest}</td>
                <td>{cam.fpsInference}</td>
                <td>{cam.latencyMs}ms</td>
                <td>{cam.packetLoss.toFixed(1)}%</td>
                <td className="text-muted-foreground text-[11px]">{cam.lastFrame}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <p className="metric-label">Seguridad</p>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            Credenciales ocultas en UI. Nunca se exponen secretos.
          </p>
          <PermissionGate permission="cameras.credentials.rotate" fallback="disable">
            <button className="mt-3 text-xs font-mono px-3 py-1.5 rounded border border-status-warning/40 text-status-warning hover:bg-status-warning/10">
              Rotar credenciales de cámara
            </button>
          </PermissionGate>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-primary" />
            <p className="metric-label">Compatibilidad Jetson</p>
          </div>
          <div className="space-y-1 text-xs font-mono text-muted-foreground">
            <p>Codec: H264/H265</p>
            <p>Decode HW: NVDEC activo</p>
            <p>Uso ingestión: CPU 18% / GPU 22%</p>
            <p>Thermal throttling: no detectado</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock3 className="w-4 h-4 text-primary" />
            <p className="metric-label">Acciones Rápidas</p>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left text-xs font-mono px-3 py-1.5 rounded border border-border hover:border-primary/40">
              Re-ejecutar certificación
            </button>
            <button className="w-full text-left text-xs font-mono px-3 py-1.5 rounded border border-border hover:border-primary/40">
              Exportar reporte técnico
            </button>
            <button className="w-full text-left text-xs font-mono px-3 py-1.5 rounded border border-border hover:border-primary/40">
              <RefreshCcw className="w-3 h-3 inline mr-2" />
              Reiniciar ingestión de cámaras
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
