import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Bot, Brain, Factory, LineChart, ScanSearch, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO/SEO';

type BriefIaForm = {
  servicio: string;
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
  servicio: '',
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
  const { t } = useTranslation();
  const location = useLocation();
  const [brief, setBrief] = useState<BriefIaForm>(initialBrief);
  const [submitted, setSubmitted] = useState(false);

  const solutions = useMemo(
    () => [
      {
        title: t('seishinia.solutions.0.title'),
        description: t('seishinia.solutions.0.description'),
        icon: Bot,
      },
      {
        title: t('seishinia.solutions.1.title'),
        description: t('seishinia.solutions.1.description'),
        icon: ScanSearch,
      },
      {
        title: t('seishinia.solutions.2.title'),
        description: t('seishinia.solutions.2.description'),
        icon: LineChart,
      },
    ],
    [t]
  );

  const sectors = useMemo(
    () => [0, 1, 2, 3, 4, 5].map((index) => t(`seishinia.sectors.${index}`)),
    [t]
  );

  const process = useMemo(
    () =>
      [0, 1, 2, 3].map((index) => ({
        title: t(`seishinia.process.${index}.title`),
        text: t(`seishinia.process.${index}.text`),
      })),
    [t]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('servicio');

    if (serviceParam === 'agentes') {
      setBrief((prev) => ({ ...prev, servicio: t('seishinia.brief.options.service_1') }));
    } else if (serviceParam === 'vision') {
      setBrief((prev) => ({ ...prev, servicio: t('seishinia.brief.options.service_2') }));
    }
  }, [location.search, t]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('servicio');
    const shouldScrollToBrief = location.hash === '#brief-ia' || serviceParam === 'agentes' || serviceParam === 'vision';

    if (!shouldScrollToBrief) return;

    requestAnimationFrame(() => {
      const briefSection = document.getElementById('brief-ia');
      if (briefSection) {
        briefSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, [location.hash, location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBrief((prev) => ({ ...prev, [name]: value }));
  };

  const handleBriefSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `${t('seishinia.brief.mail_subject')} - ${brief.empresa || t('seishinia.brief.new_lead')}`;
    const body = [
      t('seishinia.brief.mail_intro'),
      '',
      `${t('seishinia.brief.labels.name')}: ${brief.nombre}`,
      `${t('seishinia.brief.labels.company')}: ${brief.empresa}`,
      `${t('seishinia.brief.labels.email')}: ${brief.correo}`,
      `${t('seishinia.brief.labels.phone')}: ${brief.telefono}`,
      '',
      `${t('seishinia.brief.labels.service')}: ${brief.servicio}`,
      `${t('seishinia.brief.labels.process')}: ${brief.proceso}`,
      `${t('seishinia.brief.labels.volume')}: ${brief.volumen}`,
      `${t('seishinia.brief.labels.objective')}: ${brief.objetivo}`,
      `${t('seishinia.brief.labels.timeline')}: ${brief.timeline}`,
      `${t('seishinia.brief.labels.budget')}: ${brief.presupuesto}`,
    ].join('\n');

    window.location.href = `mailto:fabian.noel@seishin.com.mx?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    setBrief(initialBrief);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Seishin IA | Soluciones de Inteligencia Artificial para la Industria"
        description="Soluciones de IA industrial a la medida: visión computarizada, inspección de calidad automatizada, detección de defectos y análisis predictivo para la manufactura mexicana. Contáctanos y solicita tu demo."
        keywords="inteligencia artificial industrial, visión computarizada manufactura, inspección calidad IA, detección defectos automatizada, IA manufactura México, análisis predictivo industrial"
        ogTitle="Seishin IA | Inteligencia Artificial para Manufactura"
        ogDescription="Soluciones de IA a la medida para la industria mexicana: visión computarizada, inspección automatizada y análisis predictivo."
      />
      <div className="max-w-7xl mx-auto space-y-14">
        <section className="rounded-3xl border border-[var(--border-color-light)] glass p-8 md:p-14 overflow-hidden relative">
          <div className="absolute -top-20 -right-16 w-72 h-72 bg-[#E31E24] rounded-full blur-[110px] opacity-10" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#E31E24] mb-5">
              <Brain className="w-4 h-4" />
              {t('seishinia.badge')}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-6">
              {t('seishinia.hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl leading-relaxed mb-8">
              {t('seishinia.hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/calculator" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4">
                {t('seishinia.cta_quote')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="mailto:fabian.noel@seishin.com.mx"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4"
              >
                {t('seishinia.cta_specialist')}
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-8 tracking-tight">
            {t('seishinia.solutions_title')}
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
              {t('seishinia.sectors_title')}
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
              {t('seishinia.process_title')}
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

        <section id="brief-ia" className="rounded-3xl p-8 md:p-10 border border-[var(--border-color-light)] bg-[var(--bg-secondary)]">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">
              {t('seishinia.brief.title')}
            </h2>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-3xl">
              {t('seishinia.brief.description')}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleBriefSubmit} className="grid md:grid-cols-2 gap-5">
              <select
                name="servicio"
                value={brief.servicio}
                onChange={handleChange}
                required
                className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              >
                <option value="">{t('seishinia.brief.placeholders.service')}</option>
                <option value={t('seishinia.brief.options.service_1')}>{t('seishinia.brief.options.service_1')}</option>
                <option value={t('seishinia.brief.options.service_2')}>{t('seishinia.brief.options.service_2')}</option>
                <option value={t('seishinia.brief.options.service_3')}>{t('seishinia.brief.options.service_3')}</option>
              </select>

              <input
                name="nombre"
                value={brief.nombre}
                onChange={handleChange}
                required
                placeholder={t('seishinia.brief.placeholders.name')}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />
              <input
                name="empresa"
                value={brief.empresa}
                onChange={handleChange}
                required
                placeholder={t('seishinia.brief.placeholders.company')}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />
              <input
                type="email"
                name="correo"
                value={brief.correo}
                onChange={handleChange}
                required
                placeholder={t('seishinia.brief.placeholders.email')}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />
              <input
                name="telefono"
                value={brief.telefono}
                onChange={handleChange}
                required
                placeholder={t('seishinia.brief.placeholders.phone')}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />

              <textarea
                name="proceso"
                value={brief.proceso}
                onChange={handleChange}
                required
                rows={4}
                placeholder={t('seishinia.brief.placeholders.process')}
                className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />

              <input
                name="volumen"
                value={brief.volumen}
                onChange={handleChange}
                required
                placeholder={t('seishinia.brief.placeholders.volume')}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />

              <select
                name="objetivo"
                value={brief.objetivo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              >
                <option value="">{t('seishinia.brief.placeholders.objective')}</option>
                <option value={t('seishinia.brief.options.objective_1')}>{t('seishinia.brief.options.objective_1')}</option>
                <option value={t('seishinia.brief.options.objective_2')}>{t('seishinia.brief.options.objective_2')}</option>
                <option value={t('seishinia.brief.options.objective_3')}>{t('seishinia.brief.options.objective_3')}</option>
                <option value={t('seishinia.brief.options.objective_4')}>{t('seishinia.brief.options.objective_4')}</option>
              </select>

              <select
                name="timeline"
                value={brief.timeline}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              >
                <option value="">{t('seishinia.brief.placeholders.timeline')}</option>
                <option value={t('seishinia.brief.options.timeline_1')}>{t('seishinia.brief.options.timeline_1')}</option>
                <option value={t('seishinia.brief.options.timeline_2')}>{t('seishinia.brief.options.timeline_2')}</option>
                <option value={t('seishinia.brief.options.timeline_3')}>{t('seishinia.brief.options.timeline_3')}</option>
                <option value={t('seishinia.brief.options.timeline_4')}>{t('seishinia.brief.options.timeline_4')}</option>
              </select>

              <select
                name="presupuesto"
                value={brief.presupuesto}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              >
                <option value="">{t('seishinia.brief.placeholders.budget')}</option>
                <option value={t('seishinia.brief.options.budget_1')}>{t('seishinia.brief.options.budget_1')}</option>
                <option value={t('seishinia.brief.options.budget_2')}>{t('seishinia.brief.options.budget_2')}</option>
                <option value={t('seishinia.brief.options.budget_3')}>{t('seishinia.brief.options.budget_3')}</option>
                <option value={t('seishinia.brief.options.budget_4')}>{t('seishinia.brief.options.budget_4')}</option>
              </select>

              <button
                type="submit"
                className="md:col-span-2 btn-primary px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                {t('seishinia.brief.submit')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="rounded-2xl border border-[var(--border-color-light)] bg-[var(--bg-primary)] p-8 text-center">
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('seishinia.brief.success_title')}</h3>
              <p className="text-[var(--text-secondary)]">{t('seishinia.brief.success_desc')}</p>
            </div>
          )}
        </section>

        <section className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-[#3A3A3A] to-[#1c1c1c] text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{t('seishinia.results_title')}</h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-3xl mb-8">{t('seishinia.results_desc')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="tel:4491155269" className="btn-primary px-8 py-4 inline-flex items-center justify-center gap-2">
              {t('seishinia.results_call')}
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              to="/gallery"
              className="px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 transition-colors inline-flex items-center justify-center gap-2"
            >
              {t('seishinia.results_gallery')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
