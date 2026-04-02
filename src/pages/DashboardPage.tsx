import { motion } from 'motion/react';
import { 
  Users, 
  Calendar, 
  Settings, 
  BarChart3, 
  Package, 
  LayoutDashboard,
  LogOut,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/ui/Button';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'estoque', label: 'Estoque', icon: Package },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  { id: 'config', label: 'Config', icon: Settings },
];

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 md:pl-64">
      {/* Sidebar for Tablet/Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
            <Clock size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tight">TimeCare</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.id === 'dashboard' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all mt-auto"
        >
          <LogOut size={20} />
          <span className="font-semibold">Sair</span>
        </button>
      </aside>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white">
            <Clock size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-black text-slate-800">TimeCare</span>
        </div>

        <div className="hidden md:flex flex-1"></div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-10 h-10 rounded-xl bg-pink-100 border-2 border-white shadow-sm overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="avatar" referrerPolicy="no-referrer" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Olá, {user?.name?.split(' ')[0]} 👋</h2>
            <p className="text-slate-500 font-medium">Veja o que está acontecendo hoje na sua clínica.</p>
          </div>
          <Button icon={Plus} className="md:w-auto w-full">Novo Registro</Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total de Clientes" 
            value="1,284" 
            icon={Users} 
            trend={{ value: 12, isPositive: true }} 
          />
          <StatCard 
            title="Agendamentos" 
            value="42" 
            icon={Calendar} 
            trend={{ value: 5, isPositive: true }} 
            color="bg-rose-500"
          />
          <StatCard 
            title="Receita Mensal" 
            value="R$ 12.450" 
            icon={TrendingUp} 
            trend={{ value: 8, isPositive: true }} 
            color="bg-emerald-500"
          />
          <StatCard 
            title="Itens em Estoque" 
            value="856" 
            icon={Package} 
            trend={{ value: 2, isPositive: false }} 
            color="bg-amber-500"
          />
        </div>

        {/* Shortcuts / Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Atalhos Rápidos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Novo Cliente', 'Marcar Agenda', 'Relatório Vendas', 'Ver Estoque'].map((action, i) => (
              <motion.button
                key={action}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 text-center"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${i % 2 === 0 ? 'bg-pink-50 text-pink-600' : 'bg-rose-50 text-rose-600'}`}>
                  {i === 0 && <Users size={24} />}
                  {i === 1 && <Calendar size={24} />}
                  {i === 2 && <BarChart3 size={24} />}
                  {i === 3 && <Package size={24} />}
                </div>
                <span className="text-sm font-bold text-slate-700">{action}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Próximos Agendamentos</h3>
            <button className="text-sm font-bold text-pink-600">Ver tudo</button>
          </div>
          <div className="space-y-4">
            {[
              { time: '09:00', patient: 'Ana Silva', procedure: 'Limpeza de Pele' },
              { time: '10:30', patient: 'Beatriz Costa', procedure: 'Drenagem Linfática' },
              { time: '14:00', patient: 'Carla Mendes', procedure: 'Peeling Químico' }
            ].map((appointment, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-pink-50 flex flex-col items-center justify-center text-pink-600">
                  <span className="text-[10px] font-bold uppercase">Hoje</span>
                  <span className="text-sm font-black">{appointment.time}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{appointment.patient}</p>
                  <p className="text-xs text-slate-500">{appointment.procedure}</p>
                </div>
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-4 py-3 flex justify-between items-center z-50">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            className={`flex flex-col items-center gap-1 transition-all ${
              item.id === 'dashboard' ? 'text-pink-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={22} strokeWidth={item.id === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
