import { CheckCircle, Users, Award, Lightbulb, Shield, Bot } from 'lucide-react';

const values = [
  {
    icon: CheckCircle,
    title: 'Contención de inspección 200%',
    description: 'Confiabilidad en procesos especializados'
  },
  {
    icon: Users,
    title: 'Plan de adiestramiento de personal',
    description: 'Capacitación basada en puntos críticos con pruebas ILU'
  },
  {
    icon: Award,
    title: 'Servicios operativos de calidad',
    description: 'Ingenieros calificados para estandarizar procesos y mejoras'
  },
  {
    icon: Lightbulb,
    title: 'Reportes periódicos',
    description: 'Informes con tendencias y recomendaciones de eficiencia'
  },
  {
    icon: Shield,
    title: 'Acompañamiento en nuevos lanzamientos',
    description: 'Apoyo en fase inicial de proyectos garantizando calidad'
  },
  {
    icon: Bot,
    title: 'Mejora de eficiencia de procesos mediante herramientas tecnológicas de IA',
    description: 'Optimización automatizada con inteligencia artificial'
  }
];

const propositions = [
  'Priorizamos las necesidades de nuestros clientes',
  'Tomamos en cuenta sus normas y especificaciones',
  'Proporcionamos soluciones innovadoras de alta calidad para abordar la escasez de talento humano',
  'Equipo experto y experimentado con conocimientos especializados',
  'Posición de liderazgo en la industria mediante servicio excepcional'
];

export default function ValueProposition() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight leading-tight">
            Valor <span className="gradient-text">Agregado</span>
          </h2>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Soluciones que superan las barreras del talento humano
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] hover:border-[var(--border-color-light)] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:scale-[1.03] backdrop-blur-sm"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#3A3A3A] to-[#E31E24] rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2">
                  {value.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-[#3A3A3A]/5 to-[#E31E24]/5 border border-[var(--border-color-light)] rounded-3xl p-8 sm:p-12 shadow-lg backdrop-blur-sm">
          <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6 sm:mb-8 text-center">
            Nuestra Propuesta de Valor
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {propositions.map((prop, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center mt-1 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
                  {prop}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
