import { Menu, X, Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'es', flag: 'MX' },
  { code: 'en', flag: 'EN' },
] as const;

function resolveLanguage(language?: string) {
  return language?.startsWith('en') ? 'en' : 'es';
}

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<'es' | 'en'>(resolveLanguage(i18n.resolvedLanguage ?? i18n.language));
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLang(resolveLanguage(i18n.resolvedLanguage ?? i18n.language));
  }, [i18n.language, i18n.resolvedLanguage]);

  const goToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  const navLinks = [
    { name: t('nav.inicio'), href: '/' },
    { name: t('nav.sobre'), href: '/about' },
    { name: t('nav.servicios'), href: '/#services' },
    { name: t('nav.industria'), href: '/#industry40' },
    { name: t('nav.seishinia'), href: '/seishinia' },
    { name: t('nav.galeria'), href: '/gallery' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') return;
      e.preventDefault();
      const id = href.substring(2);
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };

  const handleLanguageChange = (code: 'es' | 'en') => {
    setLang(code);
    void i18n.changeLanguage(code);
    localStorage.setItem('seishin_lang', code);
    setLangOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 glass shadow-lg' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <motion.div className="flex-none" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <Link to="/" className="flex items-center group py-2">
              <motion.div
                whileHover={{ scale: 1.05, filter: 'brightness(1.1) drop-shadow(0px 0px 30px rgba(227, 30, 36, 0.3))' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative z-10"
              >
                <img src="/seishin-SinFondo.png" alt="Seishin Logo" className="h-14 md:h-20 w-auto drop-shadow-2xl transition-all duration-700" />
              </motion.div>
            </Link>
          </motion.div>

          <div className="hidden md:flex flex-1 justify-center items-center gap-3 lg:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 hover:text-[#E31E24] relative group px-1 py-1 whitespace-nowrap ${
                  location.pathname === link.href || (location.pathname === '/' && location.hash === link.href) ? 'text-[#E31E24]' : 'text-[var(--text-primary)]'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-[#E31E24] transition-all duration-300 group-hover:w-full ${
                  location.pathname === link.href || (location.pathname === '/' && location.hash === link.href) ? 'w-full' : ''
                }`} />
              </a>
            ))}
          </div>

          <div className="hidden md:flex flex-none items-center gap-1.5 lg:gap-2">
            <div className="h-5 w-px bg-[var(--border-color-light)] opacity-20 mx-1" />

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="whitespace-nowrap">
              <Link to="/calculator" className="text-[var(--text-primary)] px-3 lg:px-4 py-2 rounded-full transition-all duration-500 font-medium text-[9px] lg:text-[10px] border border-[var(--border-color-light)] hover:border-[#E31E24] hover:bg-[#E31E24] hover:text-white tracking-wider uppercase inline-block whitespace-nowrap">
                {t('nav.calcular')}
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="whitespace-nowrap">
              <a href="https://srv.seishin.com.mx/web/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color-light)] text-[var(--text-primary)] font-medium text-[9px] lg:text-[10px] hover:bg-[var(--bg-secondary)] transition-all duration-300 tracking-wider uppercase">
                {t('nav.erp')}
                <span className="w-1 h-1 rounded-full bg-[#E31E24]" />
              </a>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="whitespace-nowrap">
              <Link to="/jetson/landing" className="flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-full bg-[#E31E24]/10 border border-[#E31E24]/30 text-[#E31E24] font-medium text-[9px] lg:text-[10px] hover:bg-[#E31E24] hover:text-white transition-all duration-300 tracking-wider uppercase">
                Portal IA
                <span className="w-1 h-1 rounded-full bg-[#E31E24]" />
              </Link>
            </motion.div>

            <div className="h-5 w-px bg-[var(--border-color-light)] opacity-20 mx-1" />

            <div ref={langRef} className="relative">
              <button onClick={() => setLangOpen((o) => !o)} className="p-2 rounded-full glass border border-[var(--border-color-light)] text-[var(--text-primary)] hover:border-[#E31E24] hover:text-[#E31E24] transition-all duration-300 flex items-center justify-center" aria-label="Seleccionar idioma">
                <Languages className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 glass rounded-xl border border-[var(--border-color-light)] shadow-xl overflow-hidden z-50"
                  >
                    {LANGUAGES.map(({ code, flag }) => (
                      <button
                        key={code}
                        onClick={() => handleLanguageChange(code)}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-200 ${
                          lang === code ? 'bg-[#E31E24]/10 text-[#E31E24] font-semibold' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                        }`}
                      >
                        <span className="text-[11px] font-bold tracking-wider">{flag}</span>
                        <span>{t(`lang.${code}`)}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={toggleTheme} className="p-2 rounded-full glass border border-[var(--border-color-light)] text-[var(--text-primary)] hover:border-[#E31E24] hover:text-[#E31E24] transition-all duration-300 flex items-center justify-center" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href="/#contact" onClick={goToContact} className="btn-primary px-4 py-2.5 text-[9px] lg:text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
                {t('nav.contacto')}
              </a>
            </motion.div>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2.5 rounded-xl glass border border-[var(--border-color-light)]">
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#E31E24]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden mt-4 overflow-hidden glass rounded-2xl border border-[var(--border-color-light)] shadow-2xl">
              <div className="p-6 space-y-4">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="block text-lg font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-4">
                  <Link to="/calculator" onClick={() => setMobileMenuOpen(false)} className="block w-full py-4 text-center border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-xl font-bold">
                    {t('nav.calcular')}
                  </Link>
                  <a href="https://srv.seishin.com.mx/web/login" target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl font-bold border border-[var(--border-color-light)]">
                    {t('nav.erp')}
                  </a>
                  <a href="/#contact" onClick={goToContact} className="btn-primary block w-full py-4 text-center">
                    {t('nav.contacto')}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
