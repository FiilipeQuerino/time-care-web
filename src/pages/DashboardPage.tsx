import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, Clock, LogOut, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
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
import { navItems } from './dashboard/constants';
import { PlaceholderSection } from './dashboard/sections/PlaceholderSection';
import { DashboardSection } from './dashboard/sections/DashboardSection';
import { ClientsSection } from './dashboard/sections/ClientsSection';
import { ProceduresSection } from './dashboard/sections/ProceduresSection';
import { ReportsSection } from './dashboard/sections/ReportsSection';
import { ConfigSection } from './dashboard/sections/ConfigSection';
import { EditClientModal } from './dashboard/components/EditClientModal';

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

  const activeLabel = useMemo(
    () => navItems.find((item) => item.id === activeSection)?.label ?? 'Dashboard',
    [activeSection],
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
    if (activeSection !== 'relatorios') return;
    if (!financialData && !isLoadingFinancial) void loadFinancialData();
    if (clients.length === 0 && !isLoadingClients) void loadClients();
    if (procedures.length === 0 && !isLoadingProcedures) void loadProcedures();
  }, [
    activeSection,
    clients.length,
    financialData,
    isLoadingClients,
    isLoadingFinancial,
    isLoadingProcedures,
    loadClients,
    loadFinancialData,
    loadProcedures,
    procedures.length,
  ]);

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

  const handleSaveClient = async (event: FormEvent) => {
    event.preventDefault();
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

  const handleCreateProcedure = async (payload: {
    name: string;
    suggestedPrice: number;
    estimatedDurationInMinutes: number;
    category: number;
  }) => {
    if (!token) return;

    if (!payload.name || payload.suggestedPrice <= 0 || payload.estimatedDurationInMinutes <= 0) {
      showToast('Preencha nome, preco e duracao com valores validos.', 'info');
      return;
    }

    setIsCreatingProcedure(true);
    try {
      const created = await createProcedure(token, payload);
      setProcedures((current) => [created, ...current]);
      showToast('Procedimento cadastrado com sucesso.', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel cadastrar procedimento.';
      showToast(message, 'error');
    } finally {
      setIsCreatingProcedure(false);
    }
  };

  const refreshActiveSection = () => {
    if (activeSection === 'dashboard') {
      void loadFinancialData();
      return;
    }
    if (activeSection === 'clientes') {
      void loadClients();
      return;
    }
    if (activeSection === 'procedimentos') {
      void loadProcedures();
      return;
    }
    if (activeSection === 'relatorios') {
      void loadFinancialData();
      void loadClients();
      void loadProcedures();
    }
  };

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
      return (
        <ClientsSection
          clients={clients}
          clientsTotal={clientsTotal}
          isLoading={isLoadingClients}
          error={clientsError}
          statusLoadingId={statusLoadingId}
          onRetry={() => void loadClients()}
          onExportContacts={() => void handleExportContacts()}
          onEditClient={openEditClient}
          onToggleClientStatus={(client) => void handleToggleClientStatus(client)}
        />
      );
    }

    if (activeSection === 'procedimentos') {
      return (
        <ProceduresSection
          procedures={procedures}
          isLoading={isLoadingProcedures}
          error={proceduresError}
          isCreating={isCreatingProcedure}
          onRetry={() => void loadProcedures()}
          onCreateProcedure={handleCreateProcedure}
        />
      );
    }

    if (activeSection === 'agenda') return <PlaceholderSection title="Agenda" />;
    if (activeSection === 'estoque') return <PlaceholderSection title="Estoque" />;

    if (activeSection === 'relatorios') {
      return (
        <ReportsSection
          financialData={financialData}
          clients={clients}
          procedures={procedures}
          onRefresh={() => {
            void loadFinancialData();
            void loadClients();
            void loadProcedures();
          }}
        />
      );
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
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={refreshActiveSection}>Atualizar</Button>
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

      <EditClientModal
        isOpen={Boolean(editingClient)}
        name={editName}
        email={editEmail}
        phone={editPhone}
        gender={editGender}
        isSaving={isSavingClient}
        onClose={closeEditClient}
        onSubmit={handleSaveClient}
        onChangeName={setEditName}
        onChangeEmail={setEditEmail}
        onChangePhone={setEditPhone}
        onChangeGender={setEditGender}
      />
    </>
  );
};
