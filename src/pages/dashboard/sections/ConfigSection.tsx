import { ShieldCheck } from 'lucide-react';

interface ConfigSectionProps {
  notificationEnabled: boolean;
  autoBackupEnabled: boolean;
  twoFactorEnabled: boolean;
  userEmail: string;
  onToggleNotification: () => void;
  onToggleAutoBackup: () => void;
  onToggleTwoFactor: () => void;
}

export const ConfigSection = ({
  notificationEnabled,
  autoBackupEnabled,
  twoFactorEnabled,
  userEmail,
  onToggleNotification,
  onToggleAutoBackup,
  onToggleTwoFactor,
}: ConfigSectionProps) => (
  <div className="space-y-6">
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck size={18} className="text-emerald-600" />
        <p className="font-semibold text-slate-700">Configuracoes gerais</p>
      </div>
      <h3 className="text-2xl font-black text-slate-800 mb-2">Personalize o funcionamento da clinica</h3>
      <p className="text-slate-500">Tela pronta para acoplar endpoints de preferencias e seguranca.</p>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="bg-white border border-slate-100 rounded-2xl p-5">
        <h4 className="font-bold text-slate-800 mb-4">Notificacoes</h4>
        <div className="space-y-3">
          <button onClick={onToggleNotification} className="w-full flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 text-left hover:bg-slate-50">
            <span className="text-slate-700 font-medium">Lembretes automaticos</span>
            <span className={`text-xs px-2 py-1 rounded-full ${notificationEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{notificationEnabled ? 'Ativo' : 'Inativo'}</span>
          </button>
          <button onClick={onToggleAutoBackup} className="w-full flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 text-left hover:bg-slate-50">
            <span className="text-slate-700 font-medium">Backup automatico diario</span>
            <span className={`text-xs px-2 py-1 rounded-full ${autoBackupEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{autoBackupEnabled ? 'Ativo' : 'Inativo'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5">
        <h4 className="font-bold text-slate-800 mb-4">Seguranca</h4>
        <div className="space-y-3">
          <button onClick={onToggleTwoFactor} className="w-full flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 text-left hover:bg-slate-50">
            <span className="text-slate-700 font-medium">Autenticacao em dois fatores</span>
            <span className={`text-xs px-2 py-1 rounded-full ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{twoFactorEnabled ? 'Ativo' : 'Inativo'}</span>
          </button>
          <div className="border border-slate-100 rounded-xl px-4 py-3">
            <p className="text-sm text-slate-600 mb-1">Sessao atual</p>
            <p className="font-semibold text-slate-800">{userEmail}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
