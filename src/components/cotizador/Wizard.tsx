import { useMemo, useState } from "react";
import { useQuoteStore } from "@/lib/store";
import type { Concern, Impact, InstallOption, IntelligenceLevel } from "@/lib/types";
import { Step } from "./Step";
import { PlanCard } from "./PlanCard";
import { OptionalDetailsAccordion } from "./OptionalDetailsAccordion";

const stepTitles = [
  "Qué proteger",
  "Alcance",
  "Nivel IA",
  "Infraestructura",
];

const concernOptions: Array<{ value: Concern; label: string }> = [
  { value: "intrusion", label: "Intrusión" },
  { value: "internal_theft", label: "Robos internos" },
  { value: "staff_safety", label: "Seguridad del personal" },
  { value: "access_control", label: "Control de accesos" },
  { value: "operational_supervision", label: "Supervisión operativa" },
];

const impactOptions: Array<{ value: Impact; label: string }> = [
  { value: "log_only", label: "Solo registro" },
  { value: "operation_impact", label: "Afecta operación" },
  { value: "economic_loss", label: "Pérdida económica" },
  { value: "legal_or_physical_risk", label: "Riesgo legal o físico" },
];

const installOptionLabels: Record<InstallOption, string> = {
  full_service: "Servicio completo",
  configuration_only: "Solo configuración",
  software_only: "Solo software",
};

const intelligenceCards: Array<{ level: IntelligenceLevel; title: string; description: string }> = [
  {
    level: "N1",
    title: "Registro inteligente",
    description: "Visibilidad y registro ordenado de eventos.",
  },
  {
    level: "N2",
    title: "Alerta inmediata",
    description: "Detecta y notifica en el momento para actuar rápido.",
  },
  {
    level: "N3",
    title: "Escalamiento automático",
    description: "Activa reglas de escalamiento según severidad.",
  },
  {
    level: "N4",
    title: "Sistema crítico",
    description: "Máxima cobertura para operaciones de alto riesgo.",
  },
];

// ── Option group ──────────────────────────────────────────────────────────────

function OptionGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={[
            "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200",
            value === option.value
              ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--text-primary)] shadow-md shadow-[var(--accent-primary)]/10"
              : "border-[var(--border-color-light)] glass text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-primary)]",
          ].join(" ")}
        >
          <span
            className={[
              "mr-2 inline-block w-2 h-2 rounded-full align-middle transition-colors",
              value === option.value ? "bg-[var(--accent-primary)]" : "bg-[var(--text-tertiary)]",
            ].join(" ")}
          />
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ── Camera range slider ───────────────────────────────────────────────────────

function CameraRangeSlider() {
  const cameraRange = useQuoteStore((s) => s.answers.cameraRange);
  const updateAnswer = useQuoteStore((s) => s.updateAnswer);

  const marks = [
    { index: 0, value: "1-2", label: "1-2" },
    { index: 1, value: "3-5", label: "3-5" },
    { index: 2, value: "6-10", label: "6-10" },
    { index: 3, value: "10+", label: "10+" },
  ] as const;

  const selectedIndex = marks.find((m) => m.value === cameraRange)?.index ?? 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider text-xs">
          Cámaras a integrar
        </span>
        <strong className="text-[var(--accent-primary)] font-black text-lg">{cameraRange}</strong>
      </div>
      <input
        type="range"
        min={0}
        max={3}
        step={1}
        value={selectedIndex}
        onChange={(e) => {
          const next = marks[Number(e.target.value)]?.value ?? "3-5";
          updateAnswer("cameraRange", next);
        }}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)] bg-[var(--bg-tertiary)]/40"
      />
      <div className="grid grid-cols-4 text-center text-xs text-[var(--text-tertiary)]">
        {marks.map((mark) => (
          <span key={mark.value} className={cameraRange === mark.value ? "text-[var(--accent-primary)] font-bold" : ""}>
            {mark.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Suggested plans ───────────────────────────────────────────────────────────

function SuggestedPlans() {
  const plans = useQuoteStore((s) => s.suggestedPlans);
  const answers = useQuoteStore((s) => s.answers);
  const updateAnswer = useQuoteStore((s) => s.updateAnswer);

  return (
    <div className="rounded-2xl border border-[var(--border-color-light)] glass p-5">
      <p className="text-sm font-black text-[var(--text-primary)] mb-1">Planes sugeridos</p>
      <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
        Ajustados al nivel de riesgo y cobertura que elegiste.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {plans.map((plan) => {
          const selected = answers.intelligenceLevel === plan.recommendedLevel;
          return (
            <div
              key={plan.title}
              className={[
                "rounded-xl border p-4 transition-all duration-200",
                selected
                  ? "border-[#E31E24] bg-[#E31E24]/10"
                  : "border-[var(--border-color-light)] bg-[var(--card-bg)]",
              ].join(" ")}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-[var(--text-primary)]">{plan.title}</p>
                <span className="text-xs font-black text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded-md">
                  {plan.recommendedLevel}
                </span>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mb-3">Score: {plan.targetScore}</p>
              <ul className="mb-3 space-y-1.5">
                {plan.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-0.5 shrink-0">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => updateAnswer("intelligenceLevel", plan.recommendedLevel)}
                className={[
                  "w-full rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200",
                  selected
                    ? "bg-[var(--accent-primary)] text-white"
                    : "border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10",
                ].join(" ")}
              >
                {selected ? "✓ Seleccionado" : "Seleccionar"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--text-secondary)]">
      {children}
    </p>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────────────────

export function Wizard() {
  const currentStep = useQuoteStore((s) => s.currentStep);
  const nextStep = useQuoteStore((s) => s.nextStep);
  const prevStep = useQuoteStore((s) => s.prevStep);
  const reset = useQuoteStore((s) => s.reset);
  const answers = useQuoteStore((s) => s.answers);
  const updateAnswer = useQuoteStore((s) => s.updateAnswer);
  const copySummary = useQuoteStore((s) => s.copySummary);

  const [copyMessage, setCopyMessage] = useState<string>("");

  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <Step
            title="¿Qué querés proteger?"
            description="Enfocamos el sistema en lo que más te importa"
            index={0}
            total={4}
          >
            <div className="space-y-3">
              <SectionLabel>¿Qué te preocupa más?</SectionLabel>
              <OptionGroup
                value={answers.concern}
                options={concernOptions}
                onChange={(value) => updateAnswer("concern", value)}
              />
            </div>
            <div className="space-y-3">
              <SectionLabel>¿Qué pasa si no se detecta a tiempo?</SectionLabel>
              <OptionGroup
                value={answers.impact}
                options={impactOptions}
                onChange={(value) => updateAnswer("impact", value)}
              />
            </div>
          </Step>
        );

      case 1:
        return (
          <Step
            title="Alcance"
            description="Definimos el tamaño y cobertura de la operación"
            index={1}
            total={4}
          >
            <CameraRangeSlider />

            <div className="space-y-3">
              <SectionLabel>¿Dónde están las cámaras?</SectionLabel>
              <OptionGroup
                value={answers.location}
                options={[
                  { value: "indoor", label: "Interior" },
                  { value: "outdoor", label: "Exterior" },
                  { value: "mixed", label: "Mixto" },
                ]}
                onChange={(value) => updateAnswer("location", value)}
              />
            </div>

            <div className="space-y-3">
              <SectionLabel>¿Horario crítico?</SectionLabel>
              <OptionGroup
                value={answers.criticalSchedule}
                options={[
                  { value: "business", label: "Horario laboral" },
                  { value: "night", label: "Nocturno" },
                  { value: "always", label: "24/7" },
                ]}
                onChange={(value) => updateAnswer("criticalSchedule", value)}
              />
            </div>
          </Step>
        );

      case 2:
        return (
          <Step
            title="Nivel de inteligencia"
            description="Elegí cómo querés que responda el sistema"
            index={2}
            total={4}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {intelligenceCards.map((card) => (
                <PlanCard
                  key={card.level}
                  level={card.level}
                  title={card.title}
                  description={card.description}
                  selected={answers.intelligenceLevel === card.level}
                  onSelect={(level) => updateAnswer("intelligenceLevel", level)}
                />
              ))}
            </div>
          </Step>
        );

      default:
        return (
          <Step
            title="Infraestructura"
            description="Últimos datos para cerrar una estimación realista"
            index={3}
            total={4}
          >
            <div className="space-y-3">
              <SectionLabel>¿Ya tenés cámaras instaladas?</SectionLabel>
              <OptionGroup
                value={answers.hasCamerasInstalled}
                options={[
                  { value: "yes", label: "Sí" },
                  { value: "no", label: "No" },
                ]}
                onChange={(value) => updateAnswer("hasCamerasInstalled", value)}
              />
            </div>

            <div className="space-y-3">
              <SectionLabel>¿Tenés sistema para verlas (VMS/NVR/App)?</SectionLabel>
              <OptionGroup
                value={answers.hasCurrentViewingSystem}
                options={[
                  { value: "yes", label: "Sí" },
                  { value: "no", label: "No" },
                  { value: "unknown", label: "No sé" },
                ]}
                onChange={(value) => updateAnswer("hasCurrentViewingSystem", value)}
              />
            </div>

            <div className="space-y-3">
              <SectionLabel>¿Querés máxima privacidad local?</SectionLabel>
              <p className="text-xs text-[var(--text-tertiary)] -mt-1">
                Incluye{" "}
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  maximumFractionDigits: 0,
                }).format(3500)}{" "}
                de inversión inicial por dispositivo dedicado.
              </p>
              <OptionGroup
                value={answers.privacyMode}
                options={[
                  { value: "local_private", label: "Sí, privacidad local" },
                  { value: "cloud_managed", label: "No, gestión en nube" },
                ]}
                onChange={(value) => updateAnswer("privacyMode", value)}
              />
            </div>

            <div className="space-y-3">
              <SectionLabel>¿Querés que instalemos / configuremos todo?</SectionLabel>
              <OptionGroup
                value={answers.installOption}
                options={[
                  { value: "full_service", label: installOptionLabels.full_service },
                  { value: "configuration_only", label: installOptionLabels.configuration_only },
                  { value: "software_only", label: installOptionLabels.software_only },
                ]}
                onChange={(value) => updateAnswer("installOption", value)}
              />
            </div>

            <OptionalDetailsAccordion />
            <SuggestedPlans />

            {/* Final actions */}
            <div className="rounded-2xl border border-[var(--border-color-light)] glass p-4">
              <p className="text-sm font-bold text-[var(--text-primary)] mb-3">Acciones finales</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await copySummary();
                    setCopyMessage(ok ? "Resumen copiado ✓" : "No se pudo copiar");
                    setTimeout(() => setCopyMessage(""), 2200);
                  }}
                  className="rounded-xl border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 px-4 py-2 text-xs font-bold text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/20 transition-colors"
                >
                  Copiar resumen
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-xl border border-[var(--border-color-light)] px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/30 transition-colors"
                >
                  Reiniciar
                </button>
              </div>
              {copyMessage && (
                <p className="mt-2 text-xs font-bold text-[var(--accent-primary)]">{copyMessage}</p>
              )}
            </div>
          </Step>
        );
    }
  }, [answers, copySummary, copyMessage, currentStep, reset, updateAnswer]);

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="grid grid-cols-4 gap-2">
        {stepTitles.map((title, idx) => (
          <div key={title} className="space-y-1.5">
            <div
              className={[
                "h-1 rounded-full transition-all duration-500",
                idx < currentStep
                  ? "bg-[var(--accent-primary)]"
                  : idx === currentStep
                  ? "bg-[var(--accent-primary)]/70"
                  : "bg-[var(--border-color-light)]",
              ].join(" ")}
            />
            <p
              className={[
                "text-[10px] font-bold uppercase tracking-wider transition-colors truncate",
                idx <= currentStep ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]",
              ].join(" ")}
            >
              {title}
            </p>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div key={currentStep} className="transition duration-200 ease-out">
        {stepContent}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3 pb-24 lg:pb-0">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="rounded-xl border border-[var(--border-color-light)] px-5 py-2.5 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Anterior
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={currentStep === 3}
          className="btn-primary px-6 py-2.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
