export type Concern =
  | "intrusion"
  | "internal_theft"
  | "staff_safety"
  | "access_control"
  | "operational_supervision";

export type Impact =
  | "log_only"
  | "operation_impact"
  | "economic_loss"
  | "legal_or_physical_risk";

export type CameraRange = "1-2" | "3-5" | "6-10" | "10+";
export type LocationType = "indoor" | "outdoor" | "mixed";
export type CriticalSchedule = "business" | "night" | "always";
export type IntelligenceLevel = "N1" | "N2" | "N3" | "N4";

export type YesNoUnknown = "yes" | "no" | "unknown";
export type InstallOption = "full_service" | "configuration_only" | "software_only";
export type PrivacyMode = "local_private" | "cloud_managed";

export interface OptionalDetails {
  brandModel: string;
  labelPhotoNote: string;
  sameLocalNetwork: YesNoUnknown;
  fiveMinTestPerCamera: "yes" | "no";
  saveCaptures: "yes" | "no";
  retentionDays: number;
}

export interface QuoteAnswers {
  concern: Concern;
  impact: Impact;
  cameraRange: CameraRange;
  location: LocationType;
  criticalSchedule: CriticalSchedule;
  intelligenceLevel: IntelligenceLevel;
  hasCamerasInstalled: "yes" | "no";
  hasCurrentViewingSystem: YesNoUnknown;
  privacyMode: PrivacyMode;
  installOption: InstallOption;
  optionalDetails: OptionalDetails;
}

export interface QuoteBreakdown {
  baseMonthly: number;
  baseSetup: number;
  camerasMonthly: number;
  camerasSetup: number;
  riskMonthly: number;
  riskSetup: number;
  coverageMonthly: number;
  coverageSetup: number;
  intelligenceMonthly: number;
  intelligenceSetup: number;
  privacyMonthly: number;
  privacySetup: number;
  installMonthly: number;
  installSetup: number;
  volumeDiscountMonthly: number;
  volumeDiscountSetup: number;
  totalMonthly: number;
  totalSetup: number;
}

export interface QuoteResult {
  monthly: number;
  setup: number;
  riskScore: number;
  coverageLabel: "Bajo" | "Medio" | "Alto" | "Critico";
  breakdown: QuoteBreakdown;
}

export interface PricingConfig {
  currency: "MXN";
  nonMultiplierDiscount: number;
  baseMonthly: number;
  baseSetup: number;
  cameraCounts: Record<CameraRange, number>;
  cameraMonthly: Record<CameraRange, number>;
  cameraSetup: Record<CameraRange, number>;
  riskMultiplier: Record<Concern, Record<Impact, number>>;
  locationMultiplier: Record<LocationType, number>;
  coverageMultiplier: Record<CriticalSchedule, number>;
  intelligenceAdders: Record<IntelligenceLevel, { monthly: number; setup: number }>;
  privacyAdders: Record<PrivacyMode, { monthly: number; setup: number }>;
  installOptionAdders: Record<InstallOption, { monthly: number; setup: number }>;
  volumeDiscounts: Array<{
    minCameras: number;
    monthlyPercent: number;
    setupPercent: number;
  }>;
  guardrails: {
    minMonthly: number;
  };
}

export interface SuggestedPlan {
  title: "Basico" | "Profesional" | "Critico";
  recommendedLevel: IntelligenceLevel;
  targetScore: string;
  highlights: string[];
}
