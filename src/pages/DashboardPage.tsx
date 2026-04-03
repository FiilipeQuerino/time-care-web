import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Calendar,
  Settings,
  BarChart3,
  Package,
  LayoutDashboard,
  LogOut,
  Bell,
  Plus,
  TrendingUp,
  Clock,
  RefreshCw,
  Smartphone,
  UserRoundPen,
  UserX,
  UserCheck,
  Scissors,
  Sparkles,
  ShieldCheck,
  LineChart,
  CalendarCheck2,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Client, DashboardFinancialData, MenuSection, Procedure } from '../types';
import {
  createProcedure,
  fetchClients,
  fetchDashboardFinancial,
  fetchProcedures,
  updateClient,
  updateClientStatus,
} from '../services/dashboardService';
import { exportClientsToContacts } from '../utils/contacts';

const navItems: Array<{ id: MenuSection; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'procedimentos', label: 'Procedimentos', icon: Scissors },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'estoque', label: 'Estoque', icon: Package },
  { id: 'relatorios', label: 'Relatorios', icon: BarChart3 },
  { id: 'config', label: 'Config', icon: Settings },
];

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

type ClientStatusFilter = 'all' | 'active' | 'inactive';

const clientStatusOptions: Array<{ value: ClientStatusFilter; label: string; helper: string }> = [
  { value: 'all', label: 'Todos os status', helper: 'Exibe todos os clientes' },
  { value: 'active', label: 'Somente ativos', helper: 'Clientes com cadastro ativo' },
  { value: 'inactive', label: 'Somente inativos', helper: 'Clientes com cadastro pausado' },
];

const formatCurrency = (value: number) => currencyFormatter.format(value ?? 0);

const getProcedureCategoryLabel = (category: number): string => {
  if (category === 1) return 'Facial';
  if (category === 2) return 'Body';
  if (category === 3) return 'Aesthetic';
  return `Categoria ${category}`;
};

const PlaceholderSection = ({ title }: { title: string }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500">Tela basica pronta para evoluir com as proximas integracoes.</p>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
          <div className="h-8 w-8 bg-slate-200 rounded-xl"></div>
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
          <div className="h-7 w-32 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-3">
      <div className="h-5 w-40 bg-slate-200 rounded"></div>
      <div className="h-4 w-56 bg-slate-200 rounded"></div>
      <div className="h-4 w-52 bg-slate-200 rounded"></div>
    </div>
  </div>
);

const ClientsSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 animate-pulse">
    <div className="h-6 w-36 bg-slate-200 rounded mb-4"></div>
    <div className="space-y-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="border border-slate-100 rounded-xl p-4 space-y-2">
          <div className="h-4 w-40 bg-slate-200 rounded"></div>
          <div className="h-3 w-56 bg-slate-200 rounded"></div>
          <div className="h-3 w-32 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const ProceduresSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-3">
      <div className="h-5 w-44 bg-slate-200 rounded"></div>
      <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
      <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="h-4 w-28 bg-slate-200 rounded"></div>
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardPage = () => {
  const { user, logout, token } = useAuth();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState<MenuSection>('dashboard');
  const [financialData, setFinancialData] = useState<DashboardFinancialData | null>(null);
  const [isLoadingFinancial, setIsLoadingFinancial] = useState(false);
  const [financialError, setFinancialError] = useState<string | null>(null);

  const [clients, setClients] = useState<Client[]>([]);
  const [clientsTotal, setClientsTotal] = useState<number | null>(null);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [clientsError, setClientsError] = useState<string | null>(null);

  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [isLoadingProcedures, setIsLoadingProcedures] = useState(false);
  const [proceduresError, setProceduresError] = useState<string | null>(null);
  const [isCreatingProcedure, setIsCreatingProcedure] = useState(false);

  const [procedureName, setProcedureName] = useState('');
  const [procedurePrice, setProcedurePrice] = useState('');
  const [procedureDuration, setProcedureDuration] = useState('');
  const [procedureCategory, setProcedureCategory] = useState(1);
  const [procedureSearch, setProcedureSearch] = useState('');
  const [procedureCategoryFilter, setProcedureCategoryFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [isProcedureFormOpen, setIsProcedureFormOpen] = useState(false);

  const [clientSearch, setClientSearch] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState<ClientStatusFilter>('all');
  const [isClientStatusMenuOpen, setIsClientStatusMenuOpen] = useState(false);
  const clientStatusMenuRef = useRef<HTMLDivElement | null>(null);

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState(1);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);

  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const activeLabel = useMemo(() => navItems.find((item) => item.id === activeSection)?.label ?? 'Dashboard', [activeSection]);

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

  const loadClients = useCallback(async () => {
    if (!token) return;
    setIsLoadingClients(true);
    setClientsError(null);
    try {
      const response = await fetchClients(token);
      setClients(response.items);
      setClientsTotal(response.meta?.totalItems ?? response.items.length);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar clientes.';
      setClientsError(message);
      showToast(message, 'error');
    } finally {
      setIsLoadingClients(false);
    }
  }, [showToast, token]);

  const loadProcedures = useCallback(async () => {
    if (!token) return;
    setIsLoadingProcedures(true);
    setProceduresError(null);
    try {
      setProcedures(await fetchProcedures(token));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar procedimentos.';
      setProceduresError(message);
      showToast(message, 'error');
    } finally {
      setIsLoadingProcedures(false);
    }
  }, [showToast, token]);

  useEffect(() => {
    if (activeSection === 'dashboard' && !financialData && !isLoadingFinancial) void loadFinancialData();
  }, [activeSection, financialData, isLoadingFinancial, loadFinancialData]);

  useEffect(() => {
    if (activeSection === 'clientes' && clients.length === 0 && !isLoadingClients) void loadClients();
  }, [activeSection, clients.length, isLoadingClients, loadClients]);

  useEffect(() => {
    if (activeSection === 'procedimentos' && procedures.length === 0 && !isLoadingProcedures) void loadProcedures();
  }, [activeSection, procedures.length, isLoadingProcedures, loadProcedures]);

  useEffect(() => {
    if (activeSection !== 'clientes') setIsClientStatusMenuOpen(false);
  }, [activeSection]);

  useEffect(() => {
    if (!isClientStatusMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!clientStatusMenuRef.current) return;
      if (!clientStatusMenuRef.current.contains(event.target as Node)) {
        setIsClientStatusMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsClientStatusMenuOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isClientStatusMenuOpen]);

  const filteredClients = useMemo(() => {
    const search = clientSearch.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesSearch =
        search.length === 0 ||
        client.name.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.phone.toLowerCase().includes(search);

      const matchesStatus =
        clientStatusFilter === 'all' ||
        (clientStatusFilter === 'active' && client.isActive) ||
        (clientStatusFilter === 'inactive' && !client.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [clientSearch, clientStatusFilter, clients]);

  const filteredProcedures = useMemo(() => {
    const search = procedureSearch.trim().toLowerCase();

    return procedures.filter((procedure) => {
      const categoryLabel = getProcedureCategoryLabel(procedure.category).toLowerCase();
      const matchesSearch =
        search.length === 0 ||
        procedure.name.toLowerCase().includes(search) ||
        String(procedure.category).includes(search) ||
        categoryLabel.includes(search);
      const matchesCategory = procedureCategoryFilter === 'all' || procedure.category === procedureCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [procedureCategoryFilter, procedureSearch, procedures]);

  const openEditClient = (client: Client) => {
    setEditingClient(client);
    setEditName(client.name);
    setEditEmail(client.email);
    setEditPhone(client.phone);
    setEditGender(client.gender ?? 1);
  };

  const closeEditClient = () => {
    setEditingClient(null);
    setEditName('');
    setEditEmail('');
    setEditPhone('');
    setEditGender(1);
    setIsSavingClient(false);
  };

  const handleSaveClient = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !editingClient) return;

    setIsSavingClient(true);
    try {
      const updated = await updateClient(token, editingClient.clientId, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        gender: editGender,
      });
      setClients((current) =>
        current.map((client) => (client.clientId === editingClient.clientId ? { ...client, ...updated } : client)),
      );
      showToast('Cliente atualizado com sucesso.', 'success');
      closeEditClient();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel atualizar o cliente.';
      showToast(message, 'error');
      setIsSavingClient(false);
    }
  };

  const handleToggleClientStatus = async (client: Client) => {
    if (!token) return;

    setStatusLoadingId(client.clientId);
    try {
      const updated = await updateClientStatus(token, client.clientId, !client.isActive);
      setClients((current) =>
        current.map((item) => (item.clientId === client.clientId ? { ...item, ...updated } : item)),
      );
      showToast(`Cliente ${updated.isActive ? 'ativado' : 'inativado'} com sucesso.`, 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel atualizar status do cliente.';
      showToast(message, 'error');
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleExportContacts = async () => {
    if (clients.length === 0) {
      showToast('Nao ha clientes para exportar.', 'info');
      return;
    }

    try {
      await exportClientsToContacts(clients);
      showToast('Lista exportada para importar na agenda do celular.', 'success');
    } catch {
      showToast('Falha ao exportar contatos.', 'error');
    }
  };

  const handleCreateProcedure = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const suggestedPrice = Number(procedurePrice);
    const estimatedDurationInMinutes = Number(procedureDuration);

    if (!procedureName.trim() || suggestedPrice <= 0 || estimatedDurationInMinutes <= 0) {
      showToast('Preencha nome, preco e duracao com valores validos.', 'info');
      return;
    }

    setIsCreatingProcedure(true);
    try {
      const created = await createProcedure(token, {
        name: procedureName.trim(),
        suggestedPrice,
        estimatedDurationInMinutes,
        category: procedureCategory,
      });
      setProcedures((current) => [created, ...current]);
      showToast('Procedimento cadastrado com sucesso.', 'success');
      setProcedureName('');
      setProcedurePrice('');
      setProcedureDuration('');
      setProcedureCategory(1);
      setIsProcedureFormOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel cadastrar procedimento.';
      showToast(message, 'error');
    } finally {
      setIsCreatingProcedure(false);
    }
  };

  const renderDashboardSection = () => {
    if (isLoadingFinancial) return <DashboardSkeleton />;

    if (financialError) {
      return (
        <div className="bg-white rounded-[2rem] border border-rose-100 shadow-sm p-6">
          <p className="text-rose-600 font-medium mb-3">{financialError}</p>
          <Button size="sm" onClick={() => void loadFinancialData()}>
            Tentar novamente
          </Button>
        </div>
      );
    }

    const summary = financialData ?? {
      totalRevenue: 0,
      totalAppointments: 0,
      todayRevenue: 0,
      todayAppointments: 0,
      monthRevenue: 0,
      monthAppointments: 0,
      revenueByDay: [],
      topProcedures: [],
    };

    const revenueByDay = summary.revenueByDay.length
      ? summary.revenueByDay
      : [
          { date: 'Seg', value: 0 },
          { date: 'Ter', value: 0 },
          { date: 'Qua', value: 0 },
          { date: 'Qui', value: 0 },
          { date: 'Sex', value: 0 },
        ];

    const topProcedures = summary.topProcedures.length
      ? summary.topProcedures
      : [
          { procedureName: 'Limpeza de pele', total: 0 },
          { procedureName: 'Drenagem linfatica', total: 0 },
          { procedureName: 'Peeling quimico', total: 0 },
        ];

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Receita Total" value={formatCurrency(summary.totalRevenue)} icon={TrendingUp} color="bg-emerald-500" />
          <StatCard title="Agendamentos Total" value={summary.totalAppointments} icon={Calendar} color="bg-rose-500" />
          <StatCard title="Receita Hoje" value={formatCurrency(summary.todayRevenue)} icon={TrendingUp} />
          <StatCard title="Agendamentos Hoje" value={summary.todayAppointments} icon={Users} color="bg-amber-500" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Receita por dia</h3>
            <div className="space-y-3">
              {revenueByDay.map((item, index) => {
                const width = summary.monthRevenue > 0 ? Math.max(8, (item.value / summary.monthRevenue) * 100) : 8;
                return (
                  <div key={`${item.date}-${index}`}>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{item.date}</span>
                      <span>{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" style={{ width: `${width}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Top procedimentos</h3>
            <div className="space-y-3">
              {topProcedures.map((procedure, index) => (
                <div key={`${procedure.procedureName}-${index}`} className="flex items-center justify-between border border-slate-100 rounded-xl px-3 py-2">
                  <span className="text-sm font-medium text-slate-700">{procedure.procedureName}</span>
                  <span className="text-sm font-bold text-slate-900">{procedure.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };
  const renderClientsSection = () => {
    if (isLoadingClients) return <ClientsSkeleton />;

    if (clientsError) {
      return (
        <div className="bg-white rounded-[2rem] border border-rose-100 shadow-sm p-6">
          <p className="text-rose-600 font-medium mb-3">{clientsError}</p>
          <Button size="sm" onClick={() => void loadClients()}>Recarregar lista</Button>
        </div>
      );
    }

    const selectedClientStatus = clientStatusOptions.find((option) => option.value === clientStatusFilter) ?? clientStatusOptions[0];
    const activeClients = clients.filter((client) => client.isActive).length;
    const inactiveClients = Math.max(0, clients.length - activeClients);

    const applyClientStatusFilter = (value: ClientStatusFilter) => {
      setClientStatusFilter(value);
      setIsClientStatusMenuOpen(false);
    };

    const clearClientFilters = () => {
      setClientSearch('');
      setClientStatusFilter('all');
      setIsClientStatusMenuOpen(false);
    };

    return (
      <div className="space-y-4 md:space-y-5">
        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 sm:text-xl">Clientes</h3>
                <p className="text-sm text-slate-500 mt-1">Gerencie cadastro, status e contato em um fluxo simples.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">Total {clientsTotal ?? clients.length}</span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">Ativos {activeClients}</span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700">Inativos {inactiveClients}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Exportacao para celular</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">Gere o arquivo .vcf para importar os contatos na agenda do telefone em poucos toques.</p>
                </div>
                <Button
                  size="sm"
                  icon={Smartphone}
                  className="w-full sm:w-auto bg-pink-600 text-white hover:bg-pink-700 shadow-pink-200"
                  onClick={() => void handleExportContacts()}
                >
                  Exportar contatos (.vcf)
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-700">Filtros</p>
            <p className="text-xs text-slate-500 mt-1">Use busca e status para localizar clientes mais rapido.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_220px_180px] lg:items-end">
            <Input
              label="Buscar cliente"
              placeholder="Nome, e-mail ou telefone"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm focus:border-pink-500 focus:bg-white"
            />

            <div className="relative flex flex-col gap-1.5" ref={clientStatusMenuRef}>
              <label className="text-sm font-semibold text-slate-700 ml-1">Status</label>
              <button
                type="button"
                className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-left transition-colors hover:bg-white focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
                onClick={() => setIsClientStatusMenuOpen((value) => !value)}
                aria-haspopup="listbox"
                aria-expanded={isClientStatusMenuOpen}
              >
                <span className="text-sm font-medium text-slate-700">{selectedClientStatus.label}</span>
                <ChevronDown size={18} className={`text-slate-500 transition-transform ${isClientStatusMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isClientStatusMenuOpen ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.45rem)] z-40 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/70" role="listbox">
                  {clientStatusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={option.value === clientStatusFilter}
                      className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${option.value === clientStatusFilter ? 'bg-pink-50 text-pink-700' : 'text-slate-700 hover:bg-slate-50'}`}
                      onClick={() => applyClientStatusFilter(option.value)}
                    >
                      <p className="text-sm font-semibold">{option.label}</p>
                      <p className="text-xs text-slate-500">{option.helper}</p>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <Button
              size="md"
              variant="outline"
              className="h-12 w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
              onClick={clearClientFilters}
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white px-4 py-8 text-center shadow-sm sm:px-6">
            <p className="font-semibold text-slate-700">Nenhum cliente encontrado</p>
            <p className="mt-1 text-sm text-slate-500">Tente ajustar os filtros para visualizar outros resultados.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredClients.map((client) => (
              <article key={client.clientId} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-slate-800">{client.name}</p>
                    <p className="mt-1 truncate text-sm text-slate-500">{client.email}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{client.phone}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${client.isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                    {client.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={UserRoundPen}
                    className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 sm:w-auto"
                    onClick={() => openEditClient(client)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    icon={client.isActive ? UserX : UserCheck}
                    className={`w-full sm:w-auto ${client.isActive ? 'bg-amber-500 text-white shadow-amber-200 hover:bg-amber-600' : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'}`}
                    onClick={() => void handleToggleClientStatus(client)}
                    isLoading={statusLoadingId === client.clientId}
                    disabled={statusLoadingId === client.clientId}
                  >
                    {client.isActive ? 'Inativar' : 'Ativar'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderProceduresSection = () => {
    if (isLoadingProcedures) return <ProceduresSkeleton />;

    if (proceduresError) {
      return (
        <div className="bg-white rounded-[2rem] border border-rose-100 shadow-sm p-6">
          <p className="text-rose-600 font-medium mb-3">{proceduresError}</p>
          <Button size="sm" onClick={() => void loadProcedures()}>Recarregar procedimentos</Button>
        </div>
      );
    }

    const categoryQuickFilters: Array<{ value: 'all' | 1 | 2 | 3; label: string }> = [
      { value: 'all', label: 'Todas categorias' },
      { value: 1, label: 'Facial' },
      { value: 2, label: 'Body' },
      { value: 3, label: 'Aesthetic' },
    ];

    const proceduresCountByCategory = {
      facial: procedures.filter((item) => item.category === 1).length,
      body: procedures.filter((item) => item.category === 2).length,
      aesthetic: procedures.filter((item) => item.category === 3).length,
    };

    return (
      <div className="space-y-4 md:space-y-5">
        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 sm:text-xl">Procedimentos</h3>
                <p className="mt-1 text-sm text-slate-500">Organize servicos com preco e duracao padronizados.</p>
              </div>
              <Button
                size="sm"
                icon={Plus}
                className="w-full bg-pink-600 text-white hover:bg-pink-700 shadow-pink-200 sm:w-auto"
                onClick={() => setIsProcedureFormOpen((value) => !value)}
              >
                {isProcedureFormOpen ? 'Fechar cadastro' : 'Novo procedimento'}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold sm:grid-cols-4">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-center text-slate-600">Total {procedures.length}</span>
              <span className="rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-center text-pink-700">Facial {proceduresCountByCategory.facial}</span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-center text-sky-700">Body {proceduresCountByCategory.body}</span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-center text-violet-700">Aesthetic {proceduresCountByCategory.aesthetic}</span>
            </div>
          </div>
        </div>

        {isProcedureFormOpen ? (
          <div className="rounded-[1.5rem] border border-pink-100 bg-white p-4 shadow-sm sm:p-5">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Cadastro de procedimento</h4>
            <form className="space-y-3" onSubmit={handleCreateProcedure}>
              <Input
                label="Nome"
                placeholder="Ex: Brow Lamination"
                value={procedureName}
                onChange={(e) => setProcedureName(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm focus:border-pink-500 focus:bg-white"
                required
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Preco sugerido"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0,00"
                  value={procedurePrice}
                  onChange={(e) => setProcedurePrice(e.target.value)}
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm focus:border-pink-500 focus:bg-white"
                  required
                />
                <Input
                  label="Duracao (min)"
                  type="number"
                  min="1"
                  placeholder="60"
                  value={procedureDuration}
                  onChange={(e) => setProcedureDuration(e.target.value)}
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm focus:border-pink-500 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Categoria</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setProcedureCategory(category)}
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                        procedureCategory === category
                          ? 'border-pink-200 bg-pink-50 text-pink-700'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {getProcedureCategoryLabel(category)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <Button type="submit" className="h-12 w-full rounded-xl bg-pink-600 text-white hover:bg-pink-700 shadow-pink-200" isLoading={isCreatingProcedure} disabled={isCreatingProcedure}>
                  Cadastrar procedimento
                </Button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-700">Busca e filtros</p>
            <p className="mt-1 text-xs text-slate-500">Filtre por nome ou categoria para localizar rapidamente.</p>
          </div>

          <div className="space-y-3">
            <Input
              label="Buscar procedimento"
              placeholder="Nome ou categoria"
              value={procedureSearch}
              onChange={(e) => setProcedureSearch(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm focus:border-pink-500 focus:bg-white"
            />

            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categoryQuickFilters.map((item) => (
                <button
                  key={String(item.value)}
                  type="button"
                  onClick={() => setProcedureCategoryFilter(item.value)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    procedureCategoryFilter === item.value
                      ? 'border-pink-200 bg-pink-50 text-pink-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <Button
              size="md"
              variant="outline"
              className="h-11 w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 sm:w-auto"
              onClick={() => { setProcedureSearch(''); setProcedureCategoryFilter('all'); }}
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        {filteredProcedures.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white px-4 py-8 text-center shadow-sm sm:px-6">
            <p className="font-semibold text-slate-700">Nenhum procedimento encontrado</p>
            <p className="mt-1 text-sm text-slate-500">Ajuste os filtros ou cadastre um novo procedimento.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredProcedures.map((procedure) => (
              <article key={procedure.procedureId} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-slate-800">{procedure.name}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">ID #{procedure.procedureId}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-700">
                    {getProcedureCategoryLabel(procedure.category)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Preco</p>
                    <p className="mt-1 text-base font-bold text-slate-900">{formatCurrency(procedure.suggestedPrice)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Duracao</p>
                    <p className="mt-1 text-base font-bold text-slate-900">{procedure.estimatedDurationInMinutes} min</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderReportsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-[2rem] p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2"><Sparkles size={18} /><p className="font-semibold">Central de relatorios</p></div>
        <h3 className="text-2xl font-black mb-2">Visao estrategica da clinica</h3>
        <p className="text-slate-200">Painel pronto no front para conectar os proximos endpoints de analise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4"><p className="text-sm text-slate-500">Ticket medio</p><p className="text-2xl font-black text-slate-800">R$ 0,00</p></div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4"><p className="text-sm text-slate-500">Taxa de retorno</p><p className="text-2xl font-black text-slate-800">0%</p></div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4"><p className="text-sm text-slate-500">Cancelamentos</p><p className="text-2xl font-black text-slate-800">0</p></div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4"><p className="text-sm text-slate-500">Conversao de leads</p><p className="text-2xl font-black text-slate-800">0%</p></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3"><LineChart size={18} className="text-pink-600" /><h4 className="font-bold text-slate-800">Evolucao mensal</h4></div>
          <div className="h-52 rounded-xl bg-gradient-to-b from-pink-50 to-white border border-pink-100 flex items-end gap-2 p-4">
            {[25, 40, 35, 55, 48, 62, 58, 71, 66, 72, 79, 85].map((value, index) => (
              <div key={index} className="flex-1 rounded-t-lg bg-gradient-to-t from-pink-500 to-rose-400" style={{ height: `${value}%` }}></div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3"><CalendarCheck2 size={18} className="text-sky-600" /><h4 className="font-bold text-slate-800">Agenda x comparecimento</h4></div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Confirmados</span><span className="font-semibold text-slate-800">0</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Realizados</span><span className="font-semibold text-slate-800">0</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Faltas</span><span className="font-semibold text-slate-800">0</span></div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-[12%] bg-sky-500"></div></div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderConfigSection = () => (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-[2rem] p-6">
        <div className="flex items-center gap-2 mb-2"><ShieldCheck size={18} className="text-emerald-600" /><p className="font-semibold text-slate-700">Configuracoes gerais</p></div>
        <h3 className="text-2xl font-black text-slate-800 mb-2">Personalize o funcionamento da clinica</h3>
        <p className="text-slate-500">Tela pronta para acoplar endpoints de preferencias e seguranca.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <h4 className="font-bold text-slate-800 mb-4">Notificacoes</h4>
          <div className="space-y-3">
            <button onClick={() => setNotificationEnabled((value) => !value)} className="w-full flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 text-left hover:bg-slate-50">
              <span className="text-slate-700 font-medium">Lembretes automaticos</span>
              <span className={`text-xs px-2 py-1 rounded-full ${notificationEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{notificationEnabled ? 'Ativo' : 'Inativo'}</span>
            </button>
            <button onClick={() => setAutoBackupEnabled((value) => !value)} className="w-full flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 text-left hover:bg-slate-50">
              <span className="text-slate-700 font-medium">Backup automatico diario</span>
              <span className={`text-xs px-2 py-1 rounded-full ${autoBackupEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{autoBackupEnabled ? 'Ativo' : 'Inativo'}</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <h4 className="font-bold text-slate-800 mb-4">Seguranca</h4>
          <div className="space-y-3">
            <button onClick={() => setTwoFactorEnabled((value) => !value)} className="w-full flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 text-left hover:bg-slate-50">
              <span className="text-slate-700 font-medium">Autenticacao em dois fatores</span>
              <span className={`text-xs px-2 py-1 rounded-full ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{twoFactorEnabled ? 'Ativo' : 'Inativo'}</span>
            </button>
            <div className="border border-slate-100 rounded-xl px-4 py-3">
              <p className="text-sm text-slate-600 mb-1">Sessao atual</p>
              <p className="font-semibold text-slate-800">{user?.email ?? 'usuario@timecare.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    if (activeSection === 'dashboard') return renderDashboardSection();
    if (activeSection === 'clientes') return renderClientsSection();
    if (activeSection === 'procedimentos') return renderProceduresSection();
    if (activeSection === 'agenda') return <PlaceholderSection title="Agenda" />;
    if (activeSection === 'estoque') return <PlaceholderSection title="Estoque" />;
    if (activeSection === 'relatorios') return renderReportsSection();
    return renderConfigSection();
  };

  const shouldShowPrimaryAction = activeSection === 'dashboard';

  return (
    <>
      <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 md:pl-64">
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

        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white"><Clock size={18} strokeWidth={2.5} /></div><div><span className="text-lg font-black text-slate-800">TimeCare</span><p className="text-xs text-slate-500 font-medium">{activeLabel}</p></div></div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => { if (activeSection === 'dashboard') { void loadFinancialData(); return; } if (activeSection === 'clientes') { void loadClients(); return; } if (activeSection === 'procedimentos') void loadProcedures(); }}>Atualizar</Button>
            <button className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all relative"><Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span></button>
            <div className="w-10 h-10 rounded-xl bg-pink-100 border-2 border-white shadow-sm overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email ?? 'user'}`} alt="avatar" referrerPolicy="no-referrer" /></div>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div><h2 className="text-2xl font-bold text-slate-800">Ola, {(user?.name ?? user?.email ?? 'usuario').split('@')[0]}</h2><p className="text-slate-500 font-medium">Veja como esta sua clinica hoje.</p></div>
            {shouldShowPrimaryAction ? <Button icon={Plus} className="md:w-auto w-full">Novo Registro</Button> : null}
          </div>
          {renderActiveSection()}
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-3 py-3 flex gap-1 overflow-x-auto z-50">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} className={`min-w-[72px] flex flex-col items-center gap-1 transition-all py-1 px-2 rounded-lg ${item.id === activeSection ? 'text-pink-600 bg-pink-50' : 'text-slate-400'}`}>
              <item.icon size={20} strokeWidth={item.id === activeSection ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {editingClient ? (
        <div className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Editar cliente</h3>
            <form onSubmit={handleSaveClient} className="space-y-4">
              <Input label="Nome" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              <Input label="E-mail" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
              <Input label="Telefone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Genero</label>
                <select value={editGender} onChange={(e) => setEditGender(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-pink-500 focus:bg-white focus:outline-none transition-all duration-200 text-slate-800">
                  <option value={1}>Feminino</option>
                  <option value={2}>Masculino</option>
                  <option value={3}>Outro</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
                <Button type="button" variant="outline" onClick={closeEditClient} disabled={isSavingClient}>Cancelar</Button>
                <Button type="submit" isLoading={isSavingClient} disabled={isSavingClient}>Salvar alteracoes</Button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </>
  );
};











