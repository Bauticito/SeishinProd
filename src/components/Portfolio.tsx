import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'Renovación Manufactura Automotriz',
    overlayText: 'Optimización × IA',
    category: 'Manufactura',
  },
  {
    title: 'Mesa de Ayuda 24/7',
    overlayText: 'Humano + Máquina',
    category: 'Soporte',
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            Trabajo <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">Destacado</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 rounded-2xl border border-[var(--border-color)] overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[var(--accent-primary)]/20"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500"></div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-80"></div>

              <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                <div className="mb-3 sm:mb-4">
                  <span className="inline-block px-2 sm:px-3 py-1 bg-[#FF6B3F]/20 text-[#FF6B3F] text-xs sm:text-sm font-bold rounded-full border border-[#FF6B3F]/30">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] mb-2 tracking-tight">
                  {project.title}
                </h3>

                <p className="text-[var(--text-secondary)] text-base sm:text-lg mb-3 sm:mb-4">
                  {project.overlayText}
                </p>

                <div className="flex items-center gap-2 text-[#FF6B3F] font-bold group-hover:gap-4 transition-all duration-300 text-sm sm:text-base">
                  Ver Caso de Estudio
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
