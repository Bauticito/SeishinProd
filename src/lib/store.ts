import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { calculateQuote, getSuggestedPlans } from "./calculateQuote";
import { defaultAnswers } from "./defaultAnswers";
import { pricingConfig } from "./pricingConfig";
import type { OptionalDetails, QuoteAnswers, QuoteResult, SuggestedPlan } from "./types";

type QuoteState = {
  currentStep: number;
  answers: QuoteAnswers;
  quote: QuoteResult;
  suggestedPlans: SuggestedPlan[];
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateAnswer: <K extends keyof QuoteAnswers>(key: K, value: QuoteAnswers[K]) => void;
  updateOptionalDetails: <K extends keyof OptionalDetails>(
    key: K,
    value: OptionalDetails[K],
  ) => void;
  reset: () => void;
  copySummary: () => Promise<boolean>;
};

function formatMXN(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

const initialQuote = calculateQuote(defaultAnswers, pricingConfig);

function safeStorage() {
  if (typeof window === "undefined") {
    return undefined;
  }
  return createJSONStorage(() => localStorage);
}

function buildSummaryText(answers: QuoteAnswers, quote: QuoteResult): string {
  const concernMap: Record<QuoteAnswers["concern"], string> = {
    intrusion: "Intrusion",
    internal_theft: "Robos internos",
    staff_safety: "Seguridad del personal",
    access_control: "Control de accesos",
    operational_supervision: "Supervision operativa",
  };

  const impactMap: Record<QuoteAnswers["impact"], string> = {
    log_only: "Solo registro",
    operation_impact: "Afecta operacion",
    economic_loss: "Perdida economica importante",
    legal_or_physical_risk: "Riesgo legal o fisico",
  };

  const installMap: Record<QuoteAnswers["installOption"], string> = {
    full_service: "Todo",
    configuration_only: "Solo configuracion",
    software_only: "Solo software",
  };
  const privacyMap: Record<QuoteAnswers["privacyMode"], string> = {
    local_private: "Privacidad local (con dispositivo)",
    cloud_managed: "Gestionado en nube",
  };

  return [
    "COTIZADOR DE SEGURIDAD - RESUMEN",
    "",
    `Preocupacion principal: ${concernMap[answers.concern]}`,
    `Impacto si no se detecta: ${impactMap[answers.impact]}`,
    `Camaras: ${answers.cameraRange}`,
    `Ubicacion: ${answers.location}`,
    `Horario critico: ${answers.criticalSchedule}`,
    `Nivel de inteligencia: ${answers.intelligenceLevel}`,
    `Camaras instaladas: ${answers.hasCamerasInstalled}`,
    `Sistema actual (VMS/NVR/App): ${answers.hasCurrentViewingSystem}`,
    `Privacidad de video: ${privacyMap[answers.privacyMode]}`,
    `Modalidad de implementacion: ${installMap[answers.installOption]}`,
    "",
    `Inversion inicial estimada: ${formatMXN(quote.setup)}`,
    `Costo mensual estimado: ${formatMXN(quote.monthly)}`,
    `Cobertura de riesgo: ${quote.coverageLabel} (${quote.riskScore}/100)`,
    "",
    "Desglose:",
    `- Base: ${formatMXN(quote.breakdown.baseMonthly)} mensual / ${formatMXN(quote.breakdown.baseSetup)} inicial`,
    `- Camaras: ${formatMXN(quote.breakdown.camerasMonthly)} mensual / ${formatMXN(quote.breakdown.camerasSetup)} inicial`,
    `- Riesgo: ${formatMXN(quote.breakdown.riskMonthly)} mensual / ${formatMXN(quote.breakdown.riskSetup)} inicial`,
    `- Cobertura: ${formatMXN(quote.breakdown.coverageMonthly)} mensual / ${formatMXN(quote.breakdown.coverageSetup)} inicial`,
    `- Nivel: ${formatMXN(quote.breakdown.intelligenceMonthly)} mensual / ${formatMXN(quote.breakdown.intelligenceSetup)} inicial`,
    `- Privacidad/dispositivo: ${formatMXN(quote.breakdown.privacyMonthly)} mensual / ${formatMXN(quote.breakdown.privacySetup)} inicial`,
    `- Implementacion: ${formatMXN(quote.breakdown.installMonthly)} mensual / ${formatMXN(quote.breakdown.installSetup)} inicial`,
    `- Descuento volumen: ${formatMXN(quote.breakdown.volumeDiscountMonthly)} mensual / ${formatMXN(quote.breakdown.volumeDiscountSetup)} inicial`,
  ].join("\n");
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: defaultAnswers,
      quote: initialQuote,
      suggestedPlans: getSuggestedPlans(initialQuote.riskScore),
      setStep: (step) => set({ currentStep: Math.max(0, Math.min(3, step)) }),
      nextStep: () => set((state) => ({ currentStep: Math.min(3, state.currentStep + 1) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      updateAnswer: (key, value) =>
        set((state) => {
          const answers = { ...state.answers, [key]: value };
          const quote = calculateQuote(answers, pricingConfig);
          return {
            answers,
            quote,
            suggestedPlans: getSuggestedPlans(quote.riskScore),
          };
        }),
      updateOptionalDetails: (key, value) =>
        set((state) => {
          const answers = {
            ...state.answers,
            optionalDetails: {
              ...state.answers.optionalDetails,
              [key]: value,
            },
          };
          const quote = calculateQuote(answers, pricingConfig);
          return {
            answers,
            quote,
            suggestedPlans: getSuggestedPlans(quote.riskScore),
          };
        }),
      reset: () =>
        set({
          currentStep: 0,
          answers: defaultAnswers,
          quote: initialQuote,
          suggestedPlans: getSuggestedPlans(initialQuote.riskScore),
        }),
      copySummary: async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) {
          return false;
        }

        const state = get();
        const text = buildSummaryText(state.answers, state.quote);
        await navigator.clipboard.writeText(text);
        return true;
      },
    }),
    {
      name: "security-quote-store-v2",
      storage: safeStorage(),
      partialize: (state) => ({
        currentStep: state.currentStep,
        answers: state.answers,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const mergedAnswers = {
          ...defaultAnswers,
          ...state.answers,
          optionalDetails: {
            ...defaultAnswers.optionalDetails,
            ...state.answers?.optionalDetails,
          },
        };
        state.answers = mergedAnswers;
        const quote = calculateQuote(mergedAnswers, pricingConfig);
        state.quote = quote;
        state.suggestedPlans = getSuggestedPlans(quote.riskScore);
      },
    },
  ),
);
