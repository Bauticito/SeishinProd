import { motion } from 'framer-motion';
import { Briefcase, Clock, Search, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JobVacancy } from '../../data/jobs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUnifiedJobs } from '../../hooks/useUnifiedJobs';
import { useRecruitmentStore } from '../../lib/recruitmentStore';
import SEO from '../../components/SEO/SEO';

export default function JobsPage() {
  const { t } = useTranslation();
  const { jobs: finalJobs, loading } = useUnifiedJobs();
  const { open } = useRecruitmentStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = finalJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[var(--bg-primary)]">
      <SEO
        title="Bolsa de Trabajo | Vacantes en Aguascalientes y Guanajuato"
        description="Encuentra empleo en Seishin International: vacantes de Ingeniería, IA, Logística e Industria 4.0 en Aguascalientes y Guanajuato. Postúlate hoy y únete a una empresa de tecnología industrial en crecimiento."
        keywords="vacantes Aguascalientes, empleos Guanajuato, trabajo ingeniería industrial, vacantes IA México, empleo Industria 4.0, bolsa trabajo tecnología, Seishin International empleo"
        ogTitle="Vacantes de Empleo | Seishin International"
        ogDescription="Únete al equipo de Seishin International. Vacantes en Aguascalientes y Guanajuato en Ingeniería, IA e Industria 4.0."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31E24]/10 text-[#E31E24] text-xs font-bold uppercase tracking-widest mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            {t('recruiter.badge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Bolsa de <span className="text-[#E31E24]">Trabajo</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
            Únete a una empresa líder en tecnología industrial e Inteligencia Artificial. Buscamos talento apasionado por la innovación y la excelencia operativa.
          </p>
        </motion.div>

        {/* Search Bar (Visual only for now) */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar vacantes (ej. Ingeniero, Aguascalientes...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-[var(--text-primary)] focus:outline-none focus:border-[#E31E24] transition-colors"
            />
          </div>
        </div>

        {/* Jobs List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#E31E24]" />
              <p>Cargando vacantes...</p>
            </div>
                    ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job: JobVacancy, index: number) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E31E24]/50 transition-all duration-300"
              >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {job.category}
                    </span>
                    <span className="text-xs text-gray-500">{job.postedDate}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[#E31E24] transition-colors">
                    {job.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#E31E24]" />
                      {job.type}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    to={`/vacante/${job.slug}`}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E31E24] text-white font-bold text-sm hover:bg-[#c01a20] shadow-lg shadow-[#E31E24]/20 transition-all group-hover:translate-x-1"
                  >
                    Ver vacante
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                No encontramos vacantes que coincidan
              </h3>
              <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                Intenta con otros términos de búsqueda o envíanos tu CV para tenerte en cuenta en futuras oportunidades.
              </p>
              <button
                onClick={() => open()}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#E31E24] text-white font-bold text-sm hover:bg-[#c01a20] transition-all"
              >
                Enviar mi CV
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Global Fallback for Jobs Page */}
        {finalJobs.length > 0 && filteredJobs.length > 0 && (
          <div className="mt-16 p-14 rounded-3xl bg-gradient-to-r from-[#E31E24]/10 to-transparent border border-[#E31E24]/20 text-center">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-[var(--text-secondary)] mb-8 text-lg">
              Envíanos tu CV para futuras oportunidades y nos pondremos en contacto contigo cuando se abra una posición alineada a tu perfil.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 text-[#E31E24] font-bold text-lg hover:underline"
            >
              Contáctanos <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
