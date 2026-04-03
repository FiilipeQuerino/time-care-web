import { FormEvent } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { getProcedureCategoryLabel } from '../helpers';

interface EditProcedureModalProps {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  name: string;
  price: string;
  duration: string;
  category: number;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  onChangeName: (value: string) => void;
  onChangePrice: (value: string) => void;
  onChangeDuration: (value: string) => void;
  onChangeCategory: (value: number) => void;
}

export const EditProcedureModal = ({
  isOpen,
  title,
  submitLabel,
  name,
  price,
  duration,
  category,
  isSaving,
  onClose,
  onSubmit,
  onChangeName,
  onChangePrice,
  onChangeDuration,
  onChangeCategory,
}: EditProcedureModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-xl p-6"
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Nome" value={name} onChange={(e) => onChangeName(e.target.value)} required />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Preco sugerido"
              type="number"
              min="1"
              step="0.01"
              value={price}
              onChange={(e) => onChangePrice(e.target.value)}
              required
            />
            <Input
              label="Duracao (min)"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => onChangeDuration(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Categoria</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onChangeCategory(item)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                    category === item
                      ? 'border-pink-200 bg-pink-50 text-pink-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {getProcedureCategoryLabel(item)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSaving} disabled={isSaving}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
