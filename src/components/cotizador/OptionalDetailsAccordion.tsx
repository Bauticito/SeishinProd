import { useState } from "react";
import { useQuoteStore } from "@/lib/store";

const inputClass =
  "w-full rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-tertiary)]/30 px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[#E31E24]/60 transition-colors";

const selectClass =
  "w-full rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-tertiary)]/30 px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E31E24]/60 transition-colors appearance-none";

export function OptionalDetailsAccordion() {
  const [open, setOpen] = useState(false);
  const optional = useQuoteStore((s) => s.answers.optionalDetails);
  const updateOptionalDetails = useQuoteStore((s) => s.updateOptionalDetails);

  return (
    <div className="rounded-2xl border border-[var(--border-color-light)] glass overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">Detalles técnicos</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Opcional — solo si ya tienes esta info a mano</p>
        </div>
        <span
          className={[
            "text-xs font-black tracking-wider transition-colors",
            open ? "text-[#E31E24]" : "text-[var(--text-secondary)]",
          ].join(" ")}
        >
          {open ? "▲ Ocultar" : "▼ Mostrar"}
        </span>
      </button>

      {open && (
        <div className="grid gap-4 border-t border-[var(--border-color-light)] p-5 md:grid-cols-2">
          <label className="space-y-1.5 text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Marca / modelo
            </span>
            <input
              className={inputClass}
              value={optional.brandModel}
              onChange={(e) => updateOptionalDetails("brandModel", e.target.value)}
              placeholder="Ej. Hikvision DS-2CD"
            />
          </label>

          <label className="space-y-1.5 text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Nota de foto de etiqueta
            </span>
            <input
              className={inputClass}
              value={optional.labelPhotoNote}
              onChange={(e) => updateOptionalDetails("labelPhotoNote", e.target.value)}
              placeholder="Ej. Foto enviada por WhatsApp"
            />
          </label>

          <label className="space-y-1.5 text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Red local compartida
            </span>
            <select
              className={selectClass}
              value={optional.sameLocalNetwork}
              onChange={(e) =>
                updateOptionalDetails("sameLocalNetwork", e.target.value as "yes" | "no" | "unknown")
              }
            >
              <option value="yes">Sí</option>
              <option value="no">No</option>
              <option value="unknown">No sé</option>
            </select>
          </label>

          <label className="space-y-1.5 text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Prueba 5 min / cámara
            </span>
            <select
              className={selectClass}
              value={optional.fiveMinTestPerCamera}
              onChange={(e) => updateOptionalDetails("fiveMinTestPerCamera", e.target.value as "yes" | "no")}
            >
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label className="space-y-1.5 text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Guardar capturas ante alerta
            </span>
            <select
              className={selectClass}
              value={optional.saveCaptures}
              onChange={(e) => updateOptionalDetails("saveCaptures", e.target.value as "yes" | "no")}
            >
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label className="space-y-1.5 text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Retención (días)
            </span>
            <input
              className={inputClass}
              type="number"
              min={1}
              max={365}
              value={optional.retentionDays}
              onChange={(e) => updateOptionalDetails("retentionDays", Number(e.target.value) || 1)}
            />
          </label>
        </div>
      )}
    </div>
  );
}
