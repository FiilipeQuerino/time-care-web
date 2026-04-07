import { useState } from 'react';
import { Calendar, Medal, TrendingUp, Trophy, Users } from 'lucide-react';
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

interface RankingItem {
  name: string;
  total: number;
}

const defaultTopProcedures: RankingItem[] = [
  { name: 'Limpeza de pele', total: 0 },
  { name: 'Drenagem linfatica', total: 0 },
  { name: 'Peeling quimico', total: 0 },
  { name: 'Massagem modeladora', total: 0 },
  { name: 'Radiofrequencia', total: 0 },
];

const defaultTopClients: RankingItem[] = [
  { name: 'Cliente 1', total: 0 },
  { name: 'Cliente 2', total: 0 },
  { name: 'Cliente 3', total: 0 },
  { name: 'Cliente 4', total: 0 },
  { name: 'Cliente 5', total: 0 },
];

const getRankIcon = (index: number) => {
  if (index === 0) return <Trophy size={15} className="text-amber-500" />;
  if (index === 1) return <Medal size={15} className="text-slate-500" />;
  if (index === 2) return <Medal size={15} className="text-orange-500" />;
  return <span className="text-[11px] font-black text-slate-500">#{index + 1}</span>;
};

const RankingCard = ({
  title,
  label,
  items,
}: {
  title: string;
  label: string;
  items: RankingItem[];
}) => {
  const ordered = [...items].sort((a, b) => b.total - a.total).slice(0, 5);
  const maxTotal = Math.max(...ordered.map((item) => item.total), 1);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
          {label}
        </span>
      </div>

      <div className="space-y-2.5">
        {ordered.map((item, index) => (
          <article key={`${item.name}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white">
                {getRankIcon(index)}
              </div>
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{item.name}</p>
              <p className="text-sm font-black text-slate-900">{item.total}</p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500"
                style={{ width: `${Math.max(8, (item.total / maxTotal) * 100)}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export const DashboardSection = ({ isLoading, error, financialData, onRetry }: DashboardSectionProps) => {
  const [rankingTab, setRankingTab] = useState<'clients' | 'procedures'>('clients');

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
    topClients: [],
    upcomingAppointments: [],
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

  const topProcedures: RankingItem[] = summary.topProcedures.length
    ? summary.topProcedures.map((item) => ({ name: item.procedureName, total: item.total }))
    : defaultTopProcedures;

  const topClientsFromApi: RankingItem[] = summary.topClients?.length
    ? summary.topClients.map((item) => ({ name: item.clientName, total: item.total }))
    : [];

  const topClientsFromUpcoming: RankingItem[] =
    summary.upcomingAppointments && summary.upcomingAppointments.length > 0
      ? Object.entries(
          summary.upcomingAppointments.reduce<Record<string, number>>((acc, appointment) => {
            const name = appointment.clientName?.trim() || `Cliente #${appointment.clientId}`;
            acc[name] = (acc[name] ?? 0) + 1;
            return acc;
          }, {}),
        ).map(([name, total]) => ({ name, total }))
      : [];

  const topClients: RankingItem[] =
    topClientsFromApi.length > 0
      ? topClientsFromApi
      : topClientsFromUpcoming.length > 0
      ? topClientsFromUpcoming
      : defaultTopClients;

  return (
    <>
      <div data-onboarding-target="dashboard-overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Receita Total" value={formatCurrency(summary.totalRevenue)} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard title="Agendamentos Total" value={summary.totalAppointments} icon={Calendar} color="bg-rose-500" />
        <StatCard title="Receita Hoje" value={formatCurrency(summary.todayRevenue)} icon={TrendingUp} />
        <StatCard title="Agendamentos Hoje" value={summary.todayAppointments} icon={Users} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 xl:col-span-2">
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

        <div className="rounded-[1.6rem] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Ranking</h3>
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  rankingTab === 'clients' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setRankingTab('clients')}
              >
                Clientes
              </button>
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  rankingTab === 'procedures' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setRankingTab('procedures')}
              >
                Procedimentos
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className={`flex w-[200%] transition-transform duration-300 ease-out ${
                rankingTab === 'clients' ? 'translate-x-0' : '-translate-x-1/2'
              }`}
            >
              <div className="w-1/2 pr-2">
                <RankingCard title="Top 5 Clientes" label="Frequencia" items={topClients} />
              </div>
              <div className="w-1/2 pl-2">
                <RankingCard title="Top 5 Procedimentos" label="Ranking" items={topProcedures} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
