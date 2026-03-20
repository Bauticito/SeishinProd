import CotizadorWizard from '../components/cotizador/CotizadorWizard';
import SEO from '../components/SEO/SEO';

export default function CalculatorPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <SEO
        title="Cotizador | Solicita tu Propuesta de IA Industrial"
        description="Obtén una cotización personalizada de servicios de Inteligencia Artificial para tu empresa. Inspección de calidad, vigilancia inteligente y logística 4.0. Respuesta rápida y sin compromiso."
        keywords="cotización IA industrial, propuesta inteligencia artificial, cotizador automatización, precio inspección calidad IA, servicios IA México"
        ogTitle="Cotizador de Servicios IA | Seishin International"
        ogDescription="Solicita tu propuesta personalizada de IA industrial en minutos. Sin compromiso. Inspección, vigilancia y logística 4.0."
      />
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
