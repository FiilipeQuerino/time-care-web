import { RefObject } from 'react';
import { Bell, Clock, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
}

interface DashboardHeaderProps {
  notifications: NotificationItem[];
  isNotificationsOpen: boolean;
  notificationsRef: RefObject<HTMLDivElement | null>;
  onToggleNotifications: () => void;
  onRefresh: () => void;
}

export const DashboardHeader = ({
  notifications,
  isNotificationsOpen,
  notificationsRef,
  onToggleNotifications,
  onRefresh,
}: DashboardHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-pink-100 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-pink-200">
          <Clock size={18} strokeWidth={2.5} />
        </div>
        <span className="text-lg font-black text-slate-800 leading-tight">TimeCare</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={onRefresh}
          className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
          Atualizar
        </Button>
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={onToggleNotifications}
            className={`relative h-10 w-10 rounded-xl border bg-white text-slate-600 transition-colors hover:bg-slate-50 flex items-center justify-center ${isNotificationsOpen ? 'border-pink-200 bg-pink-50 text-pink-700' : 'border-slate-200'}`}
            aria-label="Abrir notificacoes"
            aria-expanded={isNotificationsOpen}
          >
            <Bell size={19} />
            {notifications.length > 0 ? (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-pink-600 text-white text-[10px] font-bold leading-4 text-center">
                {notifications.length}
              </span>
            ) : null}
          </button>

          {isNotificationsOpen ? (
            <div className="absolute right-0 mt-2 w-[min(90vw,340px)] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">Notificacoes</p>
              </div>
              {notifications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center">
                  <p className="text-sm font-semibold text-slate-700">Sem notificacoes</p>
                  <p className="mt-1 text-xs text-slate-500">Quando surgir algo importante, aparece aqui.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <article key={notification.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                      <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{notification.detail}</p>
                      <p className="mt-1 text-[11px] font-medium text-slate-400">{notification.time}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
