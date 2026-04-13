import { OnboardingLoginFlags } from './auth';
import { WhatsNewResponse } from './whatsNew';

export type EntryFlow =
  | { flow: 'INITIAL_TUTORIAL'; includeWhatsNew: boolean }
  | { flow: 'WHATS_NEW_TUTORIAL'; includeWhatsNew: true }
  | { flow: 'WHATS_NEW_MODAL'; includeWhatsNew: true }
  | { flow: 'NONE'; includeWhatsNew: false };

export function decideEntryFlow(
  login: OnboardingLoginFlags,
  whatsNew: WhatsNewResponse,
): EntryFlow {
  if (login.isFirstLogin && login.shouldOfferTutorial) {
    return {
      flow: 'INITIAL_TUTORIAL',
      includeWhatsNew: whatsNew.hasNewVersion,
    };
  }

  if (whatsNew.hasNewVersion && whatsNew.whatsNew) {
    if (whatsNew.shouldOfferUpdateTutorial || whatsNew.whatsNew.requiresTutorial) {
      return { flow: 'WHATS_NEW_TUTORIAL', includeWhatsNew: true };
    }
    return { flow: 'WHATS_NEW_MODAL', includeWhatsNew: true };
  }

  return { flow: 'NONE', includeWhatsNew: false };
}
