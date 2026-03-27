import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ScrollToTopButton() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('nav.scroll_to_top')}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-[#E31E24] text-white shadow-lg hover:bg-[#c0171c] hover:shadow-[0_0_16px_rgba(227,30,36,0.5)] transition-all duration-200"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
