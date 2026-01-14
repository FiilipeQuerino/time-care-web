
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  DollarSign, 
  Settings, 
  Heart, 
  BarChart3, 
  Package, 
  Menu,
  Clock
} from 'lucide-react';
import { ViewType } from '../App';

interface NavProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Navigation: React.FC<NavProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, icon: <LayoutDashboard />, label: 'Início' },
    { id: 'agenda' as ViewType, icon: <Calendar />, label: 'Agenda' },
    { id: 'clientes' as ViewType, icon: <Users />, label: 'Clientes' },
    { id: 'financeiro' as ViewType, icon: <DollarSign />, label: 'Caixa' },
    { id: 'estoque' as ViewType, icon: <Package />, label: 'Estoque' },
  ];

  const secondaryItems = [
    { id: 'servicos' as ViewType, icon: <Heart />, label: 'Serviços' },
    { id: 'relatorios' as ViewType, icon: <BarChart3 />, label: 'Relatórios' },
    { id: 'configuracoes' as ViewType, icon: <Settings />, label: 'Ajustes' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen sticky top-0 w-72 bg-white border-r border-rose-100 flex-col p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-pink-500 p-2.5 rounded-2xl shadow-lg shadow-pink-100">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-800 tracking-tight">
            Time<span className="text-pink-400 italic">Care</span>
          </h1>
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Painel de Controle</p>
          {[...menuItems, ...secondaryItems].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                currentView === item.id 
                  ? 'bg-pink-50 text-pink-600 shadow-sm shadow-pink-100 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-rose-50">
          <div className="bg-rose-50/50 p-4 rounded-2xl flex items-center gap-4">
            <div className="relative">
              <img src="https://picsum.photos/id/64/100/100" alt="Dra. Ana" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Dra. Ana Silva</p>
              <p className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Time Care Premium</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-rose-100 px-2 pt-2 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-end">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1.5 py-2 px-3 transition-all duration-300 ${
                currentView === item.id ? 'text-pink-500' : 'text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${
                currentView === item.id ? 'bg-pink-100 scale-110 shadow-sm' : 'bg-transparent'
              }`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 22 })}
              </div>
              <span className={`text-[10px] font-bold tracking-tight transition-all ${
                currentView === item.id ? 'opacity-100' : 'opacity-70'
              }`}>{item.label}</span>
            </button>
          ))}
          {/* "More" Button for Mobile */}
          <button 
            onClick={() => setView('configuracoes')}
            className={`flex flex-col items-center gap-1.5 py-2 px-3 transition-all duration-300 ${
              ['servicos', 'relatorios', 'configuracoes'].includes(currentView) ? 'text-pink-500' : 'text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all duration-300 ${
              ['servicos', 'relatorios', 'configuracoes'].includes(currentView) ? 'bg-pink-100' : 'bg-transparent'
            }`}>
              <Menu size={22} />
            </div>
            <span className="text-[10px] font-bold tracking-tight opacity-70">Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
