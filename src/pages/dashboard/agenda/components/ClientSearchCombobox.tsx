import { useEffect, useMemo, useRef, useState } from 'react';
import { Client } from '../../../../types/client';
import { Input } from '../../../../components/ui/Input';

interface ClientSearchComboboxProps {
  clients: Client[];
  selectedClientId: number | null;
  onSelect: (client: Client) => void;
}

export const ClientSearchCombobox = ({
  clients,
  selectedClientId,
  onSelect,
}: ClientSearchComboboxProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedClient = clients.find((item) => item.clientId === selectedClientId) ?? null;

  const [query, setQuery] = useState(selectedClient?.name ?? '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setQuery(selectedClient?.name ?? '');
  }, [selectedClient?.name]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isOpen]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return clients.slice(0, 8);

    return clients
      .filter((client) =>
        [client.name, client.email, client.phone].some((field) => field.toLowerCase().includes(search)),
      )
      .slice(0, 8);
  }, [clients, query]);

  return (
    <div className="relative" ref={containerRef}>
      <Input
        label="Cliente"
        placeholder="Buscar por nome, email ou telefone"
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        className="h-12 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm focus:border-pink-500 focus:bg-white"
      />

      {isOpen ? (
        <div className="mt-1.5 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-slate-500">Nenhum cliente encontrado.</p>
          ) : (
            filtered.map((client) => (
              <button
                key={client.clientId}
                type="button"
                onClick={() => {
                  onSelect(client);
                  setQuery(client.name);
                  setIsOpen(false);
                }}
                className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                  client.clientId === selectedClientId
                    ? 'bg-pink-50 text-pink-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <p className="text-sm font-semibold">{client.name}</p>
                <p className="text-xs text-slate-500">{client.email}</p>
                <p className="text-xs text-slate-500">{client.phone}</p>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
};
