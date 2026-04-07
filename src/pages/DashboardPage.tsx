import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Clock, LogOut, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
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
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-white via-rose-50/70 to-pink-50/70 backdrop-blur-lg border-r border-pink-100/80 text-slate-800 flex-col p-6 z-50 shadow-[10px_0_36px_rgba(244,114,182,0.08)]">
          <div className="flex items-center gap-3 mb-10 px-2"><div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white"><Clock size={24} strokeWidth={2.5} /></div><span className="text-xl font-black tracking-tight">TimeCare</span></div>
          <nav className="flex-1 flex flex-col gap-2.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                data-onboarding-target={`nav-${item.id}`}
                onClick={() => handleSectionChange(item.id)}
                className={`group relative flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                  item.id === activeSection
                    ? 'border-pink-200 bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-[0_12px_24px_rgba(236,72,153,0.35)]'
                    : 'border-transparent bg-white/60 text-slate-600 hover:border-pink-100 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                } ${currentTutorialTarget === item.id ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-white' : ''}`}
              >
                <span
                  className={`absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full transition-all ${
                    item.id === activeSection ? 'bg-white/90' : 'bg-transparent group-hover:bg-pink-200'
                  }`}
                />
                <item.icon size={20} />
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all mt-auto"><LogOut size={20} /><span className="font-semibold">Sair</span></button>
        </aside>

        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-pink-100 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-pink-200"><Clock size={18} strokeWidth={2.5} /></div>
            <span className="text-lg font-black text-slate-800 leading-tight">TimeCare</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={refreshActiveSection}
              className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              Atualizar
            </Button>
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen((value) => !value)}
                className={`relative h-10 w-10 rounded-xl border bg-white text-slate-600 transition-colors hover:bg-slate-50 flex items-center justify-center ${isNotificationsOpen ? 'border-pink-200 bg-pink-50 text-pink-700' : 'border-slate-200'}`}
                aria-label="Abrir notificacoes"
                aria-expanded={isNotificationsOpen}
              >
                <Bell size={19} />
                {notifications.length > 0 ? (
                  <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-pink-600 text-white text-[10px] font-bold leading-4 text-center">
                    {notifications.length}
                  </span>
                ) : null}
              </button>

              {isNotificationsOpen ? (
                <div className="absolute right-0 mt-2 w-[min(90vw,340px)] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">Notificacoes</p>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center">
                      <p className="text-sm font-semibold text-slate-700">Sem notificacoes</p>
                      <p className="mt-1 text-xs text-slate-500">Quando surgir algo importante, aparece aqui.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <article key={notification.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                          <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{notification.detail}</p>
                          <p className="mt-1 text-[11px] font-medium text-slate-400">{notification.time}</p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className={`mx-auto max-w-7xl ${activeSection === 'agenda' ? 'px-2 pt-2 pb-24 sm:px-4 sm:pt-4 sm:pb-6' : 'p-6'}`}>
          {activeSection !== 'agenda' ? (
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <h2 className="text-2xl font-bold text-slate-800">Ola, {(user?.name ?? user?.email ?? 'usuario').split('@')[0]}</h2>
            </div>
          ) : null}
          {renderActiveSection()}
        </main>

        {isMobileMoreOpen ? (
          <>
            <button
              type="button"
              aria-label="Fechar menu adicional"
              className="md:hidden fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[1px]"
              onClick={() => setIsMobileMoreOpen(false)}
            />
            <div className="md:hidden fixed bottom-24 left-4 right-4 z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Acesso rapido</p>
              <div className="grid grid-cols-3 gap-2">
                {mobileSecondaryNav.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    data-onboarding-target={`nav-${item.id}`}
                    onClick={() => handleSectionChange(item.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-semibold transition-colors ${
                      activeSection === item.id
                        ? 'border-pink-200 bg-pink-50 text-pink-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    } ${currentTutorialTarget === item.id ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-white' : ''}`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-pink-100 px-3 pt-2 pb-3 z-50 shadow-[0_-10px_30px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-5 items-end gap-1">
            {mobilePrimaryNav.slice(0, 2).map((item) => (
              <button
                key={item.id}
                data-onboarding-target={`nav-${item.id}`}
                onClick={() => handleSectionChange(item.id)}
                aria-label={item.label}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl border px-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                  item.id === activeSection
                    ? 'border-pink-200 bg-gradient-to-b from-pink-50 to-rose-50 text-pink-700'
                    : 'border-transparent text-slate-400'
                } ${currentTutorialTarget === item.id ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-white' : ''}`}
              >
                <item.icon size={19} strokeWidth={item.id === activeSection ? 2.5 : 2} />
              </button>
            ))}

            {mobileAgendaItem ? (
              <button
                type="button"
                data-onboarding-target="nav-agenda"
                onClick={() => handleSectionChange('agenda')}
                aria-label={mobileAgendaItem.label}
                className={`-mt-7 flex h-16 w-full flex-col items-center justify-center rounded-2xl border text-[10px] font-black uppercase tracking-wide shadow-lg transition-all ${
                  activeSection === 'agenda'
                    ? 'border-pink-300 bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-pink-200'
                    : 'border-pink-200 bg-white text-pink-600 shadow-pink-100'
                } ${currentTutorialTarget === 'agenda' ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-white' : ''}`}
              >
                <mobileAgendaItem.icon size={20} strokeWidth={2.5} />
              </button>
            ) : null}

            {mobilePrimaryNav.slice(3).map((item) => (
              <button
                key={item.id}
                data-onboarding-target={`nav-${item.id}`}
                onClick={() => handleSectionChange(item.id)}
                aria-label={item.label}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl border px-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                  item.id === activeSection
                    ? 'border-pink-200 bg-gradient-to-b from-pink-50 to-rose-50 text-pink-700'
                    : 'border-transparent text-slate-400'
                } ${currentTutorialTarget === item.id ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-white' : ''}`}
              >
                <item.icon size={19} strokeWidth={item.id === activeSection ? 2.5 : 2} />
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsMobileMoreOpen((value) => !value)}
              aria-label="Mais opcoes"
              className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                isMobileMoreOpen || isMobileSecondaryActive ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
              }`}
            >
              <MoreHorizontal size={19} />
            </button>
          </div>
        </nav>
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
