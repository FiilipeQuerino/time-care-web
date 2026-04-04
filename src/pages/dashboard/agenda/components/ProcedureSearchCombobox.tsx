import { useEffect, useMemo, useRef, useState } from 'react';
import { Procedure } from '../../../../types/procedure';
import { Input } from '../../../../components/ui/Input';
import { formatCurrency } from '../../helpers';

interface ProcedureSearchComboboxProps {
  procedures: Procedure[];
  selectedProcedureId: number | null;
  onSelect: (procedure: Procedure) => void;
}

export const ProcedureSearchCombobox = ({
  procedures,
  selectedProcedureId,
  onSelect,
}: ProcedureSearchComboboxProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedProcedure = procedures.find((item) => item.procedureId === selectedProcedureId) ?? null;

  const [query, setQuery] = useState(selectedProcedure?.name ?? '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setQuery(selectedProcedure?.name ?? '');
  }, [selectedProcedure?.name]);

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
    if (!search) return procedures.slice(0, 8);

    return procedures
      .filter((procedure) =>
        [procedure.name, String(procedure.estimatedDurationInMinutes), formatCurrency(procedure.suggestedPrice)]
          .join(' ')
          .toLowerCase()
          .includes(search),
      )
      .slice(0, 8);
  }, [procedures, query]);

  return (
    <div className="relative" ref={containerRef}>
      <Input
        label="Procedimento"
        placeholder="Buscar por nome, duracao ou valor"
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
            <p className="px-3 py-2 text-sm text-slate-500">Nenhum procedimento encontrado.</p>
          ) : (
            filtered.map((procedure) => (
              <button
                key={procedure.procedureId}
                type="button"
                onClick={() => {
                  onSelect(procedure);
                  setQuery(procedure.name);
                  setIsOpen(false);
                }}
                className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                  procedure.procedureId === selectedProcedureId
                    ? 'bg-pink-50 text-pink-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <p className="text-sm font-semibold">{procedure.name}</p>
                <p className="text-xs text-slate-500">
                  {procedure.estimatedDurationInMinutes} min - {formatCurrency(procedure.suggestedPrice)}
                </p>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
};
