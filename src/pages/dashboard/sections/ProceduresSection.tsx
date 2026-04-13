import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Procedure } from '../../../types/procedure';
import { formatCurrency, getProcedureCategoryLabel } from '../helpers';
import { ProceduresSkeleton } from '../components/Skeletal';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { createProcedure, fetchProcedures, updateProcedure } from '../../../services/dashboardService';
import { EditProcedureModal } from '../components/EditProcedureModal';

interface ProceduresSectionProps {
  refreshTick?: number;
}

export const ProceduresSection = ({ refreshTick = 0 }: ProceduresSectionProps) => {
  const { token } = useAuth();
  const { showSuccessToast, showWarningToast, showErrorToast } = useToast();

  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [procedureSearch, setProcedureSearch] = useState('');
  const [procedureCategoryFilter, setProcedureCategoryFilter] = useState<'all' | 1 | 2 | 3>('all');

  const [isProcedureModalOpen, setIsProcedureModalOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [procedureName, setProcedureName] = useState('');
  const [procedurePrice, setProcedurePrice] = useState('');
  const [procedureDuration, setProcedureDuration] = useState('');
  const [procedureCategory, setProcedureCategory] = useState(1);

  const loadProcedures = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      setProcedures(await fetchProcedures(token));
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Erro ao carregar procedimentos.';
      setError(message);
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProcedures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshTick]);

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

  const categoryQuickFilters: Array<{ value: 'all' | 1 | 2 | 3; label: string }> = [
    { value: 'all', label: 'Todas categorias' },
    { value: 1, label: 'Facial' },
    { value: 2, label: 'Corporal' },
    { value: 3, label: 'Estetico' },
  ];

  const openProcedureModal = (procedure?: Procedure) => {
    if (procedure) {
      setEditingProcedure(procedure);
      setProcedureName(procedure.name);
      setProcedurePrice(String(procedure.suggestedPrice));
      setProcedureDuration(String(procedure.estimatedDurationInMinutes));
      setProcedureCategory(procedure.category);
      setIsProcedureModalOpen(true);
      return;
    }

    setEditingProcedure(null);
    setProcedureName('');
    setProcedurePrice('');
    setProcedureDuration('');
    setProcedureCategory(1);
    setIsProcedureModalOpen(true);
  };

  const closeProcedureModal = () => {
    setEditingProcedure(null);
    setIsProcedureModalOpen(false);
    setIsSaving(false);
    setProcedureName('');
    setProcedurePrice('');
    setProcedureDuration('');
    setProcedureCategory(1);
  };

  const handleSaveProcedure = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;

    const suggestedPrice = Number(procedurePrice);
    const estimatedDurationInMinutes = Number(procedureDuration);

    if (!procedureName.trim() || suggestedPrice <= 0 || estimatedDurationInMinutes <= 0) {
      showWarningToast('Preencha nome, preco e duracao com valores validos.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProcedure) {
        const updated = await updateProcedure(token, editingProcedure.procedureId, {
          name: procedureName.trim(),
          suggestedPrice,
          estimatedDurationInMinutes,
          category: procedureCategory,
        });

        setProcedures((current) =>
          current.map((procedure) =>
            procedure.procedureId === editingProcedure.procedureId ? { ...procedure, ...updated } : procedure,
          ),
        );
        showSuccessToast('Procedimento atualizado com sucesso.');
      } else {
        const created = await createProcedure(token, {
          name: procedureName.trim(),
          suggestedPrice,
          estimatedDurationInMinutes,
          category: procedureCategory,
        });

        setProcedures((current) => [created, ...current]);
        showSuccessToast('Procedimento cadastrado com sucesso.');
      }

      closeProcedureModal();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Nao foi possivel salvar procedimento.';
      showErrorToast(message);
      setIsSaving(false);
    }
  };

  if (isLoading) return <ProceduresSkeleton />;

  if (error) {
    return (
      <div className="bg-white rounded-[2rem] border border-rose-100 shadow-sm p-6">
        <p className="text-rose-600 font-medium mb-3">{error}</p>
        <Button size="sm" onClick={() => void loadProcedures()}>
          Recarregar procedimentos
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 md:space-y-5">
        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-800 sm:text-xl">Procedimentos</h3>
            <Button
              size="icon"
              icon={Plus}
              className="h-11 w-11 rounded-xl bg-pink-600 text-white shadow-pink-200 hover:bg-pink-700"
              onClick={() => openProcedureModal()}
            />
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">Busca e filtros</p>

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
          </div>
        </div>

        {filteredProcedures.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white px-4 py-8 text-center shadow-sm sm:px-6">
            <p className="font-semibold text-slate-700">Nenhum procedimento encontrado</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredProcedures.map((procedure) => (
              <article
                key={procedure.procedureId}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 cursor-pointer hover:border-pink-200 transition-colors"
                onClick={() => openProcedureModal(procedure)}
              >
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

      <EditProcedureModal
        isOpen={isProcedureModalOpen}
        title={editingProcedure ? 'Editar procedimento' : 'Novo procedimento'}
        submitLabel={editingProcedure ? 'Salvar alteracoes' : 'Salvar'}
        name={procedureName}
        price={procedurePrice}
        duration={procedureDuration}
        category={procedureCategory}
        isSaving={isSaving}
        onClose={closeProcedureModal}
        onSubmit={handleSaveProcedure}
        onChangeName={setProcedureName}
        onChangePrice={setProcedurePrice}
        onChangeDuration={setProcedureDuration}
        onChangeCategory={setProcedureCategory}
      />
    </>
  );
};
