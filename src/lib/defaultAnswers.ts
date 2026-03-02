import type { QuoteAnswers } from "./types";

export const defaultAnswers: QuoteAnswers = {
  concern: "intrusion",
  impact: "operation_impact",
  cameraRange: "3-5",
  location: "indoor",
  criticalSchedule: "business",
  intelligenceLevel: "N2",
  hasCamerasInstalled: "yes",
  hasCurrentViewingSystem: "yes",
  privacyMode: "cloud_managed",
  installOption: "configuration_only",
  optionalDetails: {
    brandModel: "",
    labelPhotoNote: "",
    sameLocalNetwork: "unknown",
    fiveMinTestPerCamera: "yes",
    saveCaptures: "yes",
    retentionDays: 15,
  },
};
