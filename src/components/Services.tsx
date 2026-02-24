import React, { useState } from 'react';
import { Users, Forklift, ClipboardCheck, Package, Bot, FileCheck, Languages, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Planificación estratégica de personal',
    text: 'Gestión estratégica de recursos humanos con análisis predictivo.',
    icon: Users,
  },
  {
    title: 'Logística interna con montacargas',
    text: 'Operaciones eficientes de manejo de materiales y optimización de flujos.',
    icon: Forklift,
  },
  {
    title: 'Servicio de inspección de calidad',
    text: 'Control riguroso y aseguramiento de calidad bajo estándares internacionales.',
    icon: ClipboardCheck,
  },
  {
    title: 'Retrabajo de partes y almacenaje',
    text: 'Gestión integral de productos manufacturados con trazabilidad total.',
    icon: Package,
  },
  {
    title: 'Automatización con IA',
    text: 'Análisis de datos y automatización de procesos administrativos inteligentes.',
    icon: Bot,
  },
  {
    title: 'Aseguramiento de Calidad',
    text: 'Estandarización y mejora continua de procesos industriales.',
    icon: FileCheck,
  },
  {
    title: 'Servicio de traducción técnica',
    text: 'Traducciones legales y técnicas especializadas para la industria.',
    icon: Languages,
  },
  {
    title: 'Fabricación de JIGS',
    text: 'Diseño y fabricación de herramientas de precisión para manufactura.',
    icon: Wrench,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function Services() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color-light)] to-transparent"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-6 tracking-tight">
            Nuestros <span className="gradient-text">Servicios</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Soluciones integrales diseñadas para la excelencia operativa en la industria automotriz y manufacturera.
          </p>
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
            return (
              <ServiceCard key={index} service={service} Icon={Icon} />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({ service, Icon }: { service: any, Icon: any }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = (y - centerY) / 10;
    const rotateYValue = (centerX - x) / 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
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
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
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

      <p className="text-[var(--text-secondary)] leading-relaxed text-sm relative z-10">
        {service.text}
      </p>

      <div className="mt-6 pt-6 border-t border-[var(--border-color-light)] opacity-40 group-hover:opacity-100 transition-all duration-300">
        <span className="text-xs font-bold text-[#E31E24] uppercase tracking-wider cursor-pointer hover:translate-x-1 transition-transform inline-block">Saber más →</span>
      </div>
    </motion.div>
  );
}
