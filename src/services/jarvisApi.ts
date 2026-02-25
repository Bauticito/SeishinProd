// ============================================================
// Jarvis API Service — Typed client for Jarvis HTTP endpoints
// All calls go through Vite proxy: /api/agents/jarvis -> :8081
// ============================================================

const BASE = "/api/agents/jarvis";
// Direct URL for binary streams (MJPEG/snapshot) — Vite proxy buffers
// multipart/x-mixed-replace responses, so we bypass it for streams.
// Uses the same hostname the browser is on (works from localhost and LAN).
const STREAM_BASE = `http://${window.location.hostname}:8081`;

export interface JarvisHealth {
  status: string;
  version: string;
  uptime: string;
  device: string;
  contention_state: string;
}

export interface JarvisContention {
  state: "green" | "yellow" | "red";
  message: string;
  max_time_in_zone: number;
  time_remaining: number | null;
}

export interface JarvisMetrics {
  fps: number;
  tracked_count: number;
  total_detections: number;
  total_alerts: number;
  screenshots_taken: number;
  uptime: string;
  blind_camera_seconds: number;
  captures_by_type: Record<string, number>;
  active_zones: string[];
  zones_monitored: number;
  contention: JarvisContention;
}

export interface JarvisAlert {
  id: string;
  timestamp: number;
  time_str: string;
  zone: string;
  objects: string[];
  severity: string;
}

export type JarvisLogCategory = "all" | "system" | "gpu" | "inference" | "training" | "critical";

export interface JarvisRuntimeLog {
  timestamp: number;
  time_str: string;
  category: Exclude<JarvisLogCategory, "all">;
  message: string;
}

export interface JarvisRuntimeLogsResponse {
  category: JarvisLogCategory;
  count: number;
  logs: JarvisRuntimeLog[];
}

export interface JarvisSystemStats {
  gpu_percent: number | null;
  cpu_percent: number | null;
  ram_percent: number | null;
  temperature_c: number | null;
  power_w: number | null;
  model: string;
  service_status: string;
}

export interface JarvisRuntimeModules {
  inference: boolean;
  alerts: boolean;
  contention: boolean;
  overlays: boolean;
  stream: boolean;
}

export interface JarvisRuntimeConfig {
  conf_thres: number;
  imgsz: number;
  performance_profile: "eco" | "balanced" | "max";
  frame_skip: number;
  jpeg_quality: number;
  visible_classes: string[];
  available_classes: string[];
  debug_overlay: boolean;
  modules: JarvisRuntimeModules;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Jarvis API error: ${res.status} ${res.statusText}`);
  return res.json();
}

async function putJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Jarvis API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const jarvisApi = {
  getHealth: () => fetchJson<JarvisHealth>("/health"),
  getMetrics: () => fetchJson<JarvisMetrics>("/metrics"),
  getAlerts: () => fetchJson<JarvisAlert[]>("/alerts"),
  getContention: () => fetchJson<JarvisContention>("/contention"),
  getSystemStats: () => fetchJson<JarvisSystemStats>("/system-stats"),
  getRuntimeConfig: () => fetchJson<JarvisRuntimeConfig>("/runtime-config"),
  updateRuntimeConfig: (patch: Partial<JarvisRuntimeConfig>) =>
    putJson<JarvisRuntimeConfig>("/runtime-config", patch),
  getRuntimeLogs: (category: JarvisLogCategory = "all", limit = 200) =>
    fetchJson<JarvisRuntimeLogsResponse>(
      `/runtime-logs?category=${encodeURIComponent(category)}&limit=${limit}`,
    ),

  /** Returns the URL for the MJPEG stream (direct to backend, bypasses proxy) */
  getStreamUrl: () => `${STREAM_BASE}/stream`,

  /** Returns the URL for a single snapshot (direct to backend) */
  getSnapshotUrl: () => `${STREAM_BASE}/snapshot`,
};
