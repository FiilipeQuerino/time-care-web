import { BellRing, DatabaseBackup, LockKeyhole, ShieldCheck, UserCog } from 'lucide-react';

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
  <div className="space-y-5">
    <div className="bg-white border border-slate-100 rounded-[1.5rem] p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={18} className="text-pink-600" />
        <p className="font-semibold text-slate-700">Configuracoes</p>
      </div>
      <h3 className="text-2xl font-black text-slate-800">Ajustes da clinica</h3>
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button onClick={onToggleNotification} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:bg-slate-50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-pink-50 p-2 text-pink-600"><BellRing size={18} /></span>
            <div>
              <p className="font-semibold text-slate-800">Notificacoes</p>
              <p className="text-xs text-slate-500">Lembretes automaticos</p>
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${notificationEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {notificationEnabled ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </button>

      <button onClick={onToggleAutoBackup} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:bg-slate-50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-sky-50 p-2 text-sky-600"><DatabaseBackup size={18} /></span>
            <div>
              <p className="font-semibold text-slate-800">Backup automatico</p>
              <p className="text-xs text-slate-500">Copia diaria dos dados</p>
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${autoBackupEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {autoBackupEnabled ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </button>

      <button onClick={onToggleTwoFactor} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:bg-slate-50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-violet-50 p-2 text-violet-600"><LockKeyhole size={18} /></span>
            <div>
              <p className="font-semibold text-slate-800">Seguranca 2FA</p>
              <p className="text-xs text-slate-500">Autenticacao em dois fatores</p>
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {twoFactorEnabled ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </button>

      <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-amber-50 p-2 text-amber-600"><UserCog size={18} /></span>
          <div>
            <p className="font-semibold text-slate-800">Conta conectada</p>
            <p className="text-xs text-slate-500 break-all">{userEmail}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
