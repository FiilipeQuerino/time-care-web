import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Plus, UserCheck, UserX } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Client } from '../../../types';
import { clientStatusOptions } from '../constants';
import { ClientStatusFilter } from '../types';
import { ClientsSkeleton } from '../components/Skeletal';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { createClient, fetchClients, updateClient, updateClientStatus } from '../../../services/dashboardService';
import { EditClientModal } from '../components/EditClientModal';

interface ClientsSectionProps {
  refreshTick?: number;
}

export const ClientsSection = ({ refreshTick = 0 }: ClientsSectionProps) => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);

  const [clientSearch, setClientSearch] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState<ClientStatusFilter>('all');
  const [isClientStatusMenuOpen, setIsClientStatusMenuOpen] = useState(false);
  const clientStatusMenuRef = useRef<HTMLDivElement | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState(1);
  const [isSavingClient, setIsSavingClient] = useState(false);

  const loadClients = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchClients(token);
      setClients(response.items);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Erro ao carregar clientes.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshTick]);

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

  const selectedClientStatus =
    clientStatusOptions.find((option) => option.value === clientStatusFilter) ?? clientStatusOptions[0];

  const clearClientFilters = () => {
    setClientSearch('');
    setClientStatusFilter('all');
    setIsClientStatusMenuOpen(false);
  };

  const openClientForm = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setEditName(client.name);
      setEditEmail(client.email);
      setEditPhone(client.phone);
      setEditGender(client.gender ?? 1);
      setIsCreateModalOpen(false);
      return;
    }

    setEditingClient(null);
    setEditName('');
    setEditEmail('');
    setEditPhone('');
    setEditGender(1);
    setIsCreateModalOpen(true);
  };

  const closeClientForm = () => {
    setEditingClient(null);
    setIsCreateModalOpen(false);
    setIsSavingClient(false);
    setEditName('');
    setEditEmail('');
    setEditPhone('');
    setEditGender(1);
  };

  const handleSaveClient = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;

    setIsSavingClient(true);
    try {
      if (editingClient) {
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
      } else {
        const created = await createClient(token, {
          name: editName,
          email: editEmail,
          phone: editPhone,
          gender: editGender,
        });

        setClients((current) => [created, ...current]);
        showToast('Cliente cadastrado com sucesso.', 'success');
      }

      closeClientForm();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Nao foi possivel salvar o cliente.';
      showToast(message, 'error');
      setIsSavingClient(false);
    }
  };

  const handleToggleClientStatus = async (client: Client) => {
    if (!token) return;

    setStatusLoadingId(client.clientId);
    try {
      const nextStatus = !client.isActive;
      const updated = await updateClientStatus(token, client.clientId, nextStatus);
      setClients((current) =>
        current.map((item) => (item.clientId === client.clientId ? { ...item, ...updated } : item)),
      );
      showToast(`Cliente ${updated.isActive ? 'ativado' : 'inativado'} com sucesso.`, 'success');
    } catch (updateError) {
      const message = updateError instanceof Error ? updateError.message : 'Nao foi possivel alterar status do cliente.';
      showToast(message, 'error');
    } finally {
      setStatusLoadingId(null);
    }
  };

  if (isLoading) return <ClientsSkeleton />;

  if (error) {
    return (
      <div className="bg-white rounded-[2rem] border border-rose-100 shadow-sm p-6">
        <p className="text-rose-600 font-medium mb-3">{error}</p>
        <Button size="sm" onClick={() => void loadClients()}>
          Recarregar lista
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 md:space-y-5">
        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-800 sm:text-xl">Clientes</h3>
            <Button
              size="icon"
              icon={Plus}
              className="h-11 w-11 rounded-xl bg-pink-600 text-white shadow-pink-200 hover:bg-pink-700"
              onClick={() => openClientForm()}
            />
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">Filtros</p>

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
                      onClick={() => {
                        setClientStatusFilter(option.value);
                        setIsClientStatusMenuOpen(false);
                      }}
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
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredClients.map((client) => (
              <article
                key={client.clientId}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 cursor-pointer hover:border-pink-200 transition-colors"
                onClick={() => openClientForm(client)}
              >
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

                <div className="mt-4 flex justify-end">
                  <Button
                    size="sm"
                    icon={client.isActive ? UserX : UserCheck}
                    className={`w-full sm:w-auto ${client.isActive ? 'bg-amber-500 text-white shadow-amber-200 hover:bg-amber-600' : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      void handleToggleClientStatus(client);
                    }}
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

      <EditClientModal
        isOpen={isCreateModalOpen || Boolean(editingClient)}
        title={editingClient ? 'Editar cliente' : 'Cadastrar cliente'}
        submitLabel={editingClient ? 'Salvar alteracoes' : 'Salvar'}
        name={editName}
        email={editEmail}
        phone={editPhone}
        gender={editGender}
        isSaving={isSavingClient}
        onClose={closeClientForm}
        onSubmit={handleSaveClient}
        onChangeName={setEditName}
        onChangeEmail={setEditEmail}
        onChangePhone={setEditPhone}
        onChangeGender={setEditGender}
      />
    </>
  );
};
