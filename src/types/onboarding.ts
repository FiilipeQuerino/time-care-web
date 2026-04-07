export interface OnboardingStatus {
  userId: string;
  isFirstLogin: boolean;
  shouldOfferTutorial: boolean;
  tutorialVersion: string;
  tutorialAccepted?: boolean | null;
  firstLoginAt?: string | null;
  tutorialOfferedAt?: string | null;
  tutorialCompletedAt?: string | null;
  lastSeenWhatsNewVersion?: string;
}

export interface TutorialDecisionPayload {
  accepted: boolean;
  tutorialVersion?: string;
}

export interface TutorialCompletedPayload {
  tutorialVersion?: string;
}
