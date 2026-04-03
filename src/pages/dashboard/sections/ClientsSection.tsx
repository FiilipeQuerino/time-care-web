import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Smartphone, UserCheck, UserRoundPen, UserX } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Client } from '../../../types';
import { clientStatusOptions } from '../constants';
import { ClientStatusFilter } from '../types';
import { ClientsSkeleton } from '../components/Skeletal';

interface ClientsSectionProps {
  clients: Client[];
  clientsTotal: number | null;
  isLoading: boolean;
  error: string | null;
  statusLoadingId: number | null;
  onRetry: () => void;
  onExportContacts: () => void;
  onEditClient: (client: Client) => void;
  onToggleClientStatus: (client: Client) => void;
}

export const ClientsSection = ({
  clients,
  clientsTotal,
  isLoading,
  error,
  statusLoadingId,
  onRetry,
  onExportContacts,
  onEditClient,
  onToggleClientStatus,
}: ClientsSectionProps) => {
  const [clientSearch, setClientSearch] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState<ClientStatusFilter>('all');
  const [isClientStatusMenuOpen, setIsClientStatusMenuOpen] = useState(false);
  const clientStatusMenuRef = useRef<HTMLDivElement | null>(null);

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

  if (isLoading) return <ClientsSkeleton />;

  if (error) {
    return (
      <div className="bg-white rounded-[2rem] border border-rose-100 shadow-sm p-6">
        <p className="text-rose-600 font-medium mb-3">{error}</p>
        <Button size="sm" onClick={onRetry}>
          Recarregar lista
        </Button>
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
                onClick={onExportContacts}
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
                  onClick={() => onEditClient(client)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  icon={client.isActive ? UserX : UserCheck}
                  className={`w-full sm:w-auto ${client.isActive ? 'bg-amber-500 text-white shadow-amber-200 hover:bg-amber-600' : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'}`}
                  onClick={() => onToggleClientStatus(client)}
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
