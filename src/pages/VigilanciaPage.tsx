import { ArrowRight, Camera, Shield, Eye, Cpu, Lock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import CotizadorWizard from '../components/cotizador/CotizadorWizard';

const features = [
  {
    title: 'Detección en tiempo real',
    description: 'Análisis de video continuo con modelos de visión computarizada entrenados para cada entorno.',
    icon: Eye,
  },
  {
    title: 'Alertas automáticas',
    description: 'Notificaciones inmediatas ante eventos críticos: intrusión, permanencia en zonas, comportamiento anómalo.',
    icon: Shield,
  },
  {
    title: 'Inferencia en el borde',
    description: 'Procesamiento local con dispositivos Jetson — sin latencia de nube, máxima privacidad.',
    icon: Cpu,
  },
  {
    title: 'Acceso seguro',
    description: 'Portal de vigilancia con autenticación por roles. Cada operador ve solo lo que le corresponde.',
    icon: Lock,
  },
  {
    title: 'Logs y auditoría',
    description: 'Registro completo de eventos, capturas y acciones del sistema para trazabilidad total.',
    icon: Activity,
  },
  {
    title: 'Integración de cámaras',
    description: 'Compatible con cámaras IP existentes (RTSP/ONVIF). Sin necesidad de reemplazar infraestructura.',
    icon: Camera,
  },
];

export default function VigilanciaPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Hero */}
        <section className="rounded-3xl border border-[var(--border-color-light)] glass p-8 md:p-14 overflow-hidden relative">
          <div className="absolute -top-20 -right-16 w-80 h-80 bg-[#E31E24] rounded-full blur-[120px] opacity-10 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#E31E24] rounded-full blur-[100px] opacity-5 pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#E31E24] mb-5">
              <Camera className="w-4 h-4" />
              Vigilancia SeishinIA
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-6">
              Visión inteligente<br />
              <span className="text-[#E31E24]">para entornos críticos</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl leading-relaxed mb-8">
              Sistema de vigilancia con IA corriendo en el borde. Detecta, alerta y registra — todo sin depender de la nube.
              Diseñado para industria, manufactura y operaciones de alto riesgo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#cotizador"
                className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4"
              >
                Cotizar mi sistema
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                to="/jetson/landing"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4"
              >
                Acceder al portal
              </Link>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-8 tracking-tight">
            Capacidades del sistema
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl p-7 border border-[var(--border-color-light)] bg-[var(--card-bg)] hover:border-[#E31E24]/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E31E24]/10 text-[#E31E24] flex items-center justify-center mb-5 group-hover:bg-[#E31E24]/20 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Cotizador */}
        <section id="cotizador" className="scroll-mt-24">
          <div className="mb-8">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#E31E24]">Cotizador</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mt-2 mb-3 tracking-tight">
              Estima tu inversión
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl leading-relaxed">
              Respondé 4 preguntas sobre tu operación y generamos una estimación de costo inicial y mensual en tiempo real.
            </p>
          </div>
          <CotizadorWizard />
        </section>

        {/* CTA final */}
        <section className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-[#3A3A3A] to-[#1c1c1c] text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">¿Listo para ver en acción?</h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl mb-8">
            Agendamos una demo técnica en tu instalación o de forma remota. Sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:4491155269"
              className="btn-primary px-8 py-4 inline-flex items-center justify-center gap-2"
            >
              Agendar demo
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="mailto:fabian.noel@seishin.com.mx"
              className="px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 transition-colors inline-flex items-center justify-center gap-2"
            >
              Hablar con un especialista
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
