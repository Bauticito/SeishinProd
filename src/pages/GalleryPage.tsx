import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const galleryItems = [
  {
    id: 1,
    title: 'Control de Calidad',
    category: 'Estandarización',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600',
    description: 'Inspección de precisión en línea de producción.',
  },
  {
    id: 2,
    title: 'Logística Inteligente',
    category: 'Operaciones',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600',
    description: 'Gestión de almacenes con sistemas avanzados.',
  },
  {
    id: 3,
    title: 'Tecnología IA',
    category: 'Innovación',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1600',
    description: 'Implementación de soluciones robóticas e IA.',
  },
  {
    id: 4,
    title: 'Talento Especializado',
    category: 'Recursos Humanos',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1600',
    description: 'Reclutamiento y capacitación de alto nivel.',
  },
  {
    id: 5,
    title: 'Industria Automotriz',
    category: 'Sectores',
    image: '/public/industriaAutomotriz.jpg',
    description: 'Soporte operativo en plantas de ensamblaje.',
  },
  {
    id: 6,
    title: 'Consultoría Estratégica',
    category: 'Gestión',
    image: '/public/consulatoriaEstrategica.jpg',
    description: 'Análisis y optimización de procesos industriales.',
  },
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '55%' : '-55%',
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? '55%' : '-55%',
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function GalleryPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const navigate = useCallback((dir: number) => {
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + galleryItems.length) % galleryItems.length);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const current = galleryItems[currentIndex];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-6 text-[#E31E24] shadow-xl">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-6 tracking-tight">
            Nuestra <span className="gradient-text">Galería</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Visualiza la excelencia operativa y la innovación tecnológica que aplicamos en cada proyecto industrial.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Main slide */}
          <div className="overflow-hidden rounded-3xl border border-[var(--border-color-light)] shadow-2xl">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.08}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) navigate(1);
                  else if (info.offset.x > 80) navigate(-1);
                }}
                className="relative aspect-[16/9] md:aspect-[21/9] cursor-grab active:cursor-grabbing select-none"
              >
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Text content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                  <motion.span
                    key={`cat-${currentIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-[#E31E24] font-bold text-xs uppercase tracking-[0.2em] mb-2 inline-block"
                  >
                    {current.category}
                  </motion.span>
                  <motion.h3
                    key={`title-${currentIndex}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32 }}
                    className="text-white text-3xl md:text-5xl font-black tracking-tight mb-3 leading-tight"
                  >
                    {current.title}
                  </motion.h3>
                  <motion.p
                    key={`desc-${currentIndex}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.40 }}
                    className="text-white/70 text-base md:text-lg max-w-xl"
                  >
                    {current.description}
                  </motion.p>
                </div>

                {/* Counter badge */}
                <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full glass border border-white/20 text-white/80 text-xs font-mono font-bold tracking-wider">
                  {currentIndex + 1} / {galleryItems.length}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={() => navigate(-1)}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass border border-white/20 text-white flex items-center justify-center hover:border-[#E31E24] hover:text-[#E31E24] transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(1)}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass border border-white/20 text-white flex items-center justify-center hover:border-[#E31E24] hover:text-[#E31E24] transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot indicators */}
          <div className="flex justify-center items-center gap-2 mt-5">
            {galleryItems.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a imagen ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-8 bg-[#E31E24]'
                    : 'w-2 bg-[var(--border-color-light)] hover:bg-[#E31E24]/50'
                }`}
              />
            ))}
          </div>

          {/* Thumbnail strip */}
          <div className="grid grid-cols-6 gap-2 mt-4">
            {galleryItems.map((item, i) => (
              <button
                key={item.id}
                onClick={() => goTo(i)}
                aria-label={item.title}
                className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all duration-300 focus:outline-none ${
                  i === currentIndex
                    ? 'border-[#E31E24] shadow-[0_0_12px_rgba(227,30,36,0.4)]'
                    : 'border-transparent opacity-50 hover:opacity-90'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {i === currentIndex && (
                  <div className="absolute inset-0 bg-[#E31E24]/10" />
                )}
              </button>
            ))}
          </div>

        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 p-12 rounded-3xl glass border border-[var(--border-color-light)] text-center relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E31E24] rounded-full blur-[120px] opacity-10" />
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            ¿Necesitas material específico?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Contacta a nuestro equipo corporativo para solicitar acceso a nuestro banco de recursos especializados y casos de éxito detallados.
          </p>
          <a href="/#contact" className="btn-primary inline-flex px-8 py-4">
            Contactar ahora
          </a>
        </motion.div>

      </div>
    </div>
  );
}
