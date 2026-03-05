import CotizadorWizard from '../components/cotizador/CotizadorWizard';

export default function CalculatorPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#E31E24]">Cotizador</span>
        <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mt-2">
          Solicita tu propuesta
        </h1>
        <p className="text-[var(--text-secondary)] mt-3 max-w-xl mx-auto">
          Completa los pasos para recibir una cotización personalizada según tus necesidades.
        </p>
      </div>
      <CotizadorWizard />
    </div>
  );
}
