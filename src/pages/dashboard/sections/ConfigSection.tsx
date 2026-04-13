import { useEffect, useRef, useState } from 'react';
import { BellRing, ChevronDown, CircleHelp, Save, ShieldCheck, UserCog } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { fetchProfileSystemInfo, fetchUserSettings, updateUserSettings } from '../../../services/profileService';
import { AppointmentClosureMode, NotificationChannel, ProfileSystemInfo, UserSettings } from '../../../types/profile';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const appointmentClosureModeLabels: Record<AppointmentClosureMode, string> = {
  1: 'Automatico',
  2: 'Manual',
};

const getPreferredChannelFromFlags = (
  allowEmailNotifications: boolean,
  allowPushNotifications: boolean,
  allowWhatsAppNotifications: boolean,
): NotificationChannel | null => {
  if (allowPushNotifications) return 2;
  if (allowEmailNotifications) return 1;
  if (allowWhatsAppNotifications) return 3;
  return null;
};

export const ConfigSection = () => {
  const { token } = useAuth();
  const { showSuccessToast, showWarningToast, showErrorToast } = useToast();

  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [systemInfo, setSystemInfo] = useState<ProfileSystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [allowEmailNotifications, setAllowEmailNotifications] = useState(false);
  const [allowPushNotifications, setAllowPushNotifications] = useState(true);
  const [allowWhatsAppNotifications, setAllowWhatsAppNotifications] = useState(false);
  const [criticalStockAlertsEnabled, setCriticalStockAlertsEnabled] = useState(true);
  const [appointmentClosureMode, setAppointmentClosureMode] = useState<AppointmentClosureMode>(1);
  const [language, setLanguage] = useState('pt-BR');
  const [timeZone, setTimeZone] = useState('America/Sao_Paulo');
  const [isClosureMenuOpen, setIsClosureMenuOpen] = useState(false);
  const [isClosureHelpOpen, setIsClosureHelpOpen] = useState(false);
  const closureMenuRef = useRef<HTMLDivElement | null>(null);
  const closureHelpRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchUserSettings(token);
        const system = await fetchProfileSystemInfo(token);
        setSettings(response);
        setSystemInfo(system);
        setEmail(response.email ?? '');
        setPhone(response.phone ?? '');
        setAllowEmailNotifications(response.allowEmailNotifications);
        setAllowPushNotifications(response.allowPushNotifications);
        setAllowWhatsAppNotifications(response.allowWhatsAppNotifications);
        setCriticalStockAlertsEnabled(response.criticalStockAlertsEnabled);
        setAppointmentClosureMode(response.appointmentClosureMode);
        setLanguage(response.language || 'pt-BR');
        setTimeZone(response.timeZone || 'America/Sao_Paulo');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar configuracoes.';
        showErrorToast(message);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [showErrorToast, token]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (closureMenuRef.current && !closureMenuRef.current.contains(event.target as Node)) {
        setIsClosureMenuOpen(false);
      }
      if (closureHelpRef.current && !closureHelpRef.current.contains(event.target as Node)) {
        setIsClosureHelpOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleSave = async () => {
    if (!token) return;

    const preferredNotificationChannel = getPreferredChannelFromFlags(
      allowEmailNotifications,
      allowPushNotifications,
      allowWhatsAppNotifications,
    );

    if (!preferredNotificationChannel) {
      showWarningToast('Ative pelo menos um canal de notificacao.');
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
        appointmentClosureMode,
        preferredNotificationChannel,
        twoFactorEnabled: false,
        twoFactorMethod: 1,
        language,
        timeZone,
      });

      setSettings(updated);
      showSuccessToast('Configuracoes salvas com sucesso.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel salvar configuracoes.';
      showErrorToast(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6">
        <p className="text-slate-500">Carregando configuracoes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 sm:p-6">
        <div className="mb-1 flex items-center gap-2">
          <ShieldCheck size={18} className="text-pink-600" />
          <p className="font-semibold text-slate-700">Configuracoes</p>
        </div>
        <h3 className="text-2xl font-black text-slate-800">Preferencias do usuario</h3>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label="E-mail" value={email} disabled className="cursor-not-allowed opacity-70" />
          <Input label="Telefone" value={phone} onChange={(event) => setPhone(String(event.target.value))} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setAllowEmailNotifications((value) => !value)}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-slate-50"
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
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-slate-50"
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
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-slate-50"
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
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-slate-50"
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
        <div className="relative" ref={closureMenuRef}>
          <div className="mb-1 flex items-center gap-2">
            <label className="block text-sm font-semibold text-slate-700">Fechamento de agendamento</label>
            <div className="relative" ref={closureHelpRef}>
              <button
                type="button"
                onClick={() => setIsClosureHelpOpen((value) => !value)}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Ajuda sobre fechamento de agendamento"
              >
                <CircleHelp size={15} />
              </button>
              {isClosureHelpOpen ? (
                <div className="absolute left-1/2 top-[calc(100%+0.35rem)] z-50 w-[min(92vw,300px)] -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600 shadow-xl sm:left-0 sm:w-[290px] sm:translate-x-0">
                  Define se o atendimento e concluido automaticamente no horario ou apenas quando voce confirmar manualmente.
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsClosureMenuOpen((value) => !value)}
            className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 text-left text-sm text-slate-700 transition-colors hover:bg-white focus:border-pink-500 focus:bg-white focus:outline-none"
            aria-haspopup="listbox"
            aria-expanded={isClosureMenuOpen}
          >
            <span className="font-semibold">{appointmentClosureModeLabels[appointmentClosureMode]}</span>
            <ChevronDown size={17} className={`transition-transform ${isClosureMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isClosureMenuOpen ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-40 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setAppointmentClosureMode(1);
                  setIsClosureMenuOpen(false);
                }}
                className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${appointmentClosureMode === 1 ? 'bg-pink-50 text-pink-700' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <p className="text-sm font-semibold">Automatico</p>
                <p className="text-xs text-slate-500">Conclui automaticamente apos o horario.</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAppointmentClosureMode(2);
                  setIsClosureMenuOpen(false);
                }}
                className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${appointmentClosureMode === 2 ? 'bg-pink-50 text-pink-700' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <p className="text-sm font-semibold">Manual</p>
                <p className="text-xs text-slate-500">Exige encerramento manual do atendimento.</p>
              </button>
            </div>
          ) : null}
        </div>

      </div>

      <div className="flex justify-end">
        <Button icon={Save} onClick={handleSave} isLoading={isSaving} className="w-full sm:w-auto">
          SALVAR
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Data da ultima atualizacao</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">
              {systemInfo?.lastUpdatedAt
                ? new Date(`${systemInfo.lastUpdatedAt}T00:00:00`).toLocaleDateString('pt-BR')
                : settings?.updatedAt
                  ? new Date(settings.updatedAt).toLocaleDateString('pt-BR')
                  : '-'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Versao</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">
              {systemInfo?.currentVersion ? `v${systemInfo.currentVersion}` : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
