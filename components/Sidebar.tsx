
import React from 'react';
import { LayoutDashboard, Calendar, Users, DollarSign, Settings, Bell, Heart } from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', active: true },
    { icon: <Calendar className="w-5 h-5" />, label: 'Agendamentos', active: false },
    { icon: <Users className="w-5 h-5" />, label: 'Clientes', active: false },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Financeiro', active: false },
    { icon: <Heart className="w-5 h-5" />, label: 'Serviços', active: false },
    { icon: <Settings className="w-5 h-5" />, label: 'Configurações', active: false },
  ];

  return (
    <div className="h-screen sticky top-0 bg-white border-r border-rose-100 flex flex-col p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-12">
        <div className="bg-pink-100 p-2 rounded-xl">
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-800">Esthetic<span className="text-pink-400">Flow</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              item.active 
                ? 'bg-pink-50 text-pink-600 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-rose-50">
        <div className="bg-rose-50 p-4 rounded-2xl flex items-center gap-3">
          <img src="https://picsum.photos/id/64/100/100" alt="Dra. Ana" className="w-10 h-10 rounded-full border-2 border-white" />
          <div>
            <p className="text-sm font-bold text-slate-800">Dra. Ana Silva</p>
            <p className="text-xs text-pink-400">Administradora</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
