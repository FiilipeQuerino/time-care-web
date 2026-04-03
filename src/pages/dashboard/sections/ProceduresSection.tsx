import { FormEvent, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Procedure } from '../../../types';
import { formatCurrency, getProcedureCategoryLabel } from '../helpers';
import { ProceduresSkeleton } from '../components/Skeletal';

interface ProcedurePayload {
  name: string;
  suggestedPrice: number;
  estimatedDurationInMinutes: number;
  category: number;
}

interface ProceduresSectionProps {
  procedures: Procedure[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  onRetry: () => void;
  onCreateProcedure: (payload: ProcedurePayload) => Promise<void>;
}

export const ProceduresSection = ({
  procedures,
  isLoading,
  error,
  isCreating,
  onRetry,
  onCreateProcedure,
}: ProceduresSectionProps) => {
  const [procedureName, setProcedureName] = useState('');
  const [procedurePrice, setProcedurePrice] = useState('');
  const [procedureDuration, setProcedureDuration] = useState('');
  const [procedureCategory, setProcedureCategory] = useState(1);
  const [procedureSearch, setProcedureSearch] = useState('');
  const [procedureCategoryFilter, setProcedureCategoryFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [isProcedureFormOpen, setIsProcedureFormOpen] = useState(false);

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

  const proceduresCountByCategory = {
    facial: procedures.filter((item) => item.category === 1).length,
    body: procedures.filter((item) => item.category === 2).length,
    aesthetic: procedures.filter((item) => item.category === 3).length,
  };

  const categoryQuickFilters: Array<{ value: 'all' | 1 | 2 | 3; label: string }> = [
    { value: 'all', label: 'Todas categorias' },
    { value: 1, label: 'Facial' },
    { value: 2, label: 'Body' },
    { value: 3, label: 'Aesthetic' },
  ];

  const handleCreateProcedure = async (event: FormEvent) => {
    event.preventDefault();
    const suggestedPrice = Number(procedurePrice);
    const estimatedDurationInMinutes = Number(procedureDuration);

    await onCreateProcedure({
      name: procedureName.trim(),
      suggestedPrice,
      estimatedDurationInMinutes,
      category: procedureCategory,
    });

    setProcedureName('');
    setProcedurePrice('');
    setProcedureDuration('');
    setProcedureCategory(1);
    setIsProcedureFormOpen(false);
  };

  if (isLoading) return <ProceduresSkeleton />;

  if (error) {
    return (
      <div className="bg-white rounded-[2rem] border border-rose-100 shadow-sm p-6">
        <p className="text-rose-600 font-medium mb-3">{error}</p>
        <Button size="sm" onClick={onRetry}>
          Recarregar procedimentos
        </Button>
      </div>
    );
  }

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
              <Button type="submit" className="h-12 w-full rounded-xl bg-pink-600 text-white hover:bg-pink-700 shadow-pink-200" isLoading={isCreating} disabled={isCreating}>
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
            onClick={() => {
              setProcedureSearch('');
              setProcedureCategoryFilter('all');
            }}
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
