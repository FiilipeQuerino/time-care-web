import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchWhatsNew, markVersionSeen } from '../services/systemInfoService';
import { WhatsNewResponse } from '../types/whatsNew';

interface UseWhatsNewOptions {
  token: string | null;
  forceAlwaysShow?: boolean;
}

export const useWhatsNew = ({ token, forceAlwaysShow = false }: UseWhatsNewOptions) => {
  const [data, setData] = useState<WhatsNewResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isMarkingSeen, setIsMarkingSeen] = useState(false);
  const loadedRef = useRef(false);
  const openedOnceRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setData(null);
      setIsChecking(false);
      setHasLoaded(false);
      loadedRef.current = false;
      openedOnceRef.current = false;
      return;
    }
    if (loadedRef.current) return;
    loadedRef.current = true;

    const run = async () => {
      setIsChecking(true);
      setHasLoaded(false);
      try {
        const response = await fetchWhatsNew(token);
        if (!forceAlwaysShow && openedOnceRef.current && response.hasNewVersion) {
          setData({ ...response, hasNewVersion: false, whatsNew: null });
          return;
        }
        setData(
          forceAlwaysShow && response.whatsNew
            ? { ...response, hasNewVersion: true }
            : response,
        );
        if (!forceAlwaysShow && response.hasNewVersion && response.whatsNew) {
          openedOnceRef.current = true;
        }
      } catch {
        // Silent error: do not block app.
        setData({
          currentVersion: '',
          hasNewVersion: false,
          shouldOfferUpdateTutorial: false,
          whatsNew: null,
        });
      } finally {
        setIsChecking(false);
        setHasLoaded(true);
      }
    };

    void run();
  }, [forceAlwaysShow, token]);

  const markSeen = useCallback(
    async (version: string) => {
      if (!token || !version) return;
      setIsMarkingSeen(true);
      try {
        await markVersionSeen(token, version);
      } catch {
        // Silent fail: local session still marks as seen.
      } finally {
        setData((current) => (current ? { ...current, hasNewVersion: false, whatsNew: null } : current));
        setIsMarkingSeen(false);
      }
    },
    [token],
  );

  return useMemo(
    () => ({
      data,
      isChecking,
      hasLoaded,
      isMarkingSeen,
      markSeen,
    }),
    [data, hasLoaded, isChecking, isMarkingSeen, markSeen],
  );
};
