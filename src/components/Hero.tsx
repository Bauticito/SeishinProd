import { ArrowRight, Play, CheckCircle2, Camera } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[var(--bg-primary)] overflow-hidden pt-20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1.2 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-[#E31E24] rounded-full blur-[160px]"
        />
        <motion.div
          style={{ y: y2 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1.2 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#3A3A3A] rounded-full blur-[140px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(227,30,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(227,30,36,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            style={{ opacity }}
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

            <h1 className="text-5xl md:text-6xl lg:text-8xl font-medium text-[var(--text-primary)] leading-[1] mb-10 tracking-tighter">
              Soluciones <span className="gradient-text">empresariales</span>,<br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--text-secondary)] mt-6 block opacity-80">eliminando las barreras del recurso humano</span>
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/vigilancia"
                  className="flex items-center justify-center gap-3 px-8 py-4 text-base rounded-xl border border-[var(--border-color-light)] bg-[var(--card-bg)] text-[var(--text-primary)] hover:border-[#E31E24]/50 hover:bg-[#E31E24]/5 transition-all duration-300 font-medium"
                >
                  <Camera className="w-5 h-5 text-[#E31E24]" />
                  Vigilancia SeishinIA
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
              {/* Animated Glow Backdrop */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.35, 0.2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-10 bg-gradient-to-r from-[var(--blue-corporate)] via-[var(--accent-primary)] to-[var(--blue-corporate)] rounded-full blur-[80px]"
              />

              <div className="relative aspect-square rounded-[3rem] glass flex items-center justify-center overflow-hidden shadow-2xl border border-[var(--border-color-light)]">
                <motion.div
                  whileHover={{ rotateY: 15, rotateX: -10, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="w-4/5 h-4/5 flex items-center justify-center"
                >
                  <motion.img
                    animate={{
                      y: [0, -15, 0],
                      filter: [
                        "drop-shadow(0 20px 30px rgba(227,30,36,0.2))",
                        "drop-shadow(0 40px 60px rgba(227,30,36,0.4))",
                        "drop-shadow(0 20px 30px rgba(227,30,36,0.2))"
                      ]
                    }}
                    transition={{
                      y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                      filter: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                    src="/seishin-SinFondo.png"
                    alt="Seishin Industry 4.0"
                    className="w-full h-auto object-contain"
                  />
                </motion.div>

                {/* Decorative Tech Rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-[var(--accent-primary)] opacity-10 rounded-full scale-90"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-[var(--text-secondary)] opacity-5 rounded-full scale-75"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
