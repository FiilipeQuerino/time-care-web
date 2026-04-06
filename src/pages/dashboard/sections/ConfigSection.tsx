import { useEffect, useState } from 'react';
import { BellRing, LockKeyhole, Save, ShieldCheck, UserCog } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { fetchUserSettings, updateUserSettings } from '../../../services/profileService';
import { NotificationChannel, TwoFactorMethod, UserSettings } from '../../../types/profile';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const channelLabels: Record<NotificationChannel, string> = {
  1: 'E-mail',
  2: 'Push',
  3: 'WhatsApp',
};

const twoFactorLabels: Record<TwoFactorMethod, string> = {
  1: 'Nenhum',
  2: 'App autenticador',
  3: 'SMS',
  4: 'E-mail',
};

export const ConfigSection = () => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [allowEmailNotifications, setAllowEmailNotifications] = useState(false);
  const [allowPushNotifications, setAllowPushNotifications] = useState(true);
  const [allowWhatsAppNotifications, setAllowWhatsAppNotifications] = useState(false);
  const [criticalStockAlertsEnabled, setCriticalStockAlertsEnabled] = useState(true);
  const [preferredNotificationChannel, setPreferredNotificationChannel] = useState<NotificationChannel>(2);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<TwoFactorMethod>(1);
  const [language, setLanguage] = useState('pt-BR');
  const [timeZone, setTimeZone] = useState('America/Sao_Paulo');

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchUserSettings(token);
        setSettings(response);
        setEmail(response.email ?? '');
        setPhone(response.phone ?? '');
        setAllowEmailNotifications(response.allowEmailNotifications);
        setAllowPushNotifications(response.allowPushNotifications);
        setAllowWhatsAppNotifications(response.allowWhatsAppNotifications);
        setCriticalStockAlertsEnabled(response.criticalStockAlertsEnabled);
        setPreferredNotificationChannel(response.preferredNotificationChannel);
        setTwoFactorEnabled(response.twoFactorEnabled);
        setTwoFactorMethod(response.twoFactorMethod);
        setLanguage(response.language || 'pt-BR');
        setTimeZone(response.timeZone || 'America/Sao_Paulo');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar configuracoes.';
        showToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [showToast, token]);

  const handleSave = async () => {
    if (!token) return;

    const preferredEnabled =
      (preferredNotificationChannel === 1 && allowEmailNotifications) ||
      (preferredNotificationChannel === 2 && allowPushNotifications) ||
      (preferredNotificationChannel === 3 && allowWhatsAppNotifications);

    if (!preferredEnabled) {
      showToast('O canal preferencial precisa estar habilitado.', 'info');
      return;
    }

    if (twoFactorEnabled && twoFactorMethod === 1) {
      showToast('Selecione um metodo de dois fatores valido.', 'info');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateUserSettings(token, {
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        allowEmailNotifications,
        allowPushNotifications,
        allowWhatsAppNotifications,
        criticalStockAlertsEnabled,
        preferredNotificationChannel,
        twoFactorEnabled,
        twoFactorMethod: twoFactorEnabled ? twoFactorMethod : 1,
        language: language.trim() || 'pt-BR',
        timeZone: timeZone.trim() || 'America/Sao_Paulo',
      });

      setSettings(updated);
      showToast('Configuracoes salvas com sucesso.', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel salvar configuracoes.';
      showToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6">
        <p className="text-slate-500">Carregando configuracoes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-100 rounded-[1.5rem] p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={18} className="text-pink-600" />
          <p className="font-semibold text-slate-700">Configuracoes</p>
        </div>
        <h3 className="text-2xl font-black text-slate-800">Preferencias do usuario</h3>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label="E-mail" value={email} onChange={(event) => setEmail(String(event.target.value))} />
          <Input label="Telefone" value={phone} onChange={(event) => setPhone(String(event.target.value))} />
          <Input label="Idioma" value={language} onChange={(event) => setLanguage(String(event.target.value))} />
          <Input label="Time zone" value={timeZone} onChange={(event) => setTimeZone(String(event.target.value))} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setAllowEmailNotifications((value) => !value)}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-pink-50 p-2 text-pink-600"><BellRing size={18} /></span>
              <div>
                <p className="font-semibold text-slate-800">Notificacao por e-mail</p>
                <p className="text-xs text-slate-500">Ativar envio de alertas por e-mail</p>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${allowEmailNotifications ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {allowEmailNotifications ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setAllowPushNotifications((value) => !value)}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-sky-50 p-2 text-sky-600"><BellRing size={18} /></span>
              <div>
                <p className="font-semibold text-slate-800">Notificacao push</p>
                <p className="text-xs text-slate-500">Alertas no app</p>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${allowPushNotifications ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {allowPushNotifications ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setAllowWhatsAppNotifications((value) => !value)}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><BellRing size={18} /></span>
              <div>
                <p className="font-semibold text-slate-800">Notificacao WhatsApp</p>
                <p className="text-xs text-slate-500">Alertas por WhatsApp</p>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${allowWhatsAppNotifications ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {allowWhatsAppNotifications ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setCriticalStockAlertsEnabled((value) => !value)}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-amber-50 p-2 text-amber-600"><UserCog size={18} /></span>
              <div>
                <p className="font-semibold text-slate-800">Alerta de estoque critico</p>
                <p className="text-xs text-slate-500">Avisa quando produto ficar abaixo do minimo</p>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${criticalStockAlertsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {criticalStockAlertsEnabled ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Canal preferencial</label>
            <select
              value={preferredNotificationChannel}
              onChange={(event) => setPreferredNotificationChannel(Number(event.target.value) as NotificationChannel)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
            >
              <option value={1}>{channelLabels[1]}</option>
              <option value={2}>{channelLabels[2]}</option>
              <option value={3}>{channelLabels[3]}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setTwoFactorEnabled((value) => !value)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:bg-slate-50 transition-colors"
          >
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
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-sm font-semibold text-slate-700">Metodo 2FA</label>
          <select
            value={twoFactorMethod}
            onChange={(event) => setTwoFactorMethod(Number(event.target.value) as TwoFactorMethod)}
            disabled={!twoFactorEnabled}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none disabled:opacity-50"
          >
            <option value={1}>{twoFactorLabels[1]}</option>
            <option value={2}>{twoFactorLabels[2]}</option>
            <option value={3}>{twoFactorLabels[3]}</option>
            <option value={4}>{twoFactorLabels[4]}</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-500">
          Ultima atualizacao: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleString('pt-BR') : '-'}
        </p>
        <Button icon={Save} onClick={handleSave} isLoading={isSaving}>
          Salvar configuracoes
        </Button>
      </div>
    </div>
  );
};
