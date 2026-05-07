import { useState } from "react";
import { useQuoteStore } from "@/lib/store";
import { Breakdown } from "./Breakdown";
import { ProgressBar } from "./ProgressBar";
import { ProposalModal } from "./ProposalModal";
import { FileDown } from "lucide-react";
import { generateQuotePDF } from "@/lib/generateQuotePDF";

function formatMXN(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function PricePanelCard() {
  const quote = useQuoteStore((s) => s.quote);
  const answers = useQuoteStore((s) => s.answers);
  const [modalOpen, setModalOpen] = useState(false);

  const visionContext = {
    service: "Visión Computarizada",
    subService: "Análisis de Seguridad",
    quantity: answers.cameraRange,
    estimate: `${formatMXN(quote.setup)} setup + ${formatMXN(quote.monthly)}/mes`,
    setup: quote.setup,
    monthly: quote.monthly,
    riskScore: quote.riskScore,
    coverageLabel: quote.coverageLabel,
    breakdown: quote.breakdown as unknown as Record<string, number>,
    orderLines: [
      { name: "Visión Computarizada – Inversión inicial", qty: 1, price: quote.setup },
      { name: "Visión Computarizada – Costo mensual estimado", qty: 1, price: quote.monthly },
    ],
  };

  const handleDownloadPDF = () => {
    generateQuotePDF(visionContext);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-primary)] rounded-[2rem] p-6 md:p-8 text-[var(--text-primary)] space-y-6 shadow-2xl border border-[var(--border-color-light)]">
        {/* Inversión inicial */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-1">
            Inversión inicial estimada
          </p>
          <p className="text-3xl font-black text-[var(--text-primary)]">{formatMXN(quote.setup)}</p>
        </div>

        {/* Costo mensual */}
        <div className="border-t border-[var(--border-color-light)] pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-primary)] mb-1">
            Costo mensual estimado
          </p>
          <p className="text-5xl font-black text-[var(--text-primary)]">{formatMXN(quote.monthly)}</p>
        </div>

        <ProgressBar value={quote.riskScore} label={quote.coverageLabel} />
        <Breakdown breakdown={quote.breakdown} />

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary flex items-center justify-center gap-2 w-full py-3 text-sm"
          >
            Solicitar propuesta
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[var(--border-color-light)] text-[var(--text-secondary)] text-sm font-medium hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-primary)] transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
      </div>

      <ProposalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        quoteContext={visionContext}
      />
    </>
  );
}

export function PricePanel() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const quote = useQuoteStore((s) => s.quote);

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="sticky top-4 hidden self-start lg:block">
        <PricePanelCard />
      </aside>

      {/* Mobile: bottom drawer */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border-color-light)] bg-[var(--bg-primary)]/95 backdrop-blur-md p-3 shadow-2xl lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-secondary)]/50 px-4 py-3 text-left"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">Costo mensual</p>
            <p className="text-xl font-black text-[var(--text-primary)]">{formatMXN(quote.monthly)}</p>
          </div>
          <span className="text-xs text-[var(--text-tertiary)] font-bold">{mobileOpen ? "▼ Cerrar" : "▲ Ver detalle"}</span>
        </button>

        {mobileOpen && (
          <div className="mt-3 max-h-[60vh] overflow-y-auto pb-2">
            <PricePanelCard />
          </div>
        )}
      </div>
    </>
  );
}
