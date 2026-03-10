import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="relative py-32 px-6 bg-gradient-to-r from-[#FF6B3F] to-[#00C1FF] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
          {t('cta.heading')}
        </h2>
        <p className="text-xl sm:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed">
          {t('cta.description')}
        </p>

        <a
          href="#contact"
          className="group inline-flex items-center gap-3 bg-[#0D0D0F] hover:bg-[#1E1E22] text-white font-bold px-10 py-5 rounded-lg transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105"
        >
          {t('cta.button')}
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
        </a>
      </div>
    </section>
  );
}
