import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, PlugZap, Radar } from "lucide-react";
import { PermissionGate } from "@/components/PermissionGate";
import { AUTOMATION_CAMERA_PREF_KEY, cameraInventory } from "@/lib/cameraInventory";

type TestJob = {
  id: string;
  cameraId: string;
  type: "Smoke" | "Soak" | "Failover";
  startedAt: string;
  duration: string;
  result: "PASS" | "WARN" | "FAIL";
  note: string;
};

const testJobs: TestJob[] = [
  {
    id: "job-1001",
    cameraId: "cam-01",
    type: "Smoke",
    startedAt: "2026-02-19 16:00:00",
    duration: "01m 13s",
    result: "PASS",
    note: "RTSP ok, auth ok, decode HW NVDEC activo.",
  },
  {
    id: "job-1002",
    cameraId: "cam-02",
    type: "Soak",
    startedAt: "2026-02-19 15:20:00",
    duration: "45m 00s",
    result: "WARN",
    note: "Jitter elevado y caída intermitente de FPS.",
  },
  {
    id: "job-1003",
    cameraId: "cam-03",
    type: "Smoke",
    startedAt: "2026-02-19 15:48:00",
    duration: "00m 20s",
    result: "FAIL",
    note: "Dispositivo no disponible en host Jetson.",
  },
];

const vendorTemplates = [
  "Hikvision RTSP Main/Substream",
  "Dahua RTSP",
  "Axis ONVIF",
  "Genérico GStreamer",
];

function resultClasses(result: TestJob["result"]) {
  if (result === "PASS") return "text-status-ok";
  if (result === "WARN") return "text-status-warning";
  return "text-status-error";
}

function cameraLabelById(id: string) {
  const cam = cameraInventory.find((c) => c.id === id);
  return cam ? cam.name : id;
}

export default function CamerasValidationPage() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(vendorTemplates[0]);
  const [scheduleMinutes, setScheduleMinutes] = useState(5);
  const [selectedTestType, setSelectedTestType] = useState<"Smoke" | "Soak" | "Failover">("Smoke");
  const [selectedCameraId, setSelectedCameraId] = useState(cameraInventory[0].id);
  const [diagnosis, setDiagnosis] = useState("Listo para ejecutar pruebas.");

  const runTest = () => {
    const cam = cameraInventory.find((c) => c.id === selectedCameraId);
    if (!cam) return;

    if (cam.status === "offline") {
      setDiagnosis("FAIL: cámara no detectada en host. Verifica cableado/puerto y permisos de dispositivo.");
      return;
    }
    if (cam.status === "warning") {
      setDiagnosis("WARN: conectividad inestable. Sugerencia: usar substream y validar jitter.");
      return;
    }
    setDiagnosis(
      `PASS: ${cam.name} estable. Decode HW activo, latencia ${cam.latencyMs}ms, pérdida ${cam.packetLoss.toFixed(1)}%.`,
    );
  };

  const openAutomationsWithCamera = () => {
    localStorage.setItem(AUTOMATION_CAMERA_PREF_KEY, selectedCameraId);
    navigate("/automations");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Camera className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">VALIDACIÓN DE CÁMARAS</h1>
        <Link
          to="/cameras"
          className="ml-auto status-indicator px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Volver a Cámaras
        </Link>
      </div>

      <div className="glow-line" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="metric-card space-y-4">
          <div className="flex items-center gap-2">
            <PlugZap className="w-4 h-4 text-primary" />
            <p className="metric-label">Onboarding de Cámara (Wizard)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <label className="space-y-1">
              <span className="text-muted-foreground">Plantilla fabricante</span>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-background border border-border rounded px-2 py-1.5"
              >
                {vendorTemplates.map((tpl) => (
                  <option key={tpl}>{tpl}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-muted-foreground">Tipo de conexión</span>
              <select className="w-full bg-background border border-border rounded px-2 py-1.5">
                <option>RTSP</option>
                <option>ONVIF</option>
                <option>USB/UVC</option>
                <option>GStreamer</option>
              </select>
            </label>

            <label className="space-y-1 md:col-span-2">
              <span className="text-muted-foreground">Endpoint (enmascarado en UI)</span>
              <input
                defaultValue="rtsp://usuario:******@192.168.40.50:554/stream"
                className="w-full bg-background border border-border rounded px-2 py-1.5"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <button className="text-xs font-mono px-3 py-2 rounded border border-border hover:border-primary/40">1) Reachability</button>
            <button className="text-xs font-mono px-3 py-2 rounded border border-border hover:border-primary/40">2) Auth</button>
            <button className="text-xs font-mono px-3 py-2 rounded border border-border hover:border-primary/40">3) Stream Open</button>
            <button className="text-xs font-mono px-3 py-2 rounded border border-border hover:border-primary/40">4) FPS/Latencia</button>
            <button className="text-xs font-mono px-3 py-2 rounded border border-border hover:border-primary/40">5) NVDEC Check</button>
            <button className="text-xs font-mono px-3 py-2 rounded border border-border hover:border-primary/40">6) Certificar</button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={openAutomationsWithCamera}
              className="text-xs font-mono px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10"
            >
              Configurar agente para esta cámara
            </button>
          </div>
        </div>

        <div className="metric-card space-y-4">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-primary" />
            <p className="metric-label">Pruebas Automáticas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <label className="space-y-1">
              <span className="text-muted-foreground">Cámara</span>
              <select
                value={selectedCameraId}
                onChange={(e) => setSelectedCameraId(e.target.value)}
                className="w-full bg-background border border-border rounded px-2 py-1.5"
              >
                {cameraInventory.map((cam) => (
                  <option key={cam.id} value={cam.id}>
                    {cam.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-muted-foreground">Tipo de test</span>
              <select
                value={selectedTestType}
                onChange={(e) => setSelectedTestType(e.target.value as "Smoke" | "Soak" | "Failover")}
                className="w-full bg-background border border-border rounded px-2 py-1.5"
              >
                <option>Smoke</option>
                <option>Soak</option>
                <option>Failover</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-muted-foreground">Frecuencia (min)</span>
              <input
                type="number"
                min={1}
                value={scheduleMinutes}
                onChange={(e) => setScheduleMinutes(Number(e.target.value) || 1)}
                className="w-full bg-background border border-border rounded px-2 py-1.5"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <PermissionGate permission="cameras.test.run" fallback="disable">
              <button
                onClick={runTest}
                className="text-xs font-mono px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10"
              >
                Ejecutar test ahora
              </button>
            </PermissionGate>

            <PermissionGate permission="cameras.test.schedule" fallback="disable">
              <button className="text-xs font-mono px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground">
                Guardar programación automática
              </button>
            </PermissionGate>
          </div>

          <div className="bg-background border border-border rounded p-3 text-xs font-mono text-muted-foreground">
            Diagnóstico: <span className="text-foreground">{diagnosis}</span>
          </div>
        </div>
      </div>

      <div className="metric-card overflow-x-auto">
        <p className="metric-label mb-3">Historial de Jobs de Validación</p>
        <table className="table-industrial">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cámara</th>
              <th>Tipo</th>
              <th>Inicio</th>
              <th>Duración</th>
              <th>Resultado</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {testJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{cameraLabelById(job.cameraId)}</td>
                <td>{job.type}</td>
                <td className="text-muted-foreground">{job.startedAt}</td>
                <td>{job.duration}</td>
                <td className={resultClasses(job.result)}>{job.result}</td>
                <td className="text-muted-foreground text-[11px]">{job.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
