import { motion } from 'framer-motion';
import { Cpu, Globe, Zap } from 'lucide-react';

export default function BrandingHighlight() {
    return (
        <section className="py-24 relative overflow-hidden bg-[var(--bg-primary)]">
            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E31E24] rounded-full blur-[160px] opacity-10 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3A3A3A] rounded-full blur-[140px] opacity-20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="glass rounded-[3rem] p-12 md:p-24 border border-[var(--border-color-light)] text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <span className="inline-block px-6 py-2 rounded-full glass border border-[#E31E24]/30 text-[#E31E24] font-bold text-sm tracking-[0.3em] uppercase mb-8">
                            Próxima Generación
                        </span>

                        <h2 className="text-7xl md:text-9xl lg:text-[12rem] font-light text-[var(--text-primary)] mb-10 tracking-tighter leading-none opacity-90">
                            SEISHIN
                        </h2>

                        <p className="text-2xl md:text-3xl text-[var(--text-secondary)] font-medium max-w-4xl mx-auto mb-16 leading-relaxed">
                            Donde la <span className="text-[#E31E24]">Inteligencia Artificial</span> se encuentra con la excelencia operativa industrial para redefinir el futuro del outsourcing.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Cpu, title: 'IA Core', desc: 'Algoritmos propietarios para optimización de procesos.' },
                                { icon: Globe, title: 'Global Standard', desc: 'Cumplimiento con normativas internacionales de la Industria 4.0.' },
                                { icon: Zap, title: 'Ultra-Eficiencia', desc: 'Reducción de tiempos operativos mediante automatización inteligente.' }
                            ].map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="p-8 rounded-3xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-color-light)] group hover:border-[#E31E24]/50 transition-colors duration-500"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[#E31E24]/10 border border-[#E31E24]/20 flex items-center justify-center text-[#E31E24] mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{item.title}</h3>
                                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
