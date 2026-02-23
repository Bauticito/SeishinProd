import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const { theme } = useTheme();
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 glass shadow-lg' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{
                  scale: 1.1,
                  filter: "brightness(1.1) drop-shadow(0px 0px 15px rgba(227, 30, 36, 0.3))"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative z-10"
              >
                <img
                  src="/seishin-logo-SinFondo-removebg-preview.png"
                  alt="Seishin Logo"
                  className="h-9 md:h-11 w-auto transition-transform duration-500 group-hover:rotate-3"
                />
              </motion.div>

              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-[var(--text-primary)] tracking-tight leading-none">
                  SEISHIN
                </span>
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                  className="h-1 bg-[#E31E24] mt-0.5 rounded-full"
                ></motion.span>
              </div>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleLinkClick(e as any, link.href)}
                  className={`text-sm font-bold transition-all duration-300 hover:text-[var(--accent-primary)] relative group ${location.pathname === link.href ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                    }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent-primary)] transition-all duration-300 group-hover:w-full ${location.pathname === link.href ? 'w-full' : ''}`}></span>
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-[var(--border-color-light)]"></div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/calculator"
                className="text-[var(--text-primary)] px-4 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm bg-[var(--bg-secondary)] border border-[var(--border-color-light)] hover:border-[#E31E24] hover:text-[#E31E24]"
              >
                Calculadora
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://srv.seishin.com.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color-light)] text-[var(--text-primary)] font-bold text-sm hover:bg-[var(--bg-secondary)] transition-all duration-300"
              >
                ERP
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31E24]"></span>
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/#contact"
                onClick={(e) => handleLinkClick(e as any, '/#contact')}
                className="btn-primary px-6 py-2.5 text-sm"
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
