import { Target, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MissionVision() {
  const { t } = useTranslation();

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] p-8 sm:p-10 rounded-2xl border-l-4 border-[#3A3A3A] shadow-md hover:shadow-xl hover:shadow-[var(--shadow-md)] transition-all duration-300 backdrop-blur-sm hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#3A3A3A] to-[#1c1c1c] rounded-xl flex items-center justify-center shadow-md">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">{t('mission.title')}</h3>
            </div>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed text-justify">
              {t('mission.description')}
            </p>
          </div>

          <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] p-8 sm:p-10 rounded-2xl border-l-4 border-[#E31E24] shadow-md hover:shadow-xl hover:shadow-[var(--shadow-accent)] transition-all duration-300 backdrop-blur-sm hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#E31E24] to-[#c4191f] rounded-xl flex items-center justify-center shadow-md">
                <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">{t('vision.title')}</h3>
            </div>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed text-justify">
              {t('vision.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
