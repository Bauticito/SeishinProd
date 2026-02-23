import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[var(--bg-primary)] overflow-hidden pt-20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-[#E31E24] rounded-full blur-[160px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#3A3A3A] rounded-full blur-[140px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(227,30,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(227,30,36,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color-light)] bg-[var(--card-bg)] backdrop-blur-md mb-8"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-primary)]"></span>
              </span>
              <span className="text-sm font-semibold text-[var(--text-secondary)]">Liderando la industria 4.0 en México</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[var(--text-primary)] leading-[1.05] mb-8 tracking-tight">
              Soluciones <span className="gradient-text">Empresariales</span> de Alto Nivel
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transformamos la gestión de talento y operaciones industriales. Conectamos experiencia especializada con empresas que buscan excelencia en México y América Latina.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/#contact"
                className="btn-primary flex items-center justify-center gap-3 px-8 py-4 text-base"
              >
                Solicitar cotización
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/calculator"
                  className="btn-secondary flex items-center justify-center gap-3 px-8 py-4 text-base border-[#E31E24] text-[#E31E24] hover:bg-[#E31E24] hover:text-white"
                >
                  Calcula tu servicio
                  <Play className="w-4 h-4 fill-current" />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-[var(--border-color)]">
              {[
                "Talento Especializado",
                "Calidad Garantizada",
                "Soporte 24/7"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span className="text-sm font-medium text-[var(--text-secondary)]">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative perspective-1000 hidden lg:block"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--blue-corporate)] to-[var(--accent-primary)] rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative aspect-square rounded-[2rem] glass flex items-center justify-center overflow-hidden shadow-2xl">
                <motion.img
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  src="/seishin-SinFondo.png"
                  alt="Seishin Industry 4.0"
                  className="w-4/5 h-auto object-contain drop-shadow-[0_20px_50px_rgba(30,64,175,0.3)]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
