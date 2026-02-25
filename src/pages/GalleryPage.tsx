import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Maximize2,
  PlayCircle,
  X,
} from 'lucide-react';
import { localGalleryItems, type MediaItem } from '../lib/localGalleryItems';

type MediaType = 'image' | 'video';
type FilterType = 'all' | MediaType;

export default function GalleryPage() {
  const [galleryItems] = useState<MediaItem[]>(localGalleryItems);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return galleryItems;
    return galleryItems.filter((item) => item.mediaType === activeFilter);
  }, [activeFilter, galleryItems]);

  const imageCount = useMemo(
    () => galleryItems.filter((item) => item.mediaType === 'image').length,
    [galleryItems]
  );
  const videoCount = useMemo(
    () => galleryItems.filter((item) => item.mediaType === 'video').length,
    [galleryItems]
  );

  const activeIndex = useMemo(
    () => filteredItems.findIndex((item) => item.id === activeItemId),
    [filteredItems, activeItemId]
  );

  const activeItem = activeIndex >= 0 ? filteredItems[activeIndex] : null;

  const openItem = (id: number) => setActiveItemId(id);
  const closeItem = useCallback(() => setActiveItemId(null), []);

  const showPrev = useCallback(() => {
    if (filteredItems.length === 0 || activeIndex < 0) return;
    const prevIndex = (activeIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveItemId(filteredItems[prevIndex].id);
  }, [filteredItems, activeIndex]);

  const showNext = useCallback(() => {
    if (filteredItems.length === 0 || activeIndex < 0) return;
    const nextIndex = (activeIndex + 1) % filteredItems.length;
    setActiveItemId(filteredItems[nextIndex].id);
  }, [filteredItems, activeIndex]);

  useEffect(() => {
    if (!activeItem) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeItem();
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeItem, closeItem, showNext, showPrev]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-6 text-[#E31E24] shadow-xl">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-6 tracking-tight">
            Nuestra <span className="gradient-text">Galeria</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Explora imagenes y video del material real de Seishin.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#E31E24] text-white border-[#E31E24]'
                : 'border-[var(--border-color-light)] text-[var(--text-primary)] hover:border-[#E31E24]'
            }`}
          >
            Todo ({galleryItems.length})
          </button>
          <button
            onClick={() => setActiveFilter('image')}
            className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all inline-flex items-center gap-2 ${
              activeFilter === 'image'
                ? 'bg-[#E31E24] text-white border-[#E31E24]'
                : 'border-[var(--border-color-light)] text-[var(--text-primary)] hover:border-[#E31E24]'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Imagenes ({imageCount})
          </button>
          <button
            onClick={() => setActiveFilter('video')}
            className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all inline-flex items-center gap-2 ${
              activeFilter === 'video'
                ? 'bg-[#E31E24] text-white border-[#E31E24]'
                : 'border-[var(--border-color-light)] text-[var(--text-primary)] hover:border-[#E31E24]'
            }`}
          >
            <Film className="w-4 h-4" /> Videos ({videoCount})
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              onClick={() => openItem(item.id)}
              className="group relative rounded-3xl overflow-hidden glass border border-[var(--border-color-light)] aspect-[4/3] text-left"
            >
              {item.mediaType === 'image' ? (
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <video
                  src={item.src}
                  preload="metadata"
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => {
                    void e.currentTarget.play();
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/55 text-white text-xs font-semibold backdrop-blur-sm">
                {item.mediaType === 'image' ? 'Imagen' : 'Video'}
              </div>

              {item.mediaType === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <PlayCircle className="w-14 h-14 text-white/80 drop-shadow-xl" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white text-base md:text-lg font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 line-clamp-2">
                  {item.title}
                </h3>
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="mt-10 text-center text-[var(--text-secondary)]">
            No se encontraron elementos para este filtro.
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 p-12 rounded-3xl glass border border-[var(--border-color-light)] text-center relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E31E24] rounded-full blur-[120px] opacity-10"></div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Necesitas material especifico?</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Contacta a nuestro equipo para solicitar recursos adicionales y casos de exito.
          </p>
          <a href="/#contact" className="btn-primary inline-flex px-8 py-4">
            Contactar ahora
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeItem}
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl rounded-3xl overflow-hidden border border-white/10 bg-[#111]"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <div className="text-sm text-white/75">
                  {activeIndex + 1} de {filteredItems.length}
                </div>
                <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1 px-4">{activeItem.title}</h3>
                <button
                  onClick={closeItem}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                {activeItem.mediaType === 'image' ? (
                  <img src={activeItem.src} alt={activeItem.title} className="w-full max-h-[80vh] object-contain bg-black" />
                ) : (
                  <video
                    src={activeItem.src}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[80vh] object-contain bg-black"
                  />
                )}

                {filteredItems.length > 1 && (
                  <>
                    <button
                      onClick={showPrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={showNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white"
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}