const BASE = "/api/agents/jarvis";

export type JarvisZone = {
  name: string;
  points: [number, number][];
  color?: [number, number, number];
  classes?: "all" | string[];
  alert?: boolean;
  severity?: string;
};

type ZonesResponse = {
  camera: string;
  zones: JarvisZone[];
};

type CamerasResponse = {
  cameras: string[];
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`Jarvis Zones API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const jarvisZonesApi = {
  getCameras: () => fetchJson<CamerasResponse>(`${BASE}/zones/cameras`),
  getZones: (camera: string) =>
    fetchJson<ZonesResponse>(`${BASE}/zones?camera=${encodeURIComponent(camera)}`),
  saveZones: (camera: string, zones: JarvisZone[]) =>
    fetchJson<ZonesResponse>(`${BASE}/zones?camera=${encodeURIComponent(camera)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zones }),
    }),
};
