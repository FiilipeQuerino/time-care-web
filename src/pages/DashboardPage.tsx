import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Clock, LogOut, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { DashboardFinancialData, MenuSection } from '../types';
import { fetchDashboardFinancial } from '../services/dashboardService';
import { navItems } from './dashboard/constants';
import { PlaceholderSection } from './dashboard/sections/PlaceholderSection';
import { DashboardSection } from './dashboard/sections/DashboardSection';
import { ClientsSection } from './dashboard/sections/ClientsSection';
import { ProceduresSection } from './dashboard/sections/ProceduresSection';
import { ConfigSection } from './dashboard/sections/ConfigSection';
import { ReportsSection } from './dashboard/sections/ReportsSection';

export const DashboardPage = () => {
  const { user, logout, token } = useAuth();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState<MenuSection>('dashboard');

  const [financialData, setFinancialData] = useState<DashboardFinancialData | null>(null);
  const [isLoadingFinancial, setIsLoadingFinancial] = useState(false);
  const [financialError, setFinancialError] = useState<string | null>(null);

  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [clientsRefreshTick, setClientsRefreshTick] = useState(0);
  const [proceduresRefreshTick, setProceduresRefreshTick] = useState(0);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  const notifications = useMemo(
    () => [
      { id: 'n1', title: '3 confirmacoes pendentes', detail: 'Agenda de hoje precisa de confirmacao.', time: 'Agora' },
      { id: 'n2', title: '2 faltas na semana', detail: 'Recomendado revisar lembretes automaticos.', time: '10 min' },
      { id: 'n3', title: 'Meta de faturamento em 82%', detail: 'Faltam R$ 3.200 para bater a meta mensal.', time: '1 h' },
    ],
    [],
  );

  const loadFinancialData = useCallback(async () => {
    if (!token) return;
    setIsLoadingFinancial(true);
    setFinancialError(null);
    try {
      setFinancialData(await fetchDashboardFinancial(token));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar dashboard financeiro.';
      setFinancialError(message);
      showToast(message, 'error');
    } finally {
      setIsLoadingFinancial(false);
    }
  }, [showToast, token]);

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
    }
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

    if (activeSection === 'agenda') return <PlaceholderSection title="Agenda" />;
    if (activeSection === 'estoque') return <PlaceholderSection title="Estoque" />;

    if (activeSection === 'relatorios') {
      return <ReportsSection onRefresh={() => void loadFinancialData()} />;
    }

    return (
      <ConfigSection
        notificationEnabled={notificationEnabled}
        autoBackupEnabled={autoBackupEnabled}
        twoFactorEnabled={twoFactorEnabled}
        userEmail={user?.email ?? 'usuario@timecare.com'}
        onToggleNotification={() => setNotificationEnabled((value) => !value)}
        onToggleAutoBackup={() => setAutoBackupEnabled((value) => !value)}
        onToggleTwoFactor={() => setTwoFactorEnabled((value) => !value)}
      />
    );
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 pb-28 md:pb-0 md:pl-64">
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white/85 backdrop-blur-lg border-r border-slate-100 text-slate-800 flex-col p-6 z-50">
          <div className="flex items-center gap-3 mb-10 px-2"><div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white"><Clock size={24} strokeWidth={2.5} /></div><span className="text-xl font-black tracking-tight">TimeCare</span></div>
          <nav className="flex-1 flex flex-col gap-2">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setActiveSection(item.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.id === activeSection ? 'bg-pink-600 text-white shadow-lg shadow-pink-200/70' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>
                <item.icon size={20} />
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all mt-auto"><LogOut size={20} /><span className="font-semibold">Sair</span></button>
        </aside>

        <header className="bg-white/85 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
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
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-pink-600 text-white text-[10px] font-bold leading-4 text-center">
                  {notifications.length}
                </span>
              </button>

              {isNotificationsOpen ? (
                <div className="absolute right-0 mt-2 w-[min(90vw,340px)] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">Notificacoes</p>
                    <button type="button" className="text-xs font-semibold text-pink-600 hover:text-pink-700">
                      Marcar como lidas
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <article key={notification.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{notification.detail}</p>
                        <p className="mt-1 text-[11px] font-medium text-slate-400">{notification.time}</p>
                      </article>
                    ))}
                  </div>
                  <button type="button" className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    Ver todas
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Ola, {(user?.name ?? user?.email ?? 'usuario').split('@')[0]}</h2>
          </div>
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
                    onClick={() => setActiveSection(item.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-semibold transition-colors ${
                      activeSection === item.id
                        ? 'border-pink-200 bg-pink-50 text-pink-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 px-3 pt-2 pb-3 z-50">
          <div className="grid grid-cols-5 items-end gap-1">
            {mobilePrimaryNav.slice(0, 2).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                  item.id === activeSection ? 'bg-pink-50 text-pink-600' : 'text-slate-400'
                }`}
              >
                <item.icon size={19} strokeWidth={item.id === activeSection ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            ))}

            {mobileAgendaItem ? (
              <button
                type="button"
                onClick={() => setActiveSection('agenda')}
                className={`-mt-7 flex h-16 w-full flex-col items-center justify-center rounded-2xl border text-[10px] font-black uppercase tracking-wide shadow-lg transition-all ${
                  activeSection === 'agenda'
                    ? 'border-pink-300 bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-pink-200'
                    : 'border-pink-200 bg-white text-pink-600 shadow-pink-100'
                }`}
              >
                <mobileAgendaItem.icon size={20} strokeWidth={2.5} />
                <span>{mobileAgendaItem.label}</span>
              </button>
            ) : null}

            {mobilePrimaryNav.slice(3).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                  item.id === activeSection ? 'bg-pink-50 text-pink-600' : 'text-slate-400'
                }`}
              >
                <item.icon size={19} strokeWidth={item.id === activeSection ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsMobileMoreOpen((value) => !value)}
              className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                isMobileMoreOpen || isMobileSecondaryActive ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
              }`}
            >
              <MoreHorizontal size={19} />
              <span>Mais</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};
