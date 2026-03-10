import { Database, Cpu, Camera, Globe, TrendingUp, Workflow, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const elementIcons = [Database, Cpu, Camera, Globe, TrendingUp, Workflow];
const timelineColors = ['var(--text-tertiary)', 'var(--text-tertiary)', 'var(--blue-corporate)', 'var(--accent-primary)'];

export default function Industry40() {
  const { t } = useTranslation();
  const elements = elementIcons.map((icon, index) => ({
    icon,
    label: t(`industry.elements.${index}`),
  }));
  const solutions = [0, 1, 2].map((index) => ({
    title: t(`industry.solutions.${index}.title`),
    desc: t(`industry.solutions.${index}.desc`),
  }));
  const timeline = [0, 1, 2, 3].map((index) => ({
    year: t(`industry.timeline.${index}.year`),
    label: t(`industry.timeline.${index}.label`),
    color: timelineColors[index],
  }));

  return (
    <section id="industry40" className="py-24 px-4 sm:px-6 bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-primary)] opacity-[0.03] blur-[120px] rounded-full" />

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
            {t('industry.badge')}
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-6 tracking-tight">
            {t('industry.heading')} <span className="gradient-text">{t('industry.heading_accent')}</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">{t('industry.intro')}</p>
        </motion.div>

        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10 md:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-20" />
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-12 text-center">{t('industry.timeline_title')}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
              <div className="absolute top-[40px] left-0 right-0 h-px bg-[var(--border-color)] hidden lg:block" />
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
                  <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>
                    {item.year}
                  </div>
                  <div className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10"
          >
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-8">{t('industry.elements_title')}</h3>
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#3A3A3A] to-[#1c1c1c] rounded-3xl p-10 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <TrendingUp className="w-40 h-40" />
            </div>
            <h3 className="text-2xl font-bold mb-8">{t('industry.solutions_title')}</h3>
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
            {t('industry.cta')}
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
