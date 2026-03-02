import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator as CalcIcon,
    ArrowRight,
    CheckCircle2,
    ArrowLeft,
    Truck,
    Languages,
    Cpu,
    Zap,
    Clock
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Wizard } from './cotizador/Wizard';
import { PricePanel } from './cotizador/PricePanel';
import { ProposalModal } from './cotizador/ProposalModal';
import { useQuoteStore } from '@/lib/store';


type Category = 'machinery' | 'translation' | 'ai';

interface CategoryData {
    id: Category;
    title: string;
    icon: LucideIcon;
    description: string;
}

type SubService = {
    id: string;
    title: string;
    basePrice: number;
};

const categories: CategoryData[] = [
    {
        id: 'machinery',
        title: 'Maquinaria Pesada',
        icon: Truck,
        description: 'Montacargas, elevadores y sistemas de transporte.'
    },
    {
        id: 'translation',
        title: 'Traductores',
        icon: Languages,
        description: 'Traducción especializada Japonés/Español.'
    },
    {
        id: 'ai',
        title: 'Inteligencia Artificial',
        icon: Cpu,
        description: 'Agentes inteligentes y modelos de visión.'
    }
];

const subServices: Record<Exclude<Category, 'translation'>, SubService[]> = {
    machinery: [
        { id: 'forklift', title: 'Montacargas', basePrice: 45 },
        { id: 'conveyor', title: 'Transportadoras', basePrice: 40 },
        { id: 'elevator', title: 'Elevadores', basePrice: 50 },
    ],
    ai: [
        { id: 'agents', title: 'Agentes IA', basePrice: 0 },
        { id: 'vision', title: 'Visión Computarizada', basePrice: 0 },
    ]
};

export default function Calculator() {
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null);
    const [showAgentsIaDetails, setShowAgentsIaDetails] = useState(false);
    const [inputValue, setInputValue] = useState(10); // Generic input (employees or hours)
    const [months, setMonths] = useState(6);
    const [modalOpen, setModalOpen] = useState(false);
    const resetQuoteStore = useQuoteStore((s) => s.reset);

    const handleCategorySelect = (catId: Category) => {
        setSelectedCategory(catId);
        if (catId === 'translation') {
            setSelectedSubService({ id: 'translation', title: 'Traducción Jap/Esp', basePrice: 300 });
            setStep(2);
        } else {
            setStep(1.5); // Sub-selection step
        }
    };

    const handleSubSelect = (sub: SubService) => {
        if (sub.id === 'vision') resetQuoteStore();
        setSelectedSubService(sub);
        setStep(2);
    };

    const handleAiSubClick = (sub: SubService) => {
        if (sub.id === 'agents') {
            setShowAgentsIaDetails((prev) => !prev);
            return;
        }
        handleSubSelect(sub);
    };

    const calculateEstimate = () => {
        if (!selectedSubService) return '$0.00';

        if (selectedCategory === 'translation') {
            return (300 * inputValue).toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN',
            });
        }

        if (selectedCategory === 'ai') {
            return 'Consultar';
        }

        return (selectedSubService.basePrice * inputValue * months).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
        });
    };

    const reset = () => {
        setStep(1);
        setSelectedCategory(null);
        setSelectedSubService(null);
        setShowAgentsIaDetails(false);
        setInputValue(10);
        setMonths(6);
    };

    return (
        <section id="calculator" className="py-24 px-4 sm:px-6 bg-[var(--bg-secondary)] relative overflow-hidden">
            <div className="max-w-5xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-6 text-[#E31E24] shadow-xl">
                        <CalcIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-6 tracking-tight">
                        Cotiza tu <span className="gradient-text">Servicio</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        Selecciona el tipo de servicio y obtén una estimación de inmediato.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid md:grid-cols-3 gap-6"
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className="glass p-8 rounded-[2.5rem] border border-[var(--border-color-light)] hover:border-[#E31E24] transition-all group text-left"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[#E31E24]/10 flex items-center justify-center text-[#E31E24] mb-6 group-hover:scale-110 transition-transform">
                                        <cat.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{cat.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] mb-6">{cat.description}</p>
                                    <div className="flex items-center text-[#E31E24] font-bold text-sm">
                                        Seleccionar <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {step === 1.5 && selectedCategory && (
                        <motion.div
                            key="step1.5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center text-[var(--text-secondary)] mb-8 hover:text-[#E31E24] font-bold"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" /> Volver
                            </button>
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-8">
                                Especifique el servicio de <span className="text-[#E31E24]">{categories.find(c => c.id === selectedCategory)?.title}</span>
                            </h3>
                            <div className="grid gap-4">
                                {(subServices[selectedCategory as keyof typeof subServices] || []).map((sub) => (
                                    <div key={sub.id} className="space-y-3">
                                        <button
                                            onClick={() =>
                                                selectedCategory === 'ai' ? handleAiSubClick(sub) : handleSubSelect(sub)
                                            }
                                            className="w-full flex justify-between items-center p-6 rounded-2xl glass border border-[var(--border-color-light)] hover:border-[#E31E24] transition-all group"
                                        >
                                            <span className="text-lg font-bold text-[var(--text-primary)]">{sub.title}</span>
                                            <ArrowRight className="w-5 h-5 text-[#E31E24] group-hover:translate-x-2 transition-transform" />
                                        </button>

                                        {selectedCategory === 'ai' && sub.id === 'agents' && showAgentsIaDetails && (
                                            <div className="rounded-2xl border border-[#E31E24]/30 bg-[#E31E24]/5 p-6 sm:p-7 space-y-5">
                                                <div>
                                                    <h4 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                                        Agentes IA para Operaciones y RH
                                                    </h4>
                                                    <p className="text-[var(--text-secondary)] leading-relaxed">
                                                        Automatiza tareas repetitivas (seguimiento de candidatos, reportes,
                                                        validaciones y atencion interna) con agentes conectados a tus procesos.
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-bold text-[#E31E24] uppercase tracking-wider mb-2">
                                                        Que incluye
                                                    </p>
                                                    <ul className="space-y-2 text-[var(--text-secondary)]">
                                                        <li>1. Levantamiento de proceso y mapa de tareas.</li>
                                                        <li>2. Diseno del agente por rol (RH, calidad, operacion, administracion).</li>
                                                        <li>3. Integracion con correo, WhatsApp, ERP o Google Sheets.</li>
                                                        <li>4. Tablero de metricas (tiempo ahorrado, SLA, volumen).</li>
                                                        <li>5. Capacitacion y soporte inicial.</li>
                                                    </ul>
                                                </div>

                                                <p className="text-sm font-semibold text-[var(--text-primary)]">
                                                    Resultado esperado: reduccion de 30% a 60% en tiempo operativo administrativo.
                                                </p>

                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <a
                                                        href="/seishinia?servicio=agentes#brief-ia"
                                                        className="btn-primary px-6 py-3 text-sm uppercase tracking-wider text-center"
                                                    >
                                                        Solicitar diagnostico de Agentes IA
                                                    </a>
                                                    <a
                                                        href="https://wa.me/524491155269?text=Hola%2C%20quiero%20solicitar%20diagnostico%20de%20Agentes%20IA%20para%20mi%20operacion."
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-6 py-3 text-sm uppercase tracking-wider text-center rounded-xl border border-[var(--border-color-light)] text-[var(--text-primary)] hover:border-[#E31E24] hover:text-[#E31E24] transition-colors"
                                                    >
                                                        Hablar por WhatsApp
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Visión Computarizada: muestra el Wizard del cotizador */}
                    {step === 2 && selectedSubService?.id === 'vision' && (
                        <motion.div
                            key="step-vision"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <button
                                onClick={() => setStep(1.5)}
                                className="flex items-center text-[var(--text-secondary)] hover:text-[#E31E24] font-bold mb-6"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" /> Volver
                            </button>
                            <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
                                <Wizard />
                                <PricePanel />
                            </div>
                        </motion.div>
                    )}

                    {/* Otros servicios: flujo existente */}
                    {step === 2 && selectedSubService && selectedSubService.id !== 'vision' && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid lg:grid-cols-2 gap-12 items-stretch"
                        >
                            <div className="glass p-8 md:p-12 rounded-[3rem] border border-[var(--border-color-light)] space-y-10">
                                <button
                                    onClick={() => selectedCategory === 'translation' ? setStep(1) : setStep(1.5)}
                                    className="flex items-center text-[var(--text-secondary)] hover:text-[#E31E24] font-bold"
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" /> Volver
                                </button>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#E31E24]/10 flex items-center justify-center text-[#E31E24]">
                                        {selectedCategory === 'machinery' && <Truck className="w-6 h-6" />}
                                        {selectedCategory === 'translation' && <Languages className="w-6 h-6" />}
                                        {selectedCategory === 'ai' && <Cpu className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-[#E31E24] uppercase tracking-wider">Servicio</span>
                                        <h3 className="text-xl font-bold text-[var(--text-primary)]">{selectedSubService.title}</h3>
                                    </div>
                                </div>

                                {selectedCategory !== 'ai' && (
                                    <div className="space-y-10">
                                        <div>
                                            <div className="flex justify-between mb-4">
                                                <label className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                                                    {selectedCategory === 'translation' ? 'Horas de servicio' : 'Personal requerido'}
                                                </label>
                                                <span className="text-[#E31E24] font-black text-xl">{inputValue}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={selectedCategory === 'translation' ? 1 : 5}
                                                max={selectedCategory === 'translation' ? 100 : 500}
                                                step={1}
                                                value={inputValue}
                                                onChange={(e) => setInputValue(parseInt(e.target.value))}
                                                className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-[#E31E24]"
                                            />
                                        </div>

                                        {selectedCategory === 'machinery' && (
                                            <div>
                                                <div className="flex justify-between mb-4">
                                                    <label className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                                                        Duración (Meses)
                                                    </label>
                                                    <span className="text-[#E31E24] font-black text-xl">{months}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="24"
                                                    value={months}
                                                    onChange={(e) => setMonths(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-[#E31E24]"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedCategory === 'ai' && (
                                    <div className="p-8 rounded-2xl bg-[#E31E24]/5 border border-[#E31E24]/10 text-center">
                                        <Zap className="w-10 h-10 text-[#E31E24] mx-auto mb-4" />
                                        <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                                            Los proyectos de IA se cotizan bajo diseño específico. Solicite una llamada para definir el alcance técnico.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gradient-to-br from-[#3A3A3A] to-[#1c1c1c] p-10 md:p-14 rounded-[3rem] text-white shadow-2xl flex flex-col justify-between">
                                <div>
                                    <span className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Estimación Aproximada</span>
                                    <div className="text-5xl md:text-7xl font-black mb-8">
                                        {calculateEstimate()}
                                    </div>
                                    {selectedCategory === 'translation' && (
                                        <div className="flex items-center gap-2 text-white/60 mb-8">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm font-bold">Tarifa fija: 300 MXN / Hora</span>
                                        </div>
                                    )}
                                    <div className="space-y-4 mb-12">
                                        {[
                                            "Precios basados en estándares industriales",
                                            "Escalabilidad flexible",
                                            "Soporte 24/7 disponible"
                                        ].map((txt, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-[#E31E24]" />
                                                <span className="text-sm font-medium text-white/80">{txt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setModalOpen(true)}
                                        className="btn-primary py-5 text-lg flex items-center justify-center gap-3 bg-white text-[#3A3A3A] hover:bg-[#E31E24] hover:text-white"
                                    >
                                        Solicitar Propuesta
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                    <button onClick={reset} className="text-white/40 text-sm font-bold hover:text-white transition-colors">
                                        Empezar de nuevo
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ProposalModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                quoteContext={{
                    service: selectedCategory ? categories.find(c => c.id === selectedCategory)?.title ?? '' : '',
                    subService: selectedSubService?.title ?? '',
                    quantity: inputValue,
                    months: selectedCategory === 'machinery' ? months : undefined,
                    estimate: calculateEstimate(),
                    orderLines:
                        selectedCategory === 'machinery' && selectedSubService
                            ? [{
                                name: `${selectedSubService.title} (${months} mes${months !== 1 ? 'es' : ''})`,
                                qty: inputValue,
                                price: selectedSubService.basePrice * months,
                              }]
                        : selectedCategory === 'translation'
                            ? [{
                                name: 'Traducción Japonés / Español',
                                qty: inputValue,
                                price: 300,
                              }]
                        : undefined,
                }}
            />
        </section>
    );
}
