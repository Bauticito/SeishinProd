import React, { useState } from 'react';
import { Users, Forklift, ClipboardCheck, Package, Bot, FileCheck, Languages, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Service = {
  title: string;
  text: string;
  icon: LucideIcon;
};

const serviceIcons: LucideIcon[] = [Users, Forklift, ClipboardCheck, Package, Bot, FileCheck, Languages, Wrench];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Services() {
  const { t } = useTranslation();
  const services: Service[] = serviceIcons.map((icon, index) => ({
    icon,
    title: t(`services.s${index + 1}_title`),
    text: t(`services.s${index + 1}_desc`),
  }));

  return (
    <section id="services" className="py-24 px-4 sm:px-6 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color-light)] to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-6 tracking-tight">
            {t('services.heading')} <span className="gradient-text">{t('services.heading_accent')}</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">{t('services.intro')}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return <ServiceCard key={index} service={service} Icon={Icon} moreLabel={t('services.more')} />;
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({ service, Icon, moreLabel }: { service: Service; Icon: LucideIcon; moreLabel: string }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / 10);
    setRotateY((centerX - x) / 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card p-8 group relative bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--border-color-light)] overflow-hidden transform-gpu"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#E31E24]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div
        className="w-14 h-14 bg-gradient-to-br from-[#E31E24] to-[#c4191f] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10"
        style={{ transform: 'translateZ(20px)' }}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>

      <h3
        className="text-xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2 relative z-10"
        style={{ transform: 'translateZ(10px)' }}
      >
        {service.title}
      </h3>

      <p className="text-[var(--text-secondary)] leading-relaxed text-sm relative z-10">{service.text}</p>

      <div className="mt-6 pt-6 border-t border-[var(--border-color-light)] opacity-40 group-hover:opacity-100 transition-all duration-300">
        <span className="text-xs font-bold text-[#E31E24] uppercase tracking-wider cursor-pointer hover:translate-x-1 transition-transform inline-block">
          {moreLabel}
        </span>
      </div>
    </motion.div>
  );
}
