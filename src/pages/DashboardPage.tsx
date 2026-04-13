import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FeatureComingSoonModal, NoticeModalType } from '../components/FeatureComingSoonModal';
import { TutorialFlowModal } from '../components/TutorialFlowModal';
import { WhatsNewModal } from '../components/WhatsNewModal';
import { DashboardFinancialData } from '../types/dashboard';
import { MenuSection } from '../types/navigation';
import { fetchDashboardFinancial } from '../services/dashboardService';
import {
  fetchOnboardingStatus,
  markTutorialCompleted,
  updateTutorialDecision,
} from '../services/onboardingService';
import { navItems } from './dashboard/constants';
import { DashboardSection } from './dashboard/sections/DashboardSection';
import { ClientsSection } from './dashboard/sections/ClientsSection';
import { ProceduresSection } from './dashboard/sections/ProceduresSection';
import { ReportsSection } from './dashboard/sections/ReportsSection';
import { AgendaSection } from './dashboard/sections/AgendaSection';
import { ConfigSection } from './dashboard/sections/ConfigSection';
import { TutorialStep } from '../components/TutorialFlowModal';
import { DashboardDesktopSidebar } from '../features/dashboard/components/DashboardDesktopSidebar';
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader';
import { DashboardMobileNavigation } from '../features/dashboard/components/DashboardMobileNavigation';
import { useWhatsNew } from '../hooks/useWhatsNew';
import { decideEntryFlow } from '../types/entryFlow';
import { OnboardingLoginFlags } from '../types/auth';
import { WhatsNewEntry } from '../types/whatsNew';

const LOCAL_TUTORIAL_TEST_MODE = false;
const FORCE_TUTORIAL_ON_ENTRY = false;
const PERSIST_TUTORIAL_COMPLETION = true;
const FORCE_WHATS_NEW_ALWAYS = false;

export const DashboardPage = () => {
  const { user, logout, token, onboarding, onboardingResolved, setOnboardingFlags } = useAuth();

  const [activeSection, setActiveSection] = useState<MenuSection>('dashboard');

  const [financialData, setFinancialData] = useState<DashboardFinancialData | null>(null);
  const [isLoadingFinancial, setIsLoadingFinancial] = useState(false);
  const [financialError, setFinancialError] = useState<string | null>(null);

  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [noticeModal, setNoticeModal] = useState<{
    isOpen: boolean;
    type: NoticeModalType;
    title: string;
    message?: string;
    helperText?: string;
    confirmLabel?: string;
  }>({
    isOpen: false,
    type: 'coming-soon',
    title: '',
  });
  const [clientsRefreshTick, setClientsRefreshTick] = useState(0);
  const [proceduresRefreshTick, setProceduresRefreshTick] = useState(0);
  const [tutorialStage, setTutorialStage] = useState<'offer' | 'tutorial' | null>(null);
  const [tutorialStepIndex, setTutorialStepIndex] = useState(0);
  const [isTutorialLoading, setIsTutorialLoading] = useState(false);
  const [tutorialError, setTutorialError] = useState<string | null>(null);
  const [whatsNewModalEntry, setWhatsNewModalEntry] = useState<WhatsNewEntry | null>(null);
  const [isWhatsNewModalOpen, setIsWhatsNewModalOpen] = useState(false);
  const [pendingWhatsNewAfterInitialTutorial, setPendingWhatsNewAfterInitialTutorial] = useState<WhatsNewEntry | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const entryFlowResolvedRef = useRef(false);
  const forcedTutorialShownRef = useRef(false);
  const localTutorialBootstrapRef = useRef(false);
  const forcedWhatsNewShownRef = useRef(false);

  const notifications: Array<{ id: string; title: string; detail: string; time: string }> = [];
  const tutorialSteps: TutorialStep[] = [
    {
      id: 'nav-clients',
      section: 'clientes',
      title: 'Clientes',
      description: 'Cadastre e acompanhe seus clientes em um so lugar.',
      tip: 'Comece por aqui para manter sua base organizada.',
      targetElement: '[data-onboarding-target="nav-clientes"]',
      placement: 'top',
      compact: true,
      connector: 'none',
      highlightPadding: 6,
    },
    {
      id: 'nav-procedures',
      section: 'procedimentos',
      title: 'Procedimentos',
      description: 'Organize seus servicos com preco, duracao e categoria.',
      tip: 'Mantenha os servicos prontos para agilizar o atendimento.',
      targetElement: '[data-onboarding-target="nav-procedimentos"]',
      placement: 'top',
      compact: true,
      connector: 'none',
      highlightPadding: 6,
    },
    {
      id: 'nav-agenda',
      section: 'agenda',
      title: 'Agenda',
      description: 'Gerencie seus horarios, atendimentos e bloqueios de agenda.',
      tip: 'Acompanhe o dia e ajuste os horarios com rapidez.',
      targetElement: '[data-onboarding-target="nav-agenda"]',
      placement: 'top',
      compact: true,
      connector: 'none',
      highlightPadding: 6,
    },
    {
      id: 'nav-reports',
      section: 'relatorios',
      title: 'Relatorios',
      description: 'Acompanhe dados financeiros e de desempenho da clinica.',
      tip: 'Veja indicadores para tomar decisoes com mais clareza.',
      targetElement: '[data-onboarding-target="nav-relatorios"]',
      placement: 'top',
      compact: true,
      connector: 'none',
      highlightPadding: 6,
    },
  ];
  const currentTutorialTarget =
    tutorialStage === 'tutorial' ? tutorialSteps[tutorialStepIndex]?.section ?? null : null;
  const whatsNew = useWhatsNew({
    token: LOCAL_TUTORIAL_TEST_MODE ? null : token,
    forceAlwaysShow: FORCE_WHATS_NEW_ALWAYS,
  });

  const loadFinancialData = useCallback(async () => {
    if (!token) return;
    setIsLoadingFinancial(true);
    setFinancialError(null);
    try {
      setFinancialData(await fetchDashboardFinancial(token));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar dashboard financeiro.';
      setFinancialError(message);
      setNoticeModal({
        isOpen: true,
        type: 'error',
        title: 'Falha ao carregar dados',
        message,
        helperText: 'Verifique sua conexao e tente atualizar novamente.',
        confirmLabel: 'Fechar',
      });
    } finally {
      setIsLoadingFinancial(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeSection === 'dashboard' && !financialData && !isLoadingFinancial) void loadFinancialData();
  }, [activeSection, financialData, isLoadingFinancial, loadFinancialData]);

  useEffect(() => {
    if (activeSection !== 'relatorios') return;
    if (!financialData && !isLoadingFinancial) void loadFinancialData();
  }, [activeSection, financialData, isLoadingFinancial, loadFinancialData]);

  useEffect(() => {
    setIsMobileMoreOpen(false);
  }, [activeSection]);

  useEffect(() => {
    entryFlowResolvedRef.current = false;
    forcedTutorialShownRef.current = false;
    localTutorialBootstrapRef.current = false;
    forcedWhatsNewShownRef.current = false;
    setWhatsNewModalEntry(null);
    setIsWhatsNewModalOpen(false);
    setPendingWhatsNewAfterInitialTutorial(null);
  }, [token]);

  useEffect(() => {
    if (!FORCE_WHATS_NEW_ALWAYS) return;
    if (!token || !whatsNew.hasLoaded || whatsNew.isChecking) return;
    if (forcedWhatsNewShownRef.current) return;
    if (tutorialStage !== null) {
      setTutorialStage(null);
    }

    const entry = whatsNew.data?.whatsNew ?? {
      version: whatsNew.data?.currentVersion || '1.2.0',
      title: 'Atualizacao em teste',
      type: 'feature',
      requiresTutorial: false,
      items: [
        'Modo de teste ativo para novidades da versao',
        'Este conteudo aparece mesmo sem release pendente no backend',
        'Desative FORCE_WHATS_NEW_ALWAYS quando finalizar os testes',
      ],
    };

    forcedWhatsNewShownRef.current = true;
    setWhatsNewModalEntry(entry);
    setIsWhatsNewModalOpen(true);
  }, [token, tutorialStage, whatsNew.data, whatsNew.hasLoaded, whatsNew.isChecking]);

  useEffect(() => {
    if (!FORCE_TUTORIAL_ON_ENTRY) return;
    if (!token || (!onboardingResolved && !LOCAL_TUTORIAL_TEST_MODE)) return;
    if (forcedTutorialShownRef.current) return;
    forcedTutorialShownRef.current = true;
    setTutorialStepIndex(0);
    setTutorialStage('offer');
  }, [onboardingResolved, token]);

  useEffect(() => {
    if (LOCAL_TUTORIAL_TEST_MODE) {
      if (localTutorialBootstrapRef.current) return;
      localTutorialBootstrapRef.current = true;
      setOnboardingFlags(
        {
          isFirstLogin: true,
          shouldOfferTutorial: true,
          tutorialVersion: 'v1',
        },
        true,
      );
      return;
    }

    if (!token) return;
    if (onboardingResolved && onboarding) return;

    const resolveOnboarding = async () => {
      try {
        const status = await fetchOnboardingStatus(token);
        setOnboardingFlags(
          {
            isFirstLogin: status.isFirstLogin,
            shouldOfferTutorial: status.shouldOfferTutorial,
            tutorialVersion: status.tutorialVersion,
          },
          true,
        );
      } catch {
        setOnboardingFlags(null, true);
        setNoticeModal({
          isOpen: true,
          type: 'alert',
          title: 'Onboarding indisponivel',
          message: 'Nao foi possivel verificar seu status de onboarding neste momento.',
          helperText: 'Voce pode usar o sistema normalmente e tentar novamente em um novo login.',
          confirmLabel: 'Ok',
        });
      }
    };

    void resolveOnboarding();
  }, [onboarding, onboardingResolved, setOnboardingFlags, token]);

  useEffect(() => {
    if (FORCE_TUTORIAL_ON_ENTRY) return;
    if (FORCE_WHATS_NEW_ALWAYS) return;
    if (!token || !onboardingResolved || !whatsNew.hasLoaded || whatsNew.isChecking) return;
    if (entryFlowResolvedRef.current) return;

    const loginData: OnboardingLoginFlags = onboarding ?? {
      isFirstLogin: false,
      shouldOfferTutorial: false,
      tutorialVersion: 'v1',
    };
    const whatsNewData = whatsNew.data ?? {
      currentVersion: '',
      hasNewVersion: false,
      shouldOfferUpdateTutorial: false,
      whatsNew: null,
    };

    const decision = decideEntryFlow(loginData, whatsNewData);
    entryFlowResolvedRef.current = true;

    if (decision.flow === 'INITIAL_TUTORIAL') {
      setTutorialStage('offer');
      setTutorialStepIndex(0);
      if (decision.includeWhatsNew && whatsNewData.whatsNew) {
        setPendingWhatsNewAfterInitialTutorial(whatsNewData.whatsNew);
      }
      return;
    }

    if (decision.flow === 'WHATS_NEW_TUTORIAL' && whatsNewData.whatsNew) {
      setWhatsNewModalEntry(whatsNewData.whatsNew);
      setIsWhatsNewModalOpen(true);
      return;
    }

    if (decision.flow === 'WHATS_NEW_MODAL' && whatsNewData.whatsNew) {
      setWhatsNewModalEntry(whatsNewData.whatsNew);
      setIsWhatsNewModalOpen(true);
    }
  }, [onboarding, onboardingResolved, token, whatsNew.data, whatsNew.hasLoaded, whatsNew.isChecking]);

  useEffect(() => {
    if (tutorialStage !== null) return;
    if (!pendingWhatsNewAfterInitialTutorial) return;
    setWhatsNewModalEntry(pendingWhatsNewAfterInitialTutorial);
    setIsWhatsNewModalOpen(true);
    setPendingWhatsNewAfterInitialTutorial(null);
  }, [pendingWhatsNewAfterInitialTutorial, tutorialStage]);

  useEffect(() => {
    if (tutorialStage !== 'tutorial') return;
    const step = tutorialSteps[tutorialStepIndex];
    if (!step) return;
    setActiveSection(step.section);
  }, [tutorialStage, tutorialStepIndex]);

  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!notificationsRef.current) return;
      if (!notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNotificationsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isNotificationsOpen]);

  const refreshActiveSection = () => {
    if (activeSection === 'dashboard' || activeSection === 'relatorios') {
      void loadFinancialData();
      return;
    }

    if (activeSection === 'clientes') {
      setClientsRefreshTick((current) => current + 1);
      return;
    }

    if (activeSection === 'procedimentos') {
      setProceduresRefreshTick((current) => current + 1);
      return;
    }

  };

  const handleDeclineTutorial = async () => {
    if (LOCAL_TUTORIAL_TEST_MODE) {
      setTutorialError(null);
      setTutorialStage(null);
      return;
    }

    if (!token || !onboarding) return;

    setIsTutorialLoading(true);
    setTutorialError(null);

    try {
      const updated = await updateTutorialDecision(token, {
        accepted: false,
        tutorialVersion: onboarding.tutorialVersion,
      });

      setOnboardingFlags(
        {
          isFirstLogin: updated.isFirstLogin,
          shouldOfferTutorial: updated.shouldOfferTutorial,
          tutorialVersion: updated.tutorialVersion,
        },
        true,
      );
      setTutorialStage(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel registrar sua escolha.';
      setTutorialError(message);
    } finally {
      setIsTutorialLoading(false);
    }
  };

  const handleAcceptTutorial = async () => {
    if (LOCAL_TUTORIAL_TEST_MODE) {
      setTutorialError(null);
      setTutorialStepIndex(0);
      setTutorialStage('tutorial');
      return;
    }

    if (!token || !onboarding) return;

    setIsTutorialLoading(true);
    setTutorialError(null);

    try {
      const updated = await updateTutorialDecision(token, {
        accepted: true,
        tutorialVersion: onboarding.tutorialVersion,
      });

      setOnboardingFlags(
        {
          isFirstLogin: updated.isFirstLogin,
          shouldOfferTutorial: updated.shouldOfferTutorial,
          tutorialVersion: updated.tutorialVersion,
        },
        true,
      );
      setTutorialStepIndex(0);
      setTutorialStage('tutorial');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel iniciar o tutorial.';
      setTutorialError(message);
    } finally {
      setIsTutorialLoading(false);
    }
  };

  const handleCompleteTutorial = async () => {
    if (LOCAL_TUTORIAL_TEST_MODE) {
      setTutorialError(null);
      setTutorialStepIndex(0);
      setTutorialStage('offer');
      return;
    }

    if (!PERSIST_TUTORIAL_COMPLETION) {
      setTutorialStage(null);
      return;
    }

    if (!token || !onboarding) return;

    setIsTutorialLoading(true);
    setTutorialError(null);

    try {
      const updated = await markTutorialCompleted(token, {
        tutorialVersion: onboarding.tutorialVersion,
      });

      setOnboardingFlags(
        {
          isFirstLogin: updated.isFirstLogin,
          shouldOfferTutorial: updated.shouldOfferTutorial,
          tutorialVersion: updated.tutorialVersion,
        },
        true,
      );
      setTutorialStage(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel concluir o tutorial.';
      setTutorialError(message);
    } finally {
      setIsTutorialLoading(false);
    }
  };

  const handleNextTutorialStep = () => {
    setTutorialStepIndex((current) => Math.min(current + 1, tutorialSteps.length - 1));
  };

  const handleBackTutorialStep = () => {
    setTutorialStepIndex((current) => Math.max(current - 1, 0));
  };

  const handleSectionChange = (nextSection: MenuSection) => {
    if (nextSection === 'estoque') {
      const label = 'Estoque';
      setNoticeModal({
        isOpen: true,
        type: 'coming-soon',
        title: label,
        message: 'Este modulo esta em fase final de desenvolvimento e sera liberado em uma proxima versao da plataforma.',
        helperText: 'Assim que estiver disponivel, ele aparecera normalmente no menu com todos os recursos ativos.',
        confirmLabel: 'Entendi',
      });
      setIsMobileMoreOpen(false);
      return;
    }

    setActiveSection(nextSection);
  };

  const handleCloseWhatsNew = async () => {
    if (!whatsNewModalEntry?.version) {
      setIsWhatsNewModalOpen(false);
      return;
    }
    if (!FORCE_WHATS_NEW_ALWAYS) {
      await whatsNew.markSeen(whatsNewModalEntry.version);
    }
    setIsWhatsNewModalOpen(false);
    setWhatsNewModalEntry(null);
  };

  const getNavItem = useCallback(
    (id: MenuSection) => navItems.find((item) => item.id === id),
    [],
  );

  const mobilePrimaryNav = useMemo(
    () => ['clientes', 'procedimentos', 'agenda', 'relatorios'].map((id) => getNavItem(id as MenuSection)).filter(Boolean),
    [getNavItem],
  );

  const mobileSecondaryNav = useMemo(
    () => ['dashboard', 'config', 'estoque'].map((id) => getNavItem(id as MenuSection)).filter(Boolean),
    [getNavItem],
  );

  const mobileAgendaItem = getNavItem('agenda');
  const isMobileSecondaryActive = activeSection === 'dashboard' || activeSection === 'config' || activeSection === 'estoque';

  const renderActiveSection = () => {
    if (activeSection === 'dashboard') {
      return (
        <DashboardSection
          isLoading={isLoadingFinancial}
          error={financialError}
          financialData={financialData}
          onRetry={() => void loadFinancialData()}
        />
      );
    }

    if (activeSection === 'clientes') {
      return <ClientsSection refreshTick={clientsRefreshTick} />;
    }

    if (activeSection === 'procedimentos') {
      return <ProceduresSection refreshTick={proceduresRefreshTick} />;
    }

    if (activeSection === 'agenda') return <AgendaSection />;
    if (activeSection === 'relatorios') {
      return <ReportsSection />;
    }
    if (activeSection === 'config') return <ConfigSection />;

    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-violet-50 pb-28 md:pb-0 md:pl-64">
        <DashboardDesktopSidebar
          navItems={navItems}
          activeSection={activeSection}
          highlightedSection={currentTutorialTarget}
          onSelectSection={handleSectionChange}
          onLogout={logout}
        />

        <DashboardHeader
          notifications={notifications}
          isNotificationsOpen={isNotificationsOpen}
          notificationsRef={notificationsRef}
          onToggleNotifications={() => setIsNotificationsOpen((value) => !value)}
          onRefresh={refreshActiveSection}
        />

        <main className={`mx-auto max-w-7xl ${activeSection === 'agenda' ? 'px-2 pt-2 pb-24 sm:px-4 sm:pt-4 sm:pb-6' : 'p-6'}`}>
          {activeSection !== 'agenda' ? (
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <h2 className="text-2xl font-bold text-slate-800">Ola, {(user?.name ?? user?.email ?? 'usuario').split('@')[0]}</h2>
            </div>
          ) : null}
          {renderActiveSection()}
        </main>

        <DashboardMobileNavigation
          mobilePrimaryNav={mobilePrimaryNav}
          mobileSecondaryNav={mobileSecondaryNav}
          mobileAgendaItem={mobileAgendaItem}
          activeSection={activeSection}
          highlightedSection={currentTutorialTarget}
          isMobileMoreOpen={isMobileMoreOpen}
          isMobileSecondaryActive={isMobileSecondaryActive}
          onSelectSection={handleSectionChange}
          onToggleMore={() => setIsMobileMoreOpen((value) => !value)}
          onCloseMore={() => setIsMobileMoreOpen(false)}
        />
      </div>

      <FeatureComingSoonModal
        isOpen={noticeModal.isOpen}
        type={noticeModal.type}
        title={noticeModal.title}
        message={noticeModal.message}
        helperText={noticeModal.helperText}
        confirmLabel={noticeModal.confirmLabel}
        onClose={() => setNoticeModal((current) => ({ ...current, isOpen: false }))}
      />

      <TutorialFlowModal
        isOpen={tutorialStage !== null}
        stage={tutorialStage ?? 'offer'}
        steps={tutorialSteps}
        tutorialStepIndex={tutorialStepIndex}
        isLoading={isTutorialLoading}
        errorMessage={tutorialError}
        onAccept={() => void handleAcceptTutorial()}
        onDecline={() => void handleDeclineTutorial()}
        onNext={handleNextTutorialStep}
        onBack={handleBackTutorialStep}
        onComplete={() => void handleCompleteTutorial()}
      />

      <WhatsNewModal
        isOpen={isWhatsNewModalOpen && tutorialStage === null}
        entry={whatsNewModalEntry}
        isLoading={whatsNew.isMarkingSeen}
        onAcknowledge={() => void handleCloseWhatsNew()}
      />
    </>
  );
};
