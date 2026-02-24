import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre nosotros', href: '/about' },
    { name: 'Servicios', href: '/#services' },
    { name: 'Industria 4.0', href: '/#industry40' },
    { name: 'Galería', href: '/gallery' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        // Redirect to home will be handled by Link normally, but we might need manual logic for hashes
        return;
      }
      e.preventDefault();
      const id = href.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 glass shadow-lg' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link to="/" className="flex items-center group py-2">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  filter: "brightness(1.1) drop-shadow(0px 0px 30px rgba(227, 30, 36, 0.3))"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10"
              >
                <img
                  src="/seishin-SinFondo.png"
                  alt="Seishin Logo"
                  className="h-14 md:h-20 w-auto drop-shadow-2xl transition-all duration-700"
                />
              </motion.div>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-6 lg:gap-8 mr-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e as any, link.href)}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-[#E31E24] relative group px-2 py-1 whitespace-nowrap ${location.pathname === link.href || (location.pathname === '/' && location.hash === link.href)
                    ? 'text-[#E31E24]'
                    : 'text-[var(--text-primary)]'
                    }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-[#E31E24] transition-all duration-300 group-hover:w-full ${location.pathname === link.href || (location.pathname === '/' && location.hash === link.href) ? 'w-full' : ''
                    }`}></span>
                </a>
              ))}
            </div>

            <div className="h-6 w-px bg-[var(--border-color-light)] opacity-20"></div>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="whitespace-nowrap"
            >
              <Link
                to="/calculator"
                className="text-[var(--text-primary)] px-5 lg:px-6 py-2.5 rounded-full transition-all duration-500 font-medium text-[10px] lg:text-xs border border-[var(--border-color-light)] hover:border-[#E31E24] hover:bg-[#E31E24] hover:text-white tracking-widest uppercase inline-block whitespace-nowrap"
              >
                Calcula tu servicio
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="whitespace-nowrap"
            >
              <a
                href="https://srv.seishin.com.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 lg:px-6 py-2.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color-light)] text-[var(--text-primary)] font-medium text-[10px] lg:text-xs hover:bg-[var(--bg-secondary)] transition-all duration-300 tracking-widest uppercase"
              >
                ERP
                <span className="w-1 h-1 rounded-full bg-[#E31E24]"></span>
              </a>
            </motion.div>

            <div className="h-6 w-px bg-[var(--border-color-light)] opacity-20 mx-2"></div>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-full glass border border-[var(--border-color-light)] text-[var(--text-primary)] hover:border-[#E31E24] hover:text-[#E31E24] transition-all duration-300 flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/#contact"
                onClick={(e) => handleLinkClick(e as any, '/#contact')}
                className="btn-primary px-6 py-3 text-xs font-semibold tracking-widest uppercase whitespace-nowrap"
              >
                Contacto
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 overflow-hidden glass rounded-2xl border border-[var(--border-color-light)] shadow-2xl"
            >
              <div className="p-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={(e) => handleLinkClick(e as any, link.href)}
                    className="block text-lg font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-4">
                  <Link
                    to="/calculator"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-4 text-center border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-xl font-bold"
                  >
                    Calcula tu servicio
                  </Link>
                  <a
                    href="https://srv.seishin.com.mx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 text-center bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl font-bold border border-[var(--border-color-light)]"
                  >
                    Acceso ERP
                  </a>
                  <a
                    href="/#contact"
                    onClick={(e) => handleLinkClick(e as any, '/#contact')}
                    className="btn-primary block w-full py-4 text-center"
                  >
                    Contáctanos
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
