import { useCallback, useEffect, useMemo, useState } from 'react';
import SEO from '../components/SEO/SEO';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Maximize2,
  PlayCircle,
  X,
  Search as SearchIcon,
  Tag,
  Briefcase,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localGalleryItems, type MediaItem } from '../lib/localGalleryItems';
import { fetchMediaItems, hasMediaApiConfigured } from '../lib/mediaApi';

type MediaType = 'image' | 'video';
type FilterType = 'all' | MediaType;

export default function GalleryPage() {
  const { t } = useTranslation();
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>(localGalleryItems);
  const [isLoadingFromApi, setIsLoadingFromApi] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  const quickFilters = ['Empleos', 'Eventos'];

  useEffect(() => {
    if (!hasMediaApiConfigured) return;

    let isMounted = true;

    const loadMedia = async () => {
      setIsLoadingFromApi(true);
      setApiError(null);
      try {
        const apiItems = await fetchMediaItems();
        if (isMounted) {
          setGalleryItems(apiItems);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error ? error.message : t('gallery.error_fallback');
          setApiError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingFromApi(false);
        }
      }
    };

    void loadMedia();

    return () => {
      isMounted = false;
    };
  }, [t]);

  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesType = activeFilter === 'all' || item.mediaType === activeFilter;

      const searchLower = searchTerm.toLowerCase();
      let matchesSearch = item.title.toLowerCase().includes(searchLower);

      // Special case for 'Empleos'
      if (searchLower === 'empleos') {
        const employmentKeywords = ['vacante', 'becario', 'puesto', 'empleo', 'montacarguista', 'soldador', 'operario', 'beneficios', 'cultura', 'frase', 'semana', 'varias'];
        matchesSearch = employmentKeywords.some(kw => item.title.toLowerCase().includes(kw));
      }

      // Special case for 'Eventos'
      if (searchLower === 'eventos') {
        const eventKeywords = ['consejo', 'evento', 'reunion', 'junta', 'ceremonia', 'presentacion', 'corporativo', 'social', 'equipo'];
        matchesSearch = eventKeywords.some(kw => item.title.toLowerCase().includes(kw));
      }

      return matchesType && matchesSearch;
    });
  }, [activeFilter, galleryItems, searchTerm]);

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
      <SEO
        title="Galería | Cultura, Vacantes y Proyectos Industriales"
        description="Explora la galería de Seishin International: conoce nuestra cultura organizacional, vacantes de empleo, eventos corporativos y proyectos de automatización industrial en México."
        keywords="galería Seishin, cultura organizacional, vacantes Seishin, eventos industriales, proyectos automatización, equipo Seishin International"
        ogTitle="Galería Seishin International | Cultura y Proyectos"
        ogDescription="Descubre el equipo, la cultura y los proyectos industriales de Seishin International en Aguascalientes y Guanajuato."
      />
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
            {t('gallery.heading_prefix')} <span className="gradient-text">{t('gallery.heading_suffix')}</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-4">
            Buscas trabajo, observa nuestras vacantes, eventos, cultura organizacional, procesos industriales y el talento que impulsa la innovación en Seishin.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="max-w-3xl mx-auto mb-12 space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-500 group-focus-within:text-[#E31E24] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar por puesto o proceso (ej. Soldador, Montacarguista...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-[var(--text-primary)] focus:outline-none focus:border-[#E31E24] transition-colors shadow-2xl"
            />
          </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {/* Media Type Filters */}
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${activeFilter === 'all'
                ? 'bg-[#E31E24] text-white border-[#E31E24]'
                : 'border-white/10 bg-white/5 text-[var(--text-primary)] hover:border-white/30'
              }`}
          >
            {t('gallery.filter_all')} ({galleryItems.length})
          </button>
          <button
            onClick={() => setActiveFilter('image')}
            className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all inline-flex items-center gap-2 ${activeFilter === 'image'
                ? 'bg-[#E31E24] text-white border-[#E31E24]'
                : 'border-white/10 bg-white/5 text-[var(--text-primary)] hover:border-white/30'
              }`}
          >
            <ImageIcon className="w-4 h-4" /> {t('gallery.filter_images')} ({imageCount})
          </button>
          <button
            onClick={() => setActiveFilter('video')}
            className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all inline-flex items-center gap-2 ${activeFilter === 'video'
                ? 'bg-[#E31E24] text-white border-[#E31E24]'
                : 'border-white/10 bg-white/5 text-[var(--text-primary)] hover:border-white/30'
              }`}
          >
            <Film className="w-4 h-4" /> {t('gallery.filter_videos')} ({videoCount})
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 mx-2 hidden md:block" />

          {/* Quick Category Filters */}
          {quickFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setSearchTerm(searchTerm === filter ? '' : filter)}
              className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all flex items-center gap-2 ${searchTerm === filter
                ? 'bg-[#E31E24]/20 border-[#E31E24] text-[#E31E24]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                }`}
            >
              <Tag className="w-3.5 h-3.5" />
              {filter}
            </button>
          ))}
        </div>
      </div>

      {isLoadingFromApi && (
          <div className="text-center text-[var(--text-secondary)] mb-8">{t('gallery.loading')}</div>
        )}

        {apiError && (
          <div className="text-center text-amber-400 mb-8">
            {t('gallery.error_prefix')} {apiError}. {t('gallery.error_suffix')}
          </div>
        )}

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
                {item.mediaType === 'image' ? t('gallery.image') : t('gallery.video')}
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
          <div className="mt-10 text-center text-[var(--text-secondary)]">{t('gallery.empty')}</div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
        >
          <div className="p-16 rounded-3xl bg-[#E31E24] text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <h3 className="text-4xl font-black mb-6 relative z-10">¿Buscas nuevos retos?</h3>
            <p className="text-white/80 mb-10 relative z-10 text-lg leading-relaxed font-medium">
              Únete a una de las empresas con mayor crecimiento tecnológico en México. Estamos buscando soldadores, montacarguistas y talento apasionado.
            </p>
            <Link
              to="/empleos"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#E31E24] rounded-2xl font-bold hover:shadow-2xl transition-all hover:-translate-y-1 text-lg"
            >
              Ver vacantes activas
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>

          <div className="p-16 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E31E24]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <h3 className="text-4xl font-black text-[var(--text-primary)] mb-6 relative z-10">Excelencia en Servicios</h3>
            <p className="text-[var(--text-secondary)] mb-10 relative z-10 text-lg leading-relaxed">
              Desde inspección de calidad asistida por IA hasta logística industrial 4.0. Conoce cómo transformamos la industria.
            </p>
            <a
              href="http://localhost:5173/#services"
              className="inline-flex items-center gap-2 px-10 py-5 border-2 border-[#E31E24] text-[#E31E24] rounded-2xl font-bold hover:bg-[#E31E24] hover:text-white transition-all hover:-translate-y-1 text-lg"
            >
              Explorar servicios
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>
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
                  {activeIndex + 1} {t('gallery.of')} {filteredItems.length}
                </div>
                <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1 px-4">{activeItem.title}</h3>
                <button
                  onClick={closeItem}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  aria-label={t('gallery.close')}
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
                      aria-label={t('gallery.prev')}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={showNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white"
                      aria-label={t('gallery.next')}
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
