import { pricingConfig } from "./pricingConfig";
import type {
  CameraRange,
  Concern,
  Impact,
  PricingConfig,
  QuoteAnswers,
  QuoteResult,
  SuggestedPlan,
} from "./types";

function roundCurrency(value: number): number {
  return Math.round(value);
}

function getRiskDelta(concern: Concern, impact: Impact): number {
  const concernBase: Record<Concern, number> = {
    intrusion: 10,
    internal_theft: 14,
    staff_safety: 20,
    access_control: 12,
    operational_supervision: 8,
  };

  const impactBase: Record<Impact, number> = {
    log_only: 5,
    operation_impact: 15,
    economic_loss: 25,
    legal_or_physical_risk: 35,
  };

  return concernBase[concern] + impactBase[impact];
}

function getCameraRangeDelta(range: CameraRange): number {
  if (range === "1-2") return 4;
  if (range === "3-5") return 9;
  if (range === "6-10") return 14;
  return 18;
}

function getCoverageLabel(score: number): QuoteResult["coverageLabel"] {
  if (score <= 25) return "Bajo";
  if (score <= 50) return "Medio";
  if (score <= 75) return "Alto";
  return "Critico";
}

export function calculateRiskScore(answers: QuoteAnswers): number {
  let score = 0;

  score += getRiskDelta(answers.concern, answers.impact);
  score += getCameraRangeDelta(answers.cameraRange);

  if (answers.location === "outdoor") score += 10;
  if (answers.location === "mixed") score += 14;
  if (answers.criticalSchedule === "always") score += 12;
  if (answers.criticalSchedule === "night") score += 7;
  if (answers.intelligenceLevel === "N3") score += 7;
  if (answers.intelligenceLevel === "N4") score += 12;

  return Math.max(0, Math.min(100, score));
}

function getVolumeDiscount(
  cameraCount: number,
  config: PricingConfig,
): { monthlyPercent: number; setupPercent: number } {
  const sorted = [...config.volumeDiscounts].sort((a, b) => a.minCameras - b.minCameras);
  let matched = { monthlyPercent: 0, setupPercent: 0 };

  for (const discount of sorted) {
    if (cameraCount >= discount.minCameras) {
      matched = {
        monthlyPercent: discount.monthlyPercent,
        setupPercent: discount.setupPercent,
      };
    }
  }

  return matched;
}

export function calculateQuote(
  answers: QuoteAnswers,
  config: PricingConfig = pricingConfig,
): QuoteResult {
  const privacyMode = answers.privacyMode ?? "cloud_managed";
  const nonMultiplierFactor = Math.max(0, 1 - config.nonMultiplierDiscount);
  const riskMultiplier = config.riskMultiplier[answers.concern][answers.impact];
  const locationMultiplier = config.locationMultiplier[answers.location];
  const coverageMultiplier = config.coverageMultiplier[answers.criticalSchedule];

  const baseMonthly = roundCurrency(config.baseMonthly * nonMultiplierFactor);
  const baseSetup = roundCurrency(config.baseSetup * nonMultiplierFactor);
  const cameraMonthly = roundCurrency(
    config.cameraMonthly[answers.cameraRange] * nonMultiplierFactor,
  );
  const cameraSetup = roundCurrency(
    config.cameraSetup[answers.cameraRange] * nonMultiplierFactor,
  );

  const intelligenceRaw = config.intelligenceAdders[answers.intelligenceLevel];
  const intelligence = {
    monthly: roundCurrency(intelligenceRaw.monthly * nonMultiplierFactor),
    setup: roundCurrency(intelligenceRaw.setup * nonMultiplierFactor),
  };
  const privacy =
    config.privacyAdders[privacyMode] ?? config.privacyAdders.cloud_managed;
  const discountedPrivacy = {
    monthly: roundCurrency(privacy.monthly * nonMultiplierFactor),
    setup: roundCurrency(privacy.setup * nonMultiplierFactor),
  };
  const installRaw = config.installOptionAdders[answers.installOption];
  const install = {
    monthly: roundCurrency(installRaw.monthly * nonMultiplierFactor),
    setup: roundCurrency(installRaw.setup * nonMultiplierFactor),
  };

  const riskMonthly = roundCurrency((baseMonthly + cameraMonthly) * (riskMultiplier - 1));
  const riskSetup = roundCurrency((baseSetup + cameraSetup) * (riskMultiplier - 1));

  const coverageMonthly = roundCurrency(
    (baseMonthly + cameraMonthly) * (locationMultiplier * coverageMultiplier - 1),
  );
  const coverageSetup = roundCurrency(
    (baseSetup + cameraSetup) * (locationMultiplier * coverageMultiplier - 1),
  );

  const subtotalMonthly =
    baseMonthly +
    cameraMonthly +
    riskMonthly +
    coverageMonthly +
    intelligence.monthly +
    discountedPrivacy.monthly +
    install.monthly;

  const subtotalSetup =
    baseSetup +
    cameraSetup +
    riskSetup +
    coverageSetup +
    intelligence.setup +
    discountedPrivacy.setup +
    install.setup;

  const cameraCount = config.cameraCounts[answers.cameraRange];
  const discount = getVolumeDiscount(cameraCount, config);

  const volumeDiscountMonthly = roundCurrency(subtotalMonthly * discount.monthlyPercent * -1);
  const volumeDiscountSetup = roundCurrency(subtotalSetup * discount.setupPercent * -1);

  const monthly = Math.max(
    config.guardrails.minMonthly,
    roundCurrency(subtotalMonthly + volumeDiscountMonthly),
  );
  const setup = roundCurrency(subtotalSetup + volumeDiscountSetup);

  const riskScore = calculateRiskScore(answers);

  return {
    monthly,
    setup,
    riskScore,
    coverageLabel: getCoverageLabel(riskScore),
    breakdown: {
      baseMonthly,
      baseSetup,
      camerasMonthly: cameraMonthly,
      camerasSetup: cameraSetup,
      riskMonthly,
      riskSetup,
      coverageMonthly,
      coverageSetup,
      intelligenceMonthly: intelligence.monthly,
      intelligenceSetup: intelligence.setup,
      privacyMonthly: discountedPrivacy.monthly,
      privacySetup: discountedPrivacy.setup,
      installMonthly: install.monthly,
      installSetup: install.setup,
      volumeDiscountMonthly,
      volumeDiscountSetup,
      totalMonthly: monthly,
      totalSetup: setup,
    },
  };
}

export function getSuggestedPlans(score: number): SuggestedPlan[] {
  if (score <= 35) {
    return [
      {
        title: "Basico",
        recommendedLevel: "N1",
        targetScore: "0-35",
        highlights: [
          "Registro inteligente de eventos",
          "Ideal para iniciar rapido",
          "Costo contenido y escalable",
        ],
      },
      {
        title: "Profesional",
        recommendedLevel: "N2",
        targetScore: "36-70",
        highlights: [
          "Alertas inmediatas al detectar riesgo",
          "Mayor control operativo",
          "Buen equilibrio costo-beneficio",
        ],
      },
      {
        title: "Critico",
        recommendedLevel: "N4",
        targetScore: "71-100",
        highlights: [
          "Escalamiento automatico",
          "Maxima cobertura para riesgo alto",
          "Recomendado para operaciones sensibles",
        ],
      },
    ];
  }

  if (score <= 70) {
    return [
      {
        title: "Basico",
        recommendedLevel: "N2",
        targetScore: "0-35",
        highlights: [
          "Alerta base para empezar",
          "Configurable por zonas",
          "Ideal para presupuesto moderado",
        ],
      },
      {
        title: "Profesional",
        recommendedLevel: "N3",
        targetScore: "36-70",
        highlights: [
          "Alerta inmediata + respuesta estructurada",
          "Mejor cobertura en horarios criticos",
          "Recomendado para crecimiento",
        ],
      },
      {
        title: "Critico",
        recommendedLevel: "N4",
        targetScore: "71-100",
        highlights: [
          "Automatizacion total",
          "Pensado para ambientes de alto riesgo",
          "Incluye mejores practicas de escalamiento",
        ],
      },
    ];
  }

  return [
    {
      title: "Basico",
      recommendedLevel: "N2",
      targetScore: "0-35",
      highlights: [
        "Cobertura inicial para riesgos moderados",
        "Visibilidad centralizada",
        "Implementacion rapida",
      ],
    },
    {
      title: "Profesional",
      recommendedLevel: "N3",
      targetScore: "36-70",
      highlights: [
        "Deteccion + escalamiento ordenado",
        "Respuesta mas consistente",
        "Adecuado para multiple sedes",
      ],
    },
    {
      title: "Critico",
      recommendedLevel: "N4",
      targetScore: "71-100",
      highlights: [
        "Maximo nivel de automatizacion",
        "Cobertura de riesgo alta/critica",
        "Recomendado para seguridad de personal",
      ],
    },
  ];
}
