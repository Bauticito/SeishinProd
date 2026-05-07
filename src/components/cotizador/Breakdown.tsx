import { useState } from "react";
import type { QuoteBreakdown } from "@/lib/types";

type BreakdownProps = {
  breakdown: QuoteBreakdown;
};

function formatMXN(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function Breakdown({ breakdown }: BreakdownProps) {
  const [open, setOpen] = useState(false);

  const rows = [
    { label: "Base", monthly: breakdown.baseMonthly, setup: breakdown.baseSetup },
    { label: "Cámaras", monthly: breakdown.camerasMonthly, setup: breakdown.camerasSetup },
    { label: "Riesgo", monthly: breakdown.riskMonthly, setup: breakdown.riskSetup },
    { label: "Cobertura", monthly: breakdown.coverageMonthly, setup: breakdown.coverageSetup },
    { label: "Nivel IA", monthly: breakdown.intelligenceMonthly, setup: breakdown.intelligenceSetup },
    { label: "Privacidad", monthly: breakdown.privacyMonthly, setup: breakdown.privacySetup },
    { label: "Instalación", monthly: breakdown.installMonthly, setup: breakdown.installSetup },
    { label: "Descuento", monthly: breakdown.volumeDiscountMonthly, setup: breakdown.volumeDiscountSetup },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border-color-light)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-white/80 hover:text-white transition-colors"
      >
        <span>Ver desglose</span>
        <span className="text-[var(--accent-primary)] text-xs font-black tracking-wider">{open ? "▲ Ocultar" : "▼ Mostrar"}</span>
      </button>

      {open && (
        <div className="border-t border-[var(--border-color-light)] divide-y divide-[var(--border-color-light)]">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-3 gap-2 px-4 py-2 text-xs hover:bg-white/5 transition-colors">
              <span className="text-white/50">{row.label}</span>
              <span className="text-right text-white/80">{formatMXN(row.monthly)}/mes</span>
              <span className="text-right text-white/60">{formatMXN(row.setup)} ini.</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
