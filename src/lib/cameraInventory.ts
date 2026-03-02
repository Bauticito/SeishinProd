export type CameraKind = "RTSP" | "USB/UVC" | "ONVIF" | "GStreamer";
export type CameraStatus = "online" | "warning" | "offline";

export type CameraDevice = {
  id: string;
  name: string;
  kind: CameraKind;
  endpoint: string;
  status: CameraStatus;
  fpsIngest: number;
  fpsInference: number;
  latencyMs: number;
  packetLoss: number;
  lastFrame: string;
};

export const cameraInventory: CameraDevice[] = [
  {
    id: "cam-01",
    name: "Linea-A Norte",
    kind: "RTSP",
    endpoint: "rtsp://operator:******@192.168.40.12:554/stream1",
    status: "online",
    fpsIngest: 30,
    fpsInference: 28,
    latencyMs: 42,
    packetLoss: 0.2,
    lastFrame: "2026-02-19 16:11:20",
  },
  {
    id: "cam-02",
    name: "Linea-B Empaque",
    kind: "ONVIF",
    endpoint: "rtsp://service:******@10.1.7.33:554/ch0",
    status: "warning",
    fpsIngest: 24,
    fpsInference: 18,
    latencyMs: 88,
    packetLoss: 2.9,
    lastFrame: "2026-02-19 16:11:18",
  },
  {
    id: "cam-03",
    name: "QA USB #2",
    kind: "USB/UVC",
    endpoint: "/dev/video2",
    status: "offline",
    fpsIngest: 0,
    fpsInference: 0,
    latencyMs: 0,
    packetLoss: 0,
    lastFrame: "2026-02-19 15:47:01",
  },
];

export const AUTOMATION_CAMERA_PREF_KEY = "thor-preferred-automation-camera";
