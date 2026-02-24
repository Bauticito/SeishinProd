import { useState } from 'react';
import { ArrowRight, Bot, Brain, Factory, LineChart, ScanSearch, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const solutions = [
  {
    title: 'Agentes IA operativos',
    description:
      'Automatizamos tareas repetitivas en reclutamiento, seguimiento de candidatos, reportes y atencion interna.',
    icon: Bot,
  },
  {
    title: 'Vision computarizada',
    description:
      'Inspeccion visual asistida por IA para control de calidad, deteccion de defectos y trazabilidad.',
    icon: ScanSearch,
  },
  {
    title: 'Analitica predictiva',
    description:
      'Pronostico de demanda operativa, cobertura de personal y deteccion temprana de cuellos de botella.',
    icon: LineChart,
  },
];

const sectors = [
  'Automotriz',
  'Manufactura avanzada',
  'Logistica y almacenes',
  'Operaciones de RH',
  'Servicios administrativos',
  'Proyectos de transformacion digital',
];

const process = [
  {
    title: '1. Diagnostico',
    text: 'Mapeo de proceso actual, metricas base y objetivos de negocio.',
  },
  {
    title: '2. Diseno de solucion',
    text: 'Arquitectura funcional, alcance tecnico y criterios de exito.',
  },
  {
    title: '3. Implementacion piloto',
    text: 'Prueba controlada con validacion de resultados en operacion real.',
  },
  {
    title: '4. Escalamiento',
    text: 'Despliegue gradual, capacitacion y mejora continua basada en datos.',
  },
];

type BriefIaForm = {
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  proceso: string;
  volumen: string;
  objetivo: string;
  timeline: string;
  presupuesto: string;
};

const initialBrief: BriefIaForm = {
  nombre: '',
  empresa: '',
  correo: '',
  telefono: '',
  proceso: '',
  volumen: '',
  objetivo: '',
  timeline: '',
  presupuesto: '',
};

export default function SeishinIaPage() {
  const [brief, setBrief] = useState<BriefIaForm>(initialBrief);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBrief((prev) => ({ ...prev, [name]: value }));
  };

  const handleBriefSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `Brief IA - ${brief.empresa || 'Nuevo lead'}`;
    const body = [
      'Nuevo Brief IA recibido:',
      '',
      `Nombre: ${brief.nombre}`,
      `Empresa: ${brief.empresa}`,
      `Correo: ${brief.correo}`,
      `Telefono: ${brief.telefono}`,
      '',
      `Proceso a optimizar: ${brief.proceso}`,
      `Volumen actual: ${brief.volumen}`,
      `Objetivo principal: ${brief.objetivo}`,
      `Timeline esperado: ${brief.timeline}`,
      `Rango de presupuesto: ${brief.presupuesto}`,
    ].join('\n');

    window.location.href = `mailto:fabian.noel@seishin.com.mx?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    setBrief(initialBrief);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-14">
        <section className="rounded-3xl border border-[var(--border-color-light)] glass p-8 md:p-14 overflow-hidden relative">
          <div className="absolute -top-20 -right-16 w-72 h-72 bg-[#E31E24] rounded-full blur-[110px] opacity-10" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#E31E24] mb-5">
              <Brain className="w-4 h-4" />
              SeishinIA
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-6">
              IA aplicada a operaciones reales
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl leading-relaxed mb-8">
              Disenamos e implementamos soluciones de inteligencia artificial para reducir tiempos, elevar calidad y
              aumentar capacidad operativa sin friccion con tu equipo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/calculator" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4">
                Cotizar servicio
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="mailto:fabian.noel@seishin.com.mx"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4"
              >
                Hablar con especialista IA
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-8 tracking-tight">
            Soluciones clave
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {solutions.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl p-7 border border-[var(--border-color-light)] bg-[var(--card-bg)]"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E31E24]/10 text-[#E31E24] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl p-8 border border-[var(--border-color-light)] bg-[var(--bg-secondary)]">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-5 flex items-center gap-2">
              <Factory className="w-6 h-6 text-[#E31E24]" />
              Industrias donde operamos
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {sectors.map((sector) => (
                <div
                  key={sector}
                  className="px-4 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-medium"
                >
                  {sector}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-8 border border-[var(--border-color-light)] bg-[var(--bg-secondary)]">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-5 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#E31E24]" />
              Enfoque de implementacion
            </h3>
            <div className="space-y-4">
              {process.map((step) => (
                <div key={step.title} className="rounded-xl border border-[var(--border-color)] p-4">
                  <p className="font-bold text-[var(--text-primary)] mb-1">{step.title}</p>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl p-8 md:p-10 border border-[var(--border-color-light)] bg-[var(--bg-secondary)]">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">
              Brief IA
            </h2>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-3xl">
              Comparte tu contexto operativo y te devolvemos una propuesta inicial de implementacion con alcance y plan
              de ejecucion.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleBriefSubmit} className="grid md:grid-cols-2 gap-5">
              <input
                name="nombre"
                value={brief.nombre}
                onChange={handleChange}
                required
                placeholder="Nombre completo"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />
              <input
                name="empresa"
                value={brief.empresa}
                onChange={handleChange}
                required
                placeholder="Empresa"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />
              <input
                type="email"
                name="correo"
                value={brief.correo}
                onChange={handleChange}
                required
                placeholder="Correo empresarial"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />
              <input
                name="telefono"
                value={brief.telefono}
                onChange={handleChange}
                required
                placeholder="Telefono"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />

              <textarea
                name="proceso"
                value={brief.proceso}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Que proceso quieres optimizar?"
                className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />

              <input
                name="volumen"
                value={brief.volumen}
                onChange={handleChange}
                required
                placeholder="Volumen actual (ej. 300 inspecciones por dia)"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />

              <select
                name="objetivo"
                value={brief.objetivo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              >
                <option value="">Objetivo principal</option>
                <option value="Reducir costos">Reducir costos</option>
                <option value="Reducir tiempos">Reducir tiempos</option>
                <option value="Mejorar calidad">Mejorar calidad</option>
                <option value="Escalar operacion">Escalar operacion</option>
              </select>

              <select
                name="timeline"
                value={brief.timeline}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              >
                <option value="">Timeline esperado</option>
                <option value="0-30 dias">0-30 dias</option>
                <option value="1-3 meses">1-3 meses</option>
                <option value="3-6 meses">3-6 meses</option>
                <option value="6+ meses">6+ meses</option>
              </select>

              <select
                name="presupuesto"
                value={brief.presupuesto}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              >
                <option value="">Rango de presupuesto</option>
                <option value="Menos de 100 mil MXN">Menos de 100 mil MXN</option>
                <option value="100 mil - 300 mil MXN">100 mil - 300 mil MXN</option>
                <option value="300 mil - 1 M MXN">300 mil - 1 M MXN</option>
                <option value="Mas de 1 M MXN">Mas de 1 M MXN</option>
              </select>

              <button
                type="submit"
                className="md:col-span-2 btn-primary px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                Enviar Brief IA
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="rounded-2xl border border-[var(--border-color-light)] bg-[var(--bg-primary)] p-8 text-center">
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Brief enviado</h3>
              <p className="text-[var(--text-secondary)]">
                Ya abrimos tu cliente de correo con la informacion. Si quieres, tambien puedes escribir a
                fabian.noel@seishin.com.mx.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-[#3A3A3A] to-[#1c1c1c] text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Resultados esperados</h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-3xl mb-8">
            Menos retrabajos, mayor velocidad de respuesta y una operacion mas predecible basada en datos. Cada
            proyecto se mide con indicadores de impacto acordados desde el inicio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="tel:4491155269" className="btn-primary px-8 py-4 inline-flex items-center justify-center gap-2">
              Agenda una llamada
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              to="/gallery"
              className="px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 transition-colors inline-flex items-center justify-center gap-2"
            >
              Ver galeria de operaciones
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
