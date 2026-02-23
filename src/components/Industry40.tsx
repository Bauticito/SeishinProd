import { Database, Cpu, Camera, Globe, TrendingUp, Workflow, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const elements = [
  { icon: Database, label: 'Información digital' },
  { icon: Cpu, label: 'Empleados inteligentes' },
  { icon: Camera, label: 'Cámaras inteligentes' },
  { icon: Globe, label: 'Cliente conectado 24/7' },
  { icon: TrendingUp, label: 'Alineación estratégica' },
  { icon: Workflow, label: 'Operaciones eficientes' }
];

const solutions = [
  { title: 'Call center inteligente', desc: 'Gestión omnicanal con IA' },
  { title: 'Ecosistema ERP + IA', desc: 'Automatización administrativa' },
  { title: 'Workflows autónomos', desc: 'Optimización de flujo de valor' }
];

const timeline = [
  { year: '1760', label: 'Mecánica', color: 'var(--text-tertiary)' },
  { year: '1870', label: 'Eléctrica', color: 'var(--text-tertiary)' },
  { year: '1969', label: 'Digital', color: 'var(--blue-corporate)' },
  { year: 'Hoy', label: 'IA & Datos', color: 'var(--accent-primary)' }
];

export default function Industry40() {
  return (
    <section id="industry40" className="py-24 px-4 sm:px-6 bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-primary)] opacity-[0.03] blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[var(--accent-primary)] font-bold tracking-widest uppercase text-sm mb-4 block"
          >
            Siguiente Nivel
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-6 tracking-tight">
            Industria <span className="gradient-text">4.0</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            La transformación digital no es una opción, es el motor de la competitividad moderna. Estamos listos para liderar su evolución.
          </p>
        </motion.div>

        {/* Timeline Evolution */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10 md:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-20"></div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-12 text-center">Evolución Industrial</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
              <div className="absolute top-[40px] left-0 right-0 h-px bg-[var(--border-color)] hidden lg:block"></div>
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center relative z-10"
                >
                  <div
                    className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl transition-transform hover:scale-110 border border-[var(--border-color-light)] glass"
                    style={{ color: item.color }}
                  >
                    <span className="font-black text-2xl">{index + 1}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>{item.year}</div>
                  <div className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Key Elements Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10"
          >
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Elementos Clave</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {elements.map((element, index) => {
                const Icon = element.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-5 bg-[var(--bg-tertiary)]/30 rounded-2xl border border-[var(--border-color)] transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#E31E24] to-[#3A3A3A] rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[var(--text-primary)] font-semibold text-sm">{element.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Solutions Highlight */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#3A3A3A] to-[#1c1c1c] rounded-3xl p-10 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <TrendingUp className="w-40 h-40" />
            </div>
            <h3 className="text-2xl font-bold mb-8">Nuestras Soluciones</h3>
            <div className="space-y-4">
              {solutions.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 10 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E31E24] text-white rounded-lg flex items-center justify-center font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-white/70 text-sm">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className="btn-primary px-10 py-5 text-lg inline-flex items-center gap-3"
          >
            Convertirse en Industria 4.0
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
