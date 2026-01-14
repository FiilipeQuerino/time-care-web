
import React from 'react';
import { 
  Users, 
  CalendarDays, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  Plus,
  MessageCircle,
  Phone
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { Appointment, Alert, WeeklyData } from '../types';
import { ViewType } from '../App';

const weeklyData: WeeklyData[] = [
  { day: 'Seg', count: 3, revenue: 1200 },
  { day: 'Ter', count: 0, revenue: 0 },
  { day: 'Qua', count: 10, revenue: 4500 },
  { day: 'Qui', count: 5, revenue: 2100 },
  { day: 'Sex', count: 8, revenue: 3800 },
  { day: 'Sáb', count: 4, revenue: 1800 },
];

const nextAppointments: Appointment[] = [
  { id: 1, time: '10:00', endTime: '11:00', client: 'Ana Silva', service: 'Corte e Hidratação', duration: 60, type: 'facial', status: 'confirmed' },
  { id: 2, time: '11:30', endTime: '12:30', client: 'Bruno Costa', service: 'Coloração Especial', duration: 60, type: 'estetica', status: 'pending' },
  { id: 3, time: '14:00', endTime: '15:00', client: 'Carla Matos', service: 'Manicure SPA', duration: 60, type: 'estetica', status: 'confirmed' },
  { id: 4, time: '15:30', endTime: '16:30', client: 'Daniela Meire', service: 'Limpeza de Pele', duration: 60, type: 'facial', status: 'confirmed' },
];

const alerts: Alert[] = [
  { id: 1, message: '3 agendamentos para hoje não confirmados.', type: 'Atenção', severity: 'high' },
  { id: 2, message: '5 clientes de ontem com pagamento pendente.', type: 'Financeiro', severity: 'medium' },
  { id: 3, message: 'Meta mensal está 15% abaixo do esperado.', type: 'Gestão', severity: 'low' },
];

interface DashboardProps {
  setView: (view: ViewType) => void;
}

const StatCard = ({ title, value, icon, color, trend }: { title: string, value: string, icon: React.ReactElement, color: string, trend?: string }) => (
  <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-50 hover:shadow-[0_8px_30px_rgb(244,114,182,0.1)] transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: `w-6 h-6 ${color.replace('bg-', 'text-')}` })}
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const handleWhatsApp = (client: string) => {
    const text = encodeURIComponent(`Olá ${client.split(' ')[0]}! Tudo bem? Passando para confirmar seu agendamento na Time Care hoje. ✨`);
    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Olá, Dra. Ana! ✨</h2>
          <p className="text-slate-500 mt-1 font-medium">Sua clínica está radiante hoje.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView('agenda')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-pink-500 text-white px-6 py-4 md:py-2.5 rounded-2xl shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all font-bold">
            <Plus className="w-5 h-5" /> Novo Agendamento
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Agendamentos" value="12" icon={<CalendarDays />} color="bg-pink-500" trend="+12%" />
        <StatCard title="Receita Hoje" value="R$ 3.450" icon={<DollarSign />} color="bg-emerald-500" trend="+5%" />
        <StatCard title="Novos Clientes" value="8" icon={<Users />} color="bg-blue-500" trend="+2" />
        <StatCard title="Taxa de Conf." value="92%" icon={<TrendingUp />} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Weekly Summary Chart */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-rose-50 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-500" /> Desempenho Semanal
              </h3>
            </div>
            
            <div className="h-[250px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F472B6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F472B6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#F472B6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Next Appointments List - Reimagined for Mobile */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-rose-50 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-rose-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-500" /> Próximos Atendimentos
              </h3>
              <button className="text-xs text-pink-500 font-black uppercase tracking-widest hover:text-pink-600 transition-colors">Ver Agenda</button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-4">Horário</th>
                    <th className="px-8 py-4">Cliente</th>
                    <th className="px-8 py-4">Procedimento</th>
                    <th className="px-8 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50">
                  {nextAppointments.map((item) => (
                    <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-800">{item.time}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-[10px] font-black">{item.client.split(' ').map(n => n[0]).join('')}</div>
                          <span className="font-bold text-slate-700">{item.client}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500">{item.service}</td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleWhatsApp(item.client)} className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                             <MessageCircle size={18} />
                          </button>
                          <button className="p-2.5 text-slate-400 hover:bg-rose-50 hover:text-pink-500 rounded-xl transition-all">
                             <ChevronRight size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-rose-50">
              {nextAppointments.map((item) => (
                <div key={item.id} className="p-6 space-y-4 active:bg-rose-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-slate-800 leading-none">{item.time}</span>
                        <span className="text-[10px] font-black text-pink-400 uppercase tracking-tighter mt-1">{item.duration}m</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{item.client}</p>
                        <p className="text-sm font-medium text-slate-400">{item.service}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {item.status === 'confirmed' ? 'Conf.' : 'Pend.'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleWhatsApp(item.client)} className="flex-1 bg-emerald-500 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
                      <MessageCircle size={18} /> WhatsApp
                    </button>
                    <button className="w-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts & Pending Section */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-rose-50 h-fit">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-500" /> Pendências
          </h3>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-5 rounded-3xl border-l-4 flex flex-col gap-2 transition-all hover:scale-[1.02] ${alert.severity === 'high' ? 'bg-rose-50 border-rose-400' : 'bg-amber-50 border-amber-400'}`}>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{alert.type}</span>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-tight">{alert.message}</p>
                <button className="text-[10px] font-black uppercase tracking-widest text-pink-500 mt-2 text-left">Resolver Agora →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
