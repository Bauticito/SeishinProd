import { Mail, Linkedin, Facebook, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <footer className="bg-[var(--bg-secondary)] py-14 sm:py-18 lg:py-24 px-4 sm:px-8 border-t border-[var(--border-color-light)] shadow-inner">
      <div className="w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-14 lg:gap-20 mb-12 sm:mb-14 lg:mb-16 items-start">
          <div className="text-center sm:text-left lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-3 mb-5 justify-center sm:justify-start"
            >
              <img
                src="/seishin-logo-SinFondo-removebg-preview.png"
                alt="Seishin Logo"
                className="h-12 sm:h-14 w-auto"
              />
            </motion.div>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base mb-4">
              Somos un socio de servicio especializado habilitado por tecnología enfocado en operaciones escalables e inteligentes.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
              Combinamos talento humano con automatización para que tu empresa opere más rápido, con mayor precisión y a menor costo.
            </p>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-3 sm:mb-4">Enlaces</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="/#services" onClick={goToSection('services')} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300 hover:translate-x-1 inline-block">
                  Servicios
                </a>
              </li>
              <li>
                <a href="/about" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300 hover:translate-x-1 inline-block">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="/#contact" onClick={goToSection('contact')} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300 hover:translate-x-1 inline-block">
                  Contacto
                </a>
              </li>
              <li>
                <a href="https://srv.seishin.com.mx/web/login" target="_blank" rel="noopener noreferrer" className="text-[#E31E24] font-bold hover:underline transition-all duration-300 hover:translate-x-1 inline-block">
                  Acceso ERP
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-3 sm:mb-4">Contacto</h4>
            <div className="space-y-2 sm:space-y-3">
              <a
                href="mailto:hello@seishin.ai"
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all duration-300 justify-center sm:justify-start text-sm sm:text-base hover:translate-x-1"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                info@seishin.com.mx
              </a>

              <div className="pt-2">
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">Síguenos</p>
                <div className="flex gap-4 justify-center sm:justify-start">
                  <a
                    href="https://linkedin.com/company/seishin-ia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--card-bg)] hover:bg-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://facebook.com/seishin.ia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--card-bg)] hover:bg-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/seishin_ia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--card-bg)] hover:bg-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
                    aria-label="X"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.851L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com/seishin.ia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--card-bg)] hover:bg-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-3 sm:mb-4">Legales</h4>
            <div className="flex flex-col gap-2 sm:gap-3 items-center sm:items-start">
              <a
                href="/privacidad"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] text-xs sm:text-sm transition-colors duration-300 underline-offset-4 hover:underline"
              >
                Aviso de Privacidad
              </a>
              <a
                href="/terminos"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] text-xs sm:text-sm transition-colors duration-300 underline-offset-4 hover:underline"
              >
                Términos de Uso
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border-color)] pt-8 sm:pt-10">
          <div className="flex flex-col items-center gap-3">
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm text-center">
              © 2025 Seishin. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
