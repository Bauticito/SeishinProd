import { motion } from 'framer-motion';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';

const galleryItems = [
    {
        id: 1,
        title: 'Control de Calidad',
        category: 'Estandarización',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
        description: 'Inspección de precisión en línea de producción.'
    },
    {
        id: 2,
        title: 'Logística Inteligente',
        category: 'Operaciones',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
        description: 'Gestión de almacenes con sistemas avanzados.'
    },
    {
        id: 3,
        title: 'Tecnología IA',
        category: 'Innovación',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
        description: 'Implementación de soluciones robóticas e IA.'
    },
    {
        id: 4,
        title: 'Talento Especializado',
        category: 'Recursos Humanos',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200',
        description: 'Reclutamiento y capacitación de alto nivel.'
    },
    {
        id: 5,
        title: 'Industria Automotriz',
        category: 'Sectores',
        image: 'https://images.unsplash.com/photo-1565043589221-1a3fd866e4a2?auto=format&fit=crop&q=80&w=1200',
        description: 'Soporte operativo en plantas de ensamblaje.'
    },
    {
        id: 6,
        title: 'Consultoría Estratégica',
        category: 'Gestión',
        image: 'https://images.unsplash.com/photo-1454165833767-1301d544b611?auto=format&fit=crop&q=80&w=1200',
        description: 'Análisis y optimización de procesos industriales.'
    }
];

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative rounded-3xl overflow-hidden glass border border-[var(--border-color-light)] aspect-[4/3]"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3A3A3A] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-8">
                                <span className="text-[#E31E24] font-bold text-sm uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    {item.category}
                                </span>
                                <h3 className="text-white text-2xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 translate-y-4 group-hover:translate-y-0">
                                    {item.title}
                                </h3>
                                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 translate-y-4 group-hover:translate-y-0">
                                    {item.description}
                                </p>
                                <div className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                                    <Maximize2 className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-24 p-12 rounded-3xl glass border border-[var(--border-color-light)] text-center relative overflow-hidden"
                >
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E31E24] rounded-full blur-[120px] opacity-10"></div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">¿Necesitas material específico?</h2>
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
