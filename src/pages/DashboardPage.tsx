import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FeatureComingSoonModal, NoticeModalType } from '../components/FeatureComingSoonModal';
import { TutorialFlowModal } from '../components/TutorialFlowModal';
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
import { TutorialStep } from '../components/TutorialFlowModal';
import { DashboardDesktopSidebar } from '../features/dashboard/components/DashboardDesktopSidebar';
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader';
import { DashboardMobileNavigation } from '../features/dashboard/components/DashboardMobileNavigation';

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
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  const notifications: Array<{ id: string; title: string; detail: string; time: string }> = [];
  const tutorialSteps: TutorialStep[] = [
    {
      id: 'dashboard-overview',
      section: 'dashboard',
      title: 'Comece por aqui',
      description: 'Aqui voce acompanha rapidamente os indicadores principais.',
      tip: 'Receita e agendamentos ficam visiveis neste bloco inicial.',
      targetElement: '[data-onboarding-target="dashboard-overview"]',
      placement: 'bottom',
      compact: true,
      connector: 'none',
      highlightPadding: 6,
    },
    {
      id: 'nav-clients',
      section: 'clientes',
      title: 'Gestao de clientes',
      description: 'Cadastre, pesquise e mantenha os dados da sua base de clientes.',
      tip: 'Comece adicionando seus clientes mais recorrentes.',
      targetElement: '[data-onboarding-target="nav-clientes"]',
      placement: 'right',
    },
    {
      id: 'nav-procedures',
      section: 'procedimentos',
      title: 'Procedimentos',
      description: 'Organize os servicos com preco, duracao e categoria.',
      tip: 'Defina os procedimentos principais para acelerar os agendamentos.',
      targetElement: '[data-onboarding-target="nav-procedimentos"]',
      placement: 'right',
    },
    {
      id: 'nav-agenda',
      section: 'agenda',
      title: 'Agenda',
      description: 'Gerencie horarios e acompanhe os atendimentos do dia.',
      tip: 'Clique nos horarios livres para criar agendamentos rapidamente.',
      targetElement: '[data-onboarding-target="nav-agenda"]',
      placement: 'right',
    },
  ];
  const currentTutorialTarget =
    tutorialStage === 'tutorial' ? tutorialSteps[tutorialStepIndex]?.section ?? null : null;

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
    if (!onboardingResolved) return;
    if (tutorialStage !== null) return;

    if (onboarding?.shouldOfferTutorial) {
      setTutorialStage('offer');
      setTutorialStepIndex(0);
      return;
    }

    setTutorialStage(null);
  }, [onboarding, onboardingResolved, tutorialStage]);

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
    if (nextSection === 'estoque' || nextSection === 'config') {
      const label = nextSection === 'estoque' ? 'Estoque' : 'Configuracoes';
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
    </>
  );
};
