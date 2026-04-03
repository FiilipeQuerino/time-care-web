import { FormEvent } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface EditClientModalProps {
  isOpen: boolean;
  title?: string;
  submitLabel?: string;
  name: string;
  email: string;
  phone: string;
  gender: number;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeGender: (value: number) => void;
}

export const EditClientModal = ({
  isOpen,
  title = 'Editar cliente',
  submitLabel = 'Salvar alteracoes',
  name,
  email,
  phone,
  gender,
  isSaving,
  onClose,
  onSubmit,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  onChangeGender,
}: EditClientModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-xl p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Nome" value={name} onChange={(e) => onChangeName(e.target.value)} required />
          <Input label="E-mail" type="email" value={email} onChange={(e) => onChangeEmail(e.target.value)} required />
          <Input label="Telefone" value={phone} onChange={(e) => onChangePhone(e.target.value)} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Genero</label>
            <select value={gender} onChange={(e) => onChangeGender(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-pink-500 focus:bg-white focus:outline-none transition-all duration-200 text-slate-800">
              <option value={1}>Feminino</option>
              <option value={2}>Masculino</option>
              <option value={3}>Outro</option>
            </select>
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
