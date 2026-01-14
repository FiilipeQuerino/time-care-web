import React from 'react';
import { Calendar, AlertTriangle, Settings, LogOut } from 'lucide-react';
import { ViewType } from '../App';

interface Props {
  setView: (view: ViewType) => void;
  onLogout: () => void;
}

const NotificationsDropdown: React.FC<Props> = ({ setView, onLogout }) => {
  return (
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl border border-rose-100 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
      
      {/* Perfil */}
      <div className="flex items-center gap-4 p-4 border-b border-rose-50 bg-rose-50/40">
        <img
          src="https://picsum.photos/id/64/100/100"
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <div>
          <p className="text-sm font-bold text-slate-800">Dra. Ana Silva</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-pink-400">
            Time Care Premium
          </p>
        </div>
      </div>

      {/* Notificações */}
      <div className="max-h-64 overflow-y-auto">
        <NotificationItem
          icon={<Calendar size={16} />}
          title="Próximo atendimento"
          description="Juliana Paes às 14:00"
        />
        <NotificationItem
          icon={<AlertTriangle size={16} />}
          title="Conflito de agenda"
          description="Horários sobrepostos detectados"
          warning
        />
      </div>

      {/* Ações */}
      <div className="border-t border-rose-50">
        <button
          onClick={() => setView('configuracoes')}
          className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          <Settings size={16} /> Configurações
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-rose-500 hover:bg-rose-50"
        >
          <LogOut size={16} /> Sair
        </button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;

interface ItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  warning?: boolean;
}

const NotificationItem: React.FC<ItemProps> = ({
  icon,
  title,
  description,
  warning,
}) => {
  return (
    <div className="flex gap-3 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
      <div
        className={`p-2 rounded-xl ${
          warning
            ? 'bg-rose-100 text-rose-500'
            : 'bg-pink-100 text-pink-500'
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-700">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
};
