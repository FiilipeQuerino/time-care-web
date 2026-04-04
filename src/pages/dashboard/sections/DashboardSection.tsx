import { Calendar, TrendingUp, Users } from 'lucide-react';
import { StatCard } from '../../../components/StatCard';
import { Button } from '../../../components/ui/Button';
import { DashboardFinancialData } from '../../../types/dashboard';
import { formatCurrency } from '../helpers';
import { DashboardSkeleton } from '../components/Skeletal';

interface DashboardSectionProps {
  isLoading: boolean;
  error: string | null;
  financialData: DashboardFinancialData | null;
  onRetry: () => void;
}

export const DashboardSection = ({ isLoading, error, financialData, onRetry }: DashboardSectionProps) => {
  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="bg-white rounded-[2rem] border border-rose-100 shadow-sm p-6">
        <p className="text-rose-600 font-medium mb-3">{error}</p>
        <Button size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const summary = financialData ?? {
    totalRevenue: 0,
    totalAppointments: 0,
    todayRevenue: 0,
    todayAppointments: 0,
    monthRevenue: 0,
    monthAppointments: 0,
    revenueByDay: [],
    topProcedures: [],
  };

  const revenueByDay = summary.revenueByDay.length
    ? summary.revenueByDay
    : [
        { date: 'Seg', value: 0 },
        { date: 'Ter', value: 0 },
        { date: 'Qua', value: 0 },
        { date: 'Qui', value: 0 },
        { date: 'Sex', value: 0 },
      ];

  const topProcedures = summary.topProcedures.length
    ? summary.topProcedures
    : [
        { procedureName: 'Limpeza de pele', total: 0 },
        { procedureName: 'Drenagem linfatica', total: 0 },
        { procedureName: 'Peeling quimico', total: 0 },
      ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Receita Total" value={formatCurrency(summary.totalRevenue)} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard title="Agendamentos Total" value={summary.totalAppointments} icon={Calendar} color="bg-rose-500" />
        <StatCard title="Receita Hoje" value={formatCurrency(summary.todayRevenue)} icon={TrendingUp} />
        <StatCard title="Agendamentos Hoje" value={summary.todayAppointments} icon={Users} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Receita por dia</h3>
          <div className="space-y-3">
            {revenueByDay.map((item, index) => {
              const width = summary.monthRevenue > 0 ? Math.max(8, (item.value / summary.monthRevenue) * 100) : 8;
              return (
                <div key={`${item.date}-${index}`}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{item.date}</span>
                    <span>{formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" style={{ width: `${width}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top procedimentos</h3>
          <div className="space-y-3">
            {topProcedures.map((procedure, index) => (
              <div key={`${procedure.procedureName}-${index}`} className="flex items-center justify-between border border-slate-100 rounded-xl px-3 py-2">
                <span className="text-sm font-medium text-slate-700">{procedure.procedureName}</span>
                <span className="text-sm font-bold text-slate-900">{procedure.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
