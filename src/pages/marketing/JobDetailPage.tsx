import { motion } from 'framer-motion';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Building2,
  Share2,
  Loader2
} from 'lucide-react';
import JobPostingSchema from '../../components/SEO/JobPostingSchema';
import { useEffect } from 'react';
import { useUnifiedJobs } from '../../hooks/useUnifiedJobs';
import { useRecruitmentStore } from '../../lib/recruitmentStore';
import { JobVacancy } from '../../data/jobs';

export default function JobDetailPage() {
  const { slug } = useParams();
  const { jobs, loading } = useUnifiedJobs();
  const { openWithJob } = useRecruitmentStore();
  const job = jobs.find((j: JobVacancy) => j.slug === slug);

  useEffect(() => {
    if (job) {
      document.title = `${job.title} | Vacante Seishin International`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `Vacante de ${job.title} en Seishin International. ${job.description.substring(0, 120).replace(/<[^>]*>/g, '')}... Postúlate ahora.`);
      }
    }
  }, [job]);

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
    <div className="pt-32 pb-20 min-h-screen bg-[var(--bg-primary)]">
      <JobPostingSchema job={job} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/empleos" 
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#E31E24] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver a vacantes
        </Link>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E31E24]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-[#E31E24]/10 text-[#E31E24] text-[10px] font-bold uppercase tracking-widest">
                {job.category}
              </span>
              <span className="text-gray-500 text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Publicado el {job.postedDate}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
              {job.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#E31E24]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Empresa</p>
                  <p className="font-medium">{job.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#E31E24]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Tipo</p>
                  <p className="font-medium">{job.type}</p>
                </div>
              </div>

              {job.salary && (
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#E31E24]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Salario</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: job.salary.currency }).format(job.salary.min)} - {new Intl.NumberFormat('es-MX', { style: 'currency', currency: job.salary.currency }).format(job.salary.max)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content Tabs/Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-12"
          >
            <section>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#E31E24]" />
                Descripción del puesto
              </h2>
              <div 
                className="prose prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
              {job.schedule && (
                <p className="mt-4 text-[var(--text-secondary)]"><strong>Horario:</strong> {job.schedule}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Sidebar / CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-8 rounded-3xl bg-[#E31E24] text-white shadow-2xl shadow-[#E31E24]/20 sticky top-32">
              <h3 className="text-2xl font-bold mb-4">¿Te interesa este puesto?</h3>
              <p className="text-white/80 text-sm mb-8">
                Envía tu perfil hoy mismo. Nuestro equipo de RRHH revisará tu experiencia.
              </p>
              
              <button
                onClick={() => openWithJob(job.id)}
                className="w-full block text-center py-4 rounded-xl bg-white text-[#E31E24] font-bold text-sm hover:bg-gray-100 transition-colors mb-4"
              >
                Postularme ahora
              </button>
              
              <button 
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white/10 text-white border border-white/20 font-bold text-sm hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Compartir vacante
              </button>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm font-bold text-[var(--text-primary)] mb-2">Empresa</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Seishin International es líder en servicios de IA y consultoría operativa en México.
              </p>
              <img 
                src="/seishin-SinFondo.png" 
                alt="Seishin Logo" 
                className="h-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
