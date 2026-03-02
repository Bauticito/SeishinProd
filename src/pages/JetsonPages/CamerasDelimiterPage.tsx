import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPinned, Save, Trash2, Upload, X } from "lucide-react";
import { jarvisApi } from "@/services/jarvisApi";
import { jarvisZonesApi } from "@/services/jarvisZonesApi";

type ZoneDraft = {
  name: string;
  points: [number, number][];
  color: [number, number, number];
  classes: "all" | string[];
  alert: boolean;
  severity: string;
};

function normalizeZoneName(name: string) {
  return name.trim().toLowerCase();
}

function uniqueZoneName(existing: ZoneDraft[], base: string) {
  const trimmed = base.trim() || "zona";
  const existingNames = new Set(existing.map((z) => normalizeZoneName(z.name)));
  if (!existingNames.has(normalizeZoneName(trimmed))) return trimmed;
  let idx = 2;
  let candidate = `${trimmed}_${idx}`;
  while (existingNames.has(normalizeZoneName(candidate))) {
    idx += 1;
    candidate = `${trimmed}_${idx}`;
  }
  return candidate;
}

function toZoneDraftArray(raw: unknown, cameraKey: string): ZoneDraft[] {
  let zonesData: unknown = raw;

  if (Array.isArray(raw)) {
    zonesData = raw;
  } else if (raw && typeof raw === "object") {
    const asRecord = raw as Record<string, unknown>;
    if (Array.isArray(asRecord[cameraKey])) zonesData = asRecord[cameraKey];
    else if (Array.isArray(asRecord.zones)) zonesData = asRecord.zones;
    else zonesData = [];
  } else {
    zonesData = [];
  }

  if (!Array.isArray(zonesData)) return [];

  const parsed: ZoneDraft[] = [];
  for (const item of zonesData) {
    if (!item || typeof item !== "object") continue;
    const zone = item as Record<string, unknown>;
    const points = zone.points;
    if (!Array.isArray(points) || points.length < 3) continue;

    const parsedPoints: [number, number][] = [];
    let validPoints = true;
    for (const point of points) {
      if (!Array.isArray(point) || point.length !== 2) {
        validPoints = false;
        break;
      }
      const x = Number(point[0]);
      const y = Number(point[1]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        validPoints = false;
        break;
      }
      parsedPoints.push([Math.round(x), Math.round(y)]);
    }
    if (!validPoints) continue;

    const colorRaw = zone.color;
    const color: [number, number, number] =
      Array.isArray(colorRaw) && colorRaw.length === 3
        ? [Number(colorRaw[0]) || 0, Number(colorRaw[1]) || 255, Number(colorRaw[2]) || 255]
        : [0, 255, 255];

    parsed.push({
      name: String(zone.name || `zona_${parsed.length + 1}`),
      points: parsedPoints,
      color,
      classes: (zone.classes as "all" | string[]) ?? "all",
      alert: Boolean(zone.alert ?? true),
      severity: String(zone.severity ?? "HIGH"),
    });
  }
  return parsed;
}

export default function CamerasDelimiterPage() {
  const [zoneCameraKey, setZoneCameraKey] = useState("main");
  const [availableZoneCameras, setAvailableZoneCameras] = useState<string[]>(["main"]);
  const [zones, setZones] = useState<ZoneDraft[]>([]);
  const [newZoneName, setNewZoneName] = useState("zona_nueva");
  const [draftPoints, setDraftPoints] = useState<[number, number][]>([]);
  const [zoneMessage, setZoneMessage] = useState("Carga zonas para comenzar.");
  const [zoneBusy, setZoneBusy] = useState(false);
  const [snapshotKey, setSnapshotKey] = useState(0);
  const [pendingDraftZone, setPendingDraftZone] = useState<ZoneDraft | null>(null);
  const [pendingImportZones, setPendingImportZones] = useState<ZoneDraft[] | null>(null);
  const [pendingImportConflicts, setPendingImportConflicts] = useState<string[]>([]);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadCameras = async () => {
      try {
        const res = await jarvisZonesApi.getCameras();
        if (res.cameras.length > 0) {
          setAvailableZoneCameras(res.cameras);
          if (!res.cameras.includes(zoneCameraKey)) setZoneCameraKey(res.cameras[0]);
        }
      } catch {
        setZoneMessage("No se pudo cargar lista de cámaras de zonas.");
      }
    };
    loadCameras();
  }, [zoneCameraKey]);

  const loadZones = async (cameraKey: string) => {
    setZoneBusy(true);
    try {
      const res = await jarvisZonesApi.getZones(cameraKey);
      const loaded: ZoneDraft[] = res.zones.map((z) => ({
        name: z.name,
        points: z.points as [number, number][],
        color: z.color ?? [0, 255, 255],
        classes: z.classes ?? "all",
        alert: z.alert ?? true,
        severity: z.severity ?? "HIGH",
      }));
      setZones(loaded);
      setZoneMessage(`Cargadas ${loaded.length} zonas para '${cameraKey}'.`);
    } catch {
      setZoneMessage("Error cargando zonas.");
    } finally {
      setZoneBusy(false);
    }
  };

  const saveZones = async () => {
    setZoneBusy(true);
    try {
      await jarvisZonesApi.saveZones(zoneCameraKey, zones);
      setZoneMessage(`Zonas guardadas para '${zoneCameraKey}'. Si es la cámara activa, se aplican al vuelo.`);
    } catch {
      setZoneMessage("Error al guardar zonas.");
    } finally {
      setZoneBusy(false);
    }
  };

  const onSnapshotClick = (event: MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 1280);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 720);
    setDraftPoints((prev) => [...prev, [x, y]]);
  };

  const addDraftZone = () => {
    if (draftPoints.length < 3) {
      setZoneMessage("Necesitas mínimo 3 puntos para crear una zona.");
      return;
    }
    const zone: ZoneDraft = {
      name: newZoneName.trim() || `zona_${zones.length + 1}`,
      points: draftPoints,
      color: [0, 255, 255],
      classes: "all",
      alert: true,
      severity: "HIGH",
    };
    const exists = zones.some((z) => normalizeZoneName(z.name) === normalizeZoneName(zone.name));
    if (exists) {
      setPendingDraftZone(zone);
      setZoneMessage(`La zona '${zone.name}' ya existe. ¿Quieres reemplazar sus coordenadas por las nuevas?`);
      return;
    }
    setZones((prev) => [...prev, zone]);
    setDraftPoints([]);
    setZoneMessage(`Zona '${zone.name}' agregada. Guarda para persistir.`);
  };

  const removeZone = (index: number) => setZones((prev) => prev.filter((_, i) => i !== index));
  const closeDraft = draftPoints.length >= 3 ? [...draftPoints, draftPoints[0]] : draftPoints;

  const replaceExistingZoneWithDraft = () => {
    if (!pendingDraftZone) return;
    const next = zones.map((z) =>
      normalizeZoneName(z.name) === normalizeZoneName(pendingDraftZone.name) ? pendingDraftZone : z,
    );
    setZones(next);
    setDraftPoints([]);
    setPendingDraftZone(null);
    setZoneMessage(`Coordenadas reemplazadas para '${pendingDraftZone.name}'.`);
  };

  const addDraftAsNewName = () => {
    if (!pendingDraftZone) return;
    const withNewName = { ...pendingDraftZone, name: uniqueZoneName(zones, pendingDraftZone.name) };
    setZones((prev) => [...prev, withNewName]);
    setDraftPoints([]);
    setPendingDraftZone(null);
    setZoneMessage(`Zona agregada como '${withNewName.name}'. Guarda para persistir.`);
  };

  const openImportPicker = () => importInputRef.current?.click();

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      const imported = toZoneDraftArray(raw, zoneCameraKey);
      if (imported.length === 0) {
        setZoneMessage("El JSON importado no contiene zonas válidas.");
        return;
      }

      const existingNames = new Set(zones.map((z) => normalizeZoneName(z.name)));
      const conflicts = imported.map((z) => z.name).filter((name) => existingNames.has(normalizeZoneName(name)));

      if (conflicts.length > 0) {
        setPendingImportZones(imported);
        setPendingImportConflicts(conflicts);
        setZoneMessage(`Importación detectó ${conflicts.length} zona(s) existente(s): ${conflicts.join(", ")}.`);
      } else {
        setZones((prev) => [...prev, ...imported]);
        setZoneMessage(`Importadas ${imported.length} zonas nuevas. Guarda para persistir.`);
      }
    } catch {
      setZoneMessage("No se pudo importar el JSON (archivo inválido).");
    } finally {
      event.target.value = "";
    }
  };

  const applyImportedZones = (replaceConflicts: boolean) => {
    if (!pendingImportZones) return;
    const incomingByName = new Map(pendingImportZones.map((z) => [normalizeZoneName(z.name), z] as const));
    const next: ZoneDraft[] = [];

    for (const existing of zones) {
      const key = normalizeZoneName(existing.name);
      if (incomingByName.has(key)) {
        next.push(replaceConflicts ? incomingByName.get(key)! : existing);
        incomingByName.delete(key);
      } else {
        next.push(existing);
      }
    }
    for (const zone of incomingByName.values()) next.push(zone);

    setZones(next);
    setZoneMessage(replaceConflicts ? "Importación aplicada reemplazando coordenadas." : "Importación aplicada sin reemplazar conflictos.");
    setPendingImportZones(null);
    setPendingImportConflicts([]);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-3">
        <MapPinned className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">DELIMITADOR DE ZONAS</h1>
        <Link to="/cameras" className="ml-auto status-indicator px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3 h-3" />
          Volver a Cámaras
        </Link>
      </div>

      <div className="glow-line" />

      <div className="bg-background border border-border rounded p-3 text-xs font-mono text-muted-foreground">
        Flujo: 1) Cargar zonas, 2) Click para puntos, 3) Cerrar y agregar, 4) Guardar JSON.
        <br />
        Para verlo en inferencia al instante, delimita y guarda sobre la cámara activa de Jarvis (normalmente <span className="text-foreground">main</span>).
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
        <label className="space-y-1 md:col-span-2">
          <span className="text-muted-foreground">Cámara (clave backend)</span>
          <select value={zoneCameraKey} onChange={(e) => setZoneCameraKey(e.target.value)} className="w-full bg-background border border-border rounded px-2 py-1.5">
            {availableZoneCameras.map((cam) => <option key={cam} value={cam}>{cam}</option>)}
          </select>
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-muted-foreground">Nombre nueva zona</span>
          <input value={newZoneName} onChange={(e) => setNewZoneName(e.target.value)} className="w-full bg-background border border-border rounded px-2 py-1.5" />
        </label>
        <div className="flex items-end">
          <button onClick={() => setSnapshotKey((k) => k + 1)} className="w-full text-xs font-mono px-3 py-1.5 rounded border border-border hover:border-primary/40">Refrescar frame</button>
        </div>
      </div>

      <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 min-h-0">
        <div className="relative w-full max-w-[1000px] aspect-video border border-border rounded overflow-hidden bg-black">
          <img key={snapshotKey} src={`${jarvisApi.getSnapshotUrl()}?t=${snapshotKey}`} alt="Snapshot para delimitación" className="absolute inset-0 w-full h-full object-fill cursor-crosshair" onClick={onSnapshotClick} />
          <svg viewBox="0 0 1280 720" className="absolute inset-0 w-full h-full pointer-events-none">
            {zones.map((zone, idx) => (
              <polygon key={`${zone.name}-${idx}`} points={zone.points.map((p) => `${p[0]},${p[1]}`).join(" ")} fill="rgba(255,255,0,0.18)" stroke="rgb(255,255,0)" strokeWidth={2} />
            ))}
            {closeDraft.length > 1 && (
              <polyline points={closeDraft.map((p) => `${p[0]},${p[1]}`).join(" ")} fill={draftPoints.length >= 3 ? "rgba(0,255,255,0.15)" : "none"} stroke="rgb(0,255,255)" strokeWidth={2} />
            )}
            {draftPoints.map((p, idx) => <circle key={`draft-${idx}`} cx={p[0]} cy={p[1]} r={6} fill="rgb(0,255,255)" />)}
          </svg>
        </div>

        <div className="space-y-3 overflow-auto">
          <div className="bg-background border border-border rounded p-3 text-xs font-mono text-muted-foreground">
            Draft: <span className="text-foreground">{draftPoints.length}</span> puntos
            <br />
            Zonas cargadas: <span className="text-foreground">{zones.length}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => loadZones(zoneCameraKey)} disabled={zoneBusy} className="text-xs font-mono px-3 py-1.5 rounded border border-border hover:border-primary/40 disabled:opacity-60">Cargar zonas</button>
            <button onClick={addDraftZone} disabled={zoneBusy || draftPoints.length < 3} className="text-xs font-mono px-3 py-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-60">Cerrar y agregar</button>
            <button onClick={() => setDraftPoints([])} disabled={zoneBusy || draftPoints.length === 0} className="text-xs font-mono px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-60"><X className="w-3 h-3 inline mr-1" />Limpiar draft</button>
            <button onClick={saveZones} disabled={zoneBusy} className="text-xs font-mono px-3 py-1.5 rounded border border-status-ok/40 text-status-ok hover:bg-status-ok/10 disabled:opacity-60"><Save className="w-3 h-3 inline mr-1" />Guardar JSON</button>
            <button onClick={openImportPicker} disabled={zoneBusy} className="text-xs font-mono px-3 py-1.5 rounded border border-border hover:border-primary/40 disabled:opacity-60"><Upload className="w-3 h-3 inline mr-1" />Importar JSON</button>
          </div>

          {pendingDraftZone && (
            <div className="bg-background border border-status-warning/40 rounded p-3 space-y-2 text-xs font-mono">
              <p className="text-status-warning">La zona '{pendingDraftZone.name}' ya existe. ¿Quieres reemplazar sus coordenadas por las nuevas?</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={replaceExistingZoneWithDraft} className="px-3 py-1.5 rounded border border-status-warning/40 text-status-warning hover:bg-status-warning/10">Sí, reemplazar</button>
                <button onClick={addDraftAsNewName} className="px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground">No, crear otra</button>
                <button onClick={() => setPendingDraftZone(null)} className="px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground">Cancelar</button>
              </div>
            </div>
          )}

          {pendingImportZones && (
            <div className="bg-background border border-status-warning/40 rounded p-3 space-y-2 text-xs font-mono">
              <p className="text-status-warning">Conflictos de nombres: {pendingImportConflicts.join(", ")}.</p>
              <p className="text-muted-foreground">¿Modificar coordenadas actuales por las nuevas?</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => applyImportedZones(true)} className="px-3 py-1.5 rounded border border-status-warning/40 text-status-warning hover:bg-status-warning/10">Sí, reemplazar</button>
                <button onClick={() => applyImportedZones(false)} className="px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground">No, conservar actuales</button>
                <button onClick={() => { setPendingImportZones(null); setPendingImportConflicts([]); }} className="px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground">Cancelar</button>
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-auto space-y-2 pr-1">
            {zones.map((z, i) => (
              <div key={`${z.name}-${i}`} className="bg-background border border-border rounded p-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-foreground">{z.name}</span>
                  <span className="text-muted-foreground ml-auto">{z.points.length} pts</span>
                  <button onClick={() => removeZone(i)} className="text-status-error hover:opacity-80" title="Eliminar zona"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs font-mono text-muted-foreground">{zoneMessage}</div>
        </div>
      </div>
    </div>
  );
}
