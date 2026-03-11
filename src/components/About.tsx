import { Users, Building2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Users,
      number: '200+',
      text: t('about.stats_1'),
    },
    {
      icon: Building2,
      number: '+50',
      text: t('about.stats_2'),
    },
    {
      icon: Clock,
      number: '24/7',
      text: t('about.stats_3'),
    },
  ];

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-4 sm:mb-6 leading-tight tracking-tight">
            {t('about.heading')} <span className="gradient-text">{t('about.heading_accent')}</span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] leading-relaxed max-w-4xl mx-auto mb-6">
            {t('about.description_1')}
          </p>

          <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] leading-relaxed max-w-4xl mx-auto">
            {t('about.description_2')}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] hover:border-[var(--border-color-light)] rounded-2xl p-6 sm:p-8 text-center shadow-sm hover:shadow-xl hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:scale-[1.03] backdrop-blur-sm"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#3A3A3A] to-[#E31E24] flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent-primary)] mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-[var(--text-secondary)]">{stat.text}</div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-[#3A3A3A]/5 to-[#E31E24]/5 border border-[var(--border-color-light)] rounded-3xl p-8 sm:p-12 shadow-lg hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
                {t('about.founder_name')}
              </h3>
              <p className="text-lg sm:text-xl text-[var(--accent-primary)] font-semibold mb-6">
                {t('about.founder_role')}
              </p>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed text-justify">
                {t('about.founder_bio')}
              </p>
            </div>

            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-3xl border-2 border-[var(--border-color-light)] overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(30,58,138,0.3)] transition-all duration-500 hover:scale-[1.02]">
                <img
                  src="/fnoel.jpg"
                  alt={t('about.founder_alt')}
                  className="w-full h-full object-cover animate-fade-in"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
