import type { PricingConfig } from "./types";

export const pricingConfig: PricingConfig = {
  currency: "MXN",
  nonMultiplierDiscount: 0.3,
  baseMonthly: 1200,
  baseSetup: 0,
  cameraCounts: {
    "1-2": 2,
    "3-5": 4,
    "6-10": 8,
    "10+": 12,
  },
  cameraMonthly: {
    "1-2": 900,
    "3-5": 2200,
    "6-10": 4200,
    "10+": 6700,
  },
  cameraSetup: {
    "1-2": 2500,
    "3-5": 4800,
    "6-10": 8200,
    "10+": 12600,
  },
  riskMultiplier: {
    intrusion: {
      log_only: 1,
      operation_impact: 1.08,
      economic_loss: 1.16,
      legal_or_physical_risk: 1.24,
    },
    internal_theft: {
      log_only: 1.03,
      operation_impact: 1.1,
      economic_loss: 1.18,
      legal_or_physical_risk: 1.23,
    },
    staff_safety: {
      log_only: 1.06,
      operation_impact: 1.14,
      economic_loss: 1.2,
      legal_or_physical_risk: 1.3,
    },
    access_control: {
      log_only: 1.02,
      operation_impact: 1.09,
      economic_loss: 1.16,
      legal_or_physical_risk: 1.22,
    },
    operational_supervision: {
      log_only: 1,
      operation_impact: 1.07,
      economic_loss: 1.13,
      legal_or_physical_risk: 1.18,
    },
  },
  locationMultiplier: {
    indoor: 1,
    outdoor: 1.15,
    mixed: 1.25,
  },
  coverageMultiplier: {
    business: 1,
    night: 1.1,
    always: 1.2,
  },
  intelligenceAdders: {
    N1: { monthly: 0, setup: 0 },
    N2: { monthly: 800, setup: 1700 },
    N3: { monthly: 1800, setup: 4200 },
    N4: { monthly: 3200, setup: 7400 },
  },
  privacyAdders: {
    local_private: { monthly: 0, setup: 3500 },
    cloud_managed: { monthly: 0, setup: 0 },
  },
  installOptionAdders: {
    full_service: { monthly: 0, setup: 6500 },
    configuration_only: { monthly: 0, setup: 3800 },
    software_only: { monthly: 0, setup: 1200 },
  },
  volumeDiscounts: [
    { minCameras: 6, monthlyPercent: 0.08, setupPercent: 0.05 },
    { minCameras: 11, monthlyPercent: 0.12, setupPercent: 0.08 },
  ],
  guardrails: {
    minMonthly: 1200,
  },
};
