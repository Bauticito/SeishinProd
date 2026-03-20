import { motion } from 'framer-motion';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Calendar, DollarSign, Building2, Share2, Loader2, ChevronLeft, MapPin } from 'lucide-react';
import JobPostingSchema from '../../components/SEO/JobPostingSchema';
import { useUnifiedJobs } from '../../hooks/useUnifiedJobs';
import { useRecruitmentStore } from '../../lib/recruitmentStore';
import { JobVacancy } from '../../data/jobs';
import SEO from '../../components/SEO/SEO';

export default function JobDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { jobs, loading } = useUnifiedJobs();
  const { openWithJob } = useRecruitmentStore();
  const job = jobs.find((j: JobVacancy) => j.slug === slug);

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center text-[var(--text-secondary)]">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#E31E24]" />
        <p>Cargando detalles de la vacante...</p>
      </div>
    );
  }

  if (!job) {
    return <Navigate to="/empleos" replace />;
  }

  const location = job.location || 'Aguascalientes y Guanajuato, Mexico';
  const cleanDesc = job.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const seoDescription = `Vacante de ${job.title} en ${location}. ${cleanDesc.slice(0, 150)} Postulate en Seishin International.`;
  const seoKeywords = [
    `vacante de ${job.title.toLowerCase()} ${location.toLowerCase()}`,
    `empleo ${job.title.toLowerCase()} ${location.toLowerCase()}`,
    `trabajo ${job.title.toLowerCase()}`,
    ...(job.searchKeywords || []),
    'vacantes seishin international',
  ].join(', ');
  const detailUrl = `https://seishin.com.mx/vacante/${job.slug}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Mira esta vacante de ${job.title} en Seishin International`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="pt-40 pb-20 min-h-screen bg-[var(--bg-primary)]">
      <SEO
        title={`Vacante de ${job.title} en ${location}`}
        description={seoDescription}
        keywords={seoKeywords}
        ogTitle={`Vacante de ${job.title} | Seishin International`}
        ogDescription={seoDescription}
        canonicalUrl={detailUrl}
        ogUrl={detailUrl}
        ogType="article"
      />
      <JobPostingSchema job={job} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-20 mb-8">
          <button
            onClick={() => navigate('/empleos')}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#E31E24] transition-colors group cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver a vacantes
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-10 rounded-3xl bg-white/5 border border-white/10 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E31E24]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
            <div className="lg:col-span-6 flex flex-col justify-center min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                <span className="px-3 py-1 rounded-full bg-[#E31E24]/10 text-[#E31E24] text-[10px] font-bold uppercase tracking-widest">
                  {job.category}
                </span>
                <span className="text-gray-500 text-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Publicado el {job.postedDate}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[var(--text-primary)] mb-6 leading-tight uppercase tracking-tight break-words">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-4 md:gap-6 mt-auto">
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#E31E24]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium uppercase tracking-wide">{job.type}</span>
                </div>
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#E31E24]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#E31E24]">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: job.salary.currency }).format(job.salary.min)} -{' '}
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: job.salary.currency }).format(job.salary.max)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-3 flex">
              <div className="w-full p-8 rounded-2xl bg-[#E31E24] text-white flex flex-col justify-between shadow-xl">
                <div>
                  <h3 className="text-xl font-bold mb-3">Te interesa?</h3>
                  <p className="text-white/80 text-xs leading-relaxed mb-6">
                    Envia tu perfil hoy mismo para revision. Estamos buscando talento como el tuyo.
                  </p>
                </div>
                <div className="space-y-3 mt-auto">
                  <button
                    onClick={() => openWithJob(job.id)}
                    className="w-full py-3 rounded-xl bg-white text-[#E31E24] font-bold text-sm hover:bg-gray-100 transition-all hover:-translate-y-0.5"
                  >
                    Postularme ahora
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-bold text-xs hover:bg-white/20 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartir vacante
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 flex">
              <div className="w-full p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">Empresa</p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                    Seishin International es lider en servicios de Inteligencia Artificial y consultoria operativa avanzada en Mexico.
                  </p>
                </div>
                <div className="mt-auto">
                  <img src="/seishin-SinFondo.png" alt="Seishin Logo" className="h-10 w-auto opacity-40 grayscale" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-12">
            <section>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#E31E24]" />
                Descripcion del puesto
              </h2>
              <div className="prose prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: job.description }} />
              {job.schedule && (
                <p className="mt-4 text-[var(--text-secondary)]">
                  <strong>Horario:</strong> {job.schedule}
                </p>
              )}
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Requisitos</h3>
              <ul className="space-y-4">
                {job.requirements.map((req: string, i: number) => (
                  <li key={i} className="flex gap-3 text-[var(--text-secondary)]">
                    <CheckCircle2 className="w-5 h-5 text-[#E31E24] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {job.benefits && (
              <section>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Beneficios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {job.benefits.map((benefit: string, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#E31E24]" />
                      <span className="text-sm text-[var(--text-secondary)]">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
