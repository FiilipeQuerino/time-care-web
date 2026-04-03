import { useMemo, useState } from 'react';
import {
  CalendarCheck2,
  FileSearch,
  FileSpreadsheet,
  FileText,
  Filter,
  LineChart,
  Printer,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Client, DashboardFinancialData, Procedure } from '../../../types';
import {
  reportCategoryMeta,
  reportDefinitions,
  reportLeadSourceOptions,
  reportPeriodOptions,
  reportStatusOptions,
} from '../constants';
import { formatCurrency } from '../helpers';
import { ReportCategory, ReportFilters, ReportMode, ReportPeriod } from '../types';

interface ReportsSectionProps {
  financialData: DashboardFinancialData | null;
  clients: Client[];
  procedures: Procedure[];
  onRefresh: () => void;
}

export const ReportsSection = ({ financialData, clients, procedures, onRefresh }: ReportsSectionProps) => {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('month');
  const [reportMode, setReportMode] = useState<ReportMode>('summary');
  const [reportCategoryFilter, setReportCategoryFilter] = useState<'all' | ReportCategory>('all');
  const [selectedReportId, setSelectedReportId] = useState<string>(reportDefinitions[0].id);
  const [reportFilters, setReportFilters] = useState<ReportFilters>({
    professional: 'all',
    procedure: 'all',
    category: 'all',
    status: 'Todos',
    client: 'all',
    leadSource: 'Todas',
    startDate: '',
    endDate: '',
  });

  const updateReportFilter = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
    setReportFilters((current) => ({ ...current, [key]: value }));
  };

  const selectedReport = useMemo(
    () => reportDefinitions.find((report) => report.id === selectedReportId) ?? reportDefinitions[0],
    [selectedReportId],
  );

  const visibleReportDefinitions = useMemo(
    () =>
      reportDefinitions.filter((report) => reportCategoryFilter === 'all' || report.category === reportCategoryFilter),
    [reportCategoryFilter],
  );

  const reportSnapshot = useMemo(() => {
    const totalAppointments = financialData?.monthAppointments ?? 184;
    const totalRevenue = financialData?.monthRevenue ?? 86240;
    const ticketAverage = totalAppointments > 0 ? totalRevenue / totalAppointments : 0;
    const attendanceRate = 89.4;
    const cancellations = Math.max(8, Math.round(totalAppointments * 0.09));
    const newClients = clients.length > 0 ? Math.min(42, Math.max(12, Math.round(clients.length * 0.14))) : 26;
    const recurringClients = clients.length > 0 ? Math.round(clients.length * 0.62) : 48;
    const proceduresPerformed = Math.round(totalAppointments * 1.18);
    const leadConversionRate = 34.7;
    const scheduleOccupancy = 78.5;

    return {
      totalRevenue,
      ticketAverage,
      totalAppointments,
      attendanceRate,
      cancellations,
      newClients,
      recurringClients,
      proceduresPerformed,
      leadConversionRate,
      scheduleOccupancy,
    };
  }, [clients.length, financialData]);

  const revenueByDayChart = useMemo(() => {
    const fallback = [
      { date: 'Seg', value: 9200 },
      { date: 'Ter', value: 10800 },
      { date: 'Qua', value: 9900 },
      { date: 'Qui', value: 12100 },
      { date: 'Sex', value: 11500 },
      { date: 'Sab', value: 8200 },
    ];
    const base = financialData?.revenueByDay.length ? financialData.revenueByDay : fallback;
    const maxValue = Math.max(...base.map((item) => item.value), 1);
    return base.map((item) => ({
      ...item,
      ratio: Math.max(12, Math.round((item.value / maxValue) * 100)),
    }));
  }, [financialData]);

  const topProceduresSnapshot = useMemo(() => {
    if (financialData?.topProcedures.length) return financialData.topProcedures;
    return [
      { procedureName: 'Limpeza de pele premium', total: 52 },
      { procedureName: 'Drenagem linfatica', total: 41 },
      { procedureName: 'Brow lamination', total: 35 },
      { procedureName: 'Peeling quimico', total: 29 },
    ];
  }, [financialData]);

  const totalByCategory = visibleReportDefinitions.reduce<Record<ReportCategory, number>>(
    (accumulator, report) => ({
      ...accumulator,
      [report.category]: accumulator[report.category] + 1,
    }),
    {
      financeiro: 0,
      clientes: 0,
      procedimentos: 0,
      agenda: 0,
      comercial: 0,
      performance: 0,
    },
  );

  const kpis = [
    { title: 'Faturamento do periodo', value: formatCurrency(reportSnapshot.totalRevenue), trend: '+12,4%', tone: 'positive' },
    { title: 'Ticket medio', value: formatCurrency(reportSnapshot.ticketAverage), trend: '+4,2%', tone: 'positive' },
    { title: 'Numero de atendimentos', value: reportSnapshot.totalAppointments, trend: '+8,1%', tone: 'positive' },
    { title: 'Taxa de comparecimento', value: `${reportSnapshot.attendanceRate.toFixed(1)}%`, trend: '+1,7%', tone: 'positive' },
    { title: 'Cancelamentos', value: reportSnapshot.cancellations, trend: '-2,3%', tone: 'warning' },
    { title: 'Novos clientes', value: reportSnapshot.newClients, trend: '+9,8%', tone: 'positive' },
    { title: 'Clientes recorrentes', value: reportSnapshot.recurringClients, trend: '+6,1%', tone: 'positive' },
    { title: 'Procedimentos realizados', value: reportSnapshot.proceduresPerformed, trend: '+10,3%', tone: 'neutral' },
    { title: 'Taxa de conversao de leads', value: `${reportSnapshot.leadConversionRate.toFixed(1)}%`, trend: '+3,6%', tone: 'positive' },
    { title: 'Ocupacao da agenda', value: `${reportSnapshot.scheduleOccupancy.toFixed(1)}%`, trend: '+2,0%', tone: 'neutral' },
  ] as const;

  const attendanceConfirmed = reportSnapshot.totalAppointments;
  const attendanceDone = Math.round(attendanceConfirmed * (reportSnapshot.attendanceRate / 100));
  const attendanceMissed = Math.max(0, attendanceConfirmed - attendanceDone - reportSnapshot.cancellations);
  const attendanceCancelled = reportSnapshot.cancellations;

  const filtersSummary = [
    `Periodo: ${reportPeriodOptions.find((option) => option.value === reportPeriod)?.label ?? 'Mes'}`,
    `Profissional: ${reportFilters.professional === 'all' ? 'Todos' : reportFilters.professional}`,
    `Procedimento: ${reportFilters.procedure === 'all' ? 'Todos' : reportFilters.procedure}`,
    `Categoria: ${reportFilters.category === 'all' ? 'Todas' : reportFilters.category}`,
    `Status: ${reportFilters.status}`,
    `Cliente: ${reportFilters.client === 'all' ? 'Todos' : reportFilters.client}`,
    `Origem do lead: ${reportFilters.leadSource}`,
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="rounded-[1.5rem] border border-pink-100 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-pink-600">Relatorios e analises</p>
              <h3 className="mt-1 text-xl font-black text-slate-800 sm:text-2xl">Dashboard gerencial da clinica</h3>
              <p className="mt-1 text-sm text-slate-600">Visao executiva para decisao rapida no celular, tablet e desktop.</p>
            </div>
            <Button size="sm" variant="outline" icon={RefreshCw} className="shrink-0 border-pink-200 text-pink-700 hover:bg-pink-50" onClick={onRefresh}>
              Atualizar dados
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 font-semibold text-pink-700">{reportDefinitions.length} relatorios disponiveis</span>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-600">Modo atual: {reportMode === 'summary' ? 'Resumido' : 'Detalhado'}</span>
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <Filter size={16} className="text-slate-500" />
          <p className="text-sm font-semibold text-slate-800">Filtros de analise</p>
        </div>
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {reportPeriodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setReportPeriod(option.value)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${reportPeriod === option.value ? 'border-pink-200 bg-pink-50 text-pink-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {reportPeriod === 'custom' ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Data inicial</label>
                <input
                  type="date"
                  value={reportFilters.startDate}
                  onChange={(event) => updateReportFilter('startDate', event.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Data final</label>
                <input
                  type="date"
                  value={reportFilters.endDate}
                  onChange={(event) => updateReportFilter('endDate', event.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Profissional</span>
              <select
                value={reportFilters.professional}
                onChange={(event) => updateReportFilter('professional', event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
              >
                <option value="all">Todos os profissionais</option>
                <option value="Ana Lima">Ana Lima</option>
                <option value="Marina Souza">Marina Souza</option>
                <option value="Juliana Prado">Juliana Prado</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Procedimento</span>
              <select
                value={reportFilters.procedure}
                onChange={(event) => updateReportFilter('procedure', event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
              >
                <option value="all">Todos os procedimentos</option>
                {procedures.slice(0, 8).map((procedure) => (
                  <option key={procedure.procedureId} value={procedure.name}>
                    {procedure.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Categoria</span>
              <select
                value={reportFilters.category}
                onChange={(event) => updateReportFilter('category', event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
              >
                <option value="all">Todas as categorias</option>
                <option value="Facial">Facial</option>
                <option value="Body">Body</option>
                <option value="Aesthetic">Aesthetic</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Status</span>
              <select
                value={reportFilters.status}
                onChange={(event) => updateReportFilter('status', event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
              >
                {reportStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Cliente</span>
              <select
                value={reportFilters.client}
                onChange={(event) => updateReportFilter('client', event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
              >
                <option value="all">Todos os clientes</option>
                {clients.slice(0, 10).map((client) => (
                  <option key={client.clientId} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Origem do lead</span>
              <select
                value={reportFilters.leadSource}
                onChange={(event) => updateReportFilter('leadSource', event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
              >
                {reportLeadSourceOptions.map((origin) => (
                  <option key={origin} value={origin}>
                    {origin}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setReportMode('summary')}
              className={`h-11 w-full rounded-xl border text-sm font-semibold transition-colors ${reportMode === 'summary' ? 'border-pink-200 bg-pink-50 text-pink-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              Gerar versao resumida
            </button>
            <button
              type="button"
              onClick={() => setReportMode('detailed')}
              className={`h-11 w-full rounded-xl border text-sm font-semibold transition-colors ${reportMode === 'detailed' ? 'border-pink-200 bg-pink-50 text-pink-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              Gerar versao detalhada
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-pink-600">Visao geral rapida</p>
          <h4 className="text-lg font-black text-slate-800 sm:text-xl">Resumo executivo da operacao</h4>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((item) => {
            const trendClass = item.tone === 'warning'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : item.tone === 'positive'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200';
            return (
              <article key={item.title} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.title}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${trendClass}`}>{item.trend}</span>
                </div>
                <p className="mt-2 text-2xl font-black text-slate-800">{item.value}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm xl:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <LineChart size={17} className="text-pink-600" />
            <h5 className="text-sm font-bold text-slate-800">Faturamento por dia</h5>
          </div>
          <div className="flex h-52 items-end gap-2 rounded-xl border border-pink-100 bg-gradient-to-b from-pink-50/70 to-white p-3 sm:gap-3">
            {revenueByDayChart.map((item) => (
              <div key={item.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-pink-600 to-rose-400" style={{ height: `${item.ratio}%` }}></div>
                <div className="text-center">
                  <p className="text-[11px] font-semibold text-slate-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <CalendarCheck2 size={17} className="text-sky-600" />
            <h5 className="text-sm font-bold text-slate-800">Agenda x comparecimento</h5>
          </div>
          <div className="space-y-3">
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.max(8, Math.round((attendanceDone / Math.max(attendanceConfirmed, 1)) * 100))}%` }}></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Confirmados</p>
                <p className="text-base font-bold text-slate-800">{attendanceConfirmed}</p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-2.5">
                <p className="text-[11px] uppercase tracking-wide text-emerald-600">Realizados</p>
                <p className="text-base font-bold text-emerald-700">{attendanceDone}</p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-2.5">
                <p className="text-[11px] uppercase tracking-wide text-amber-600">Cancelados</p>
                <p className="text-base font-bold text-amber-700">{attendanceCancelled}</p>
              </div>
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-2.5">
                <p className="text-[11px] uppercase tracking-wide text-rose-600">Faltas</p>
                <p className="text-base font-bold text-rose-700">{attendanceMissed}</p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-pink-600">Procedimentos destaque</p>
            <h5 className="text-sm font-bold text-slate-800">Mais realizados no periodo</h5>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">{topProceduresSnapshot.length} itens</span>
        </div>
        <div className="space-y-2">
          {topProceduresSnapshot.slice(0, 4).map((procedure, index) => (
            <div key={`${procedure.procedureName}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5">
              <p className="text-sm font-medium text-slate-700">{procedure.procedureName}</p>
              <p className="text-sm font-black text-slate-900">{procedure.total}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-pink-600">Central de relatorios</p>
          <h4 className="text-lg font-black text-slate-800 sm:text-xl">Gere relatorios por categoria</h4>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setReportCategoryFilter('all')}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${reportCategoryFilter === 'all' ? 'border-pink-200 bg-pink-50 text-pink-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            Todos ({reportDefinitions.length})
          </button>
          {(Object.keys(reportCategoryMeta) as ReportCategory[]).map((category) => {
            const meta = reportCategoryMeta[category];
            return (
              <button
                key={category}
                type="button"
                onClick={() => setReportCategoryFilter(category)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${reportCategoryFilter === category ? 'border-pink-200 bg-pink-50 text-pink-700' : meta.chipClass}`}
              >
                {meta.label} ({totalByCategory[category]})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.65fr_1fr]">
          <div className="space-y-3">
            {visibleReportDefinitions.map((report) => {
              const category = reportCategoryMeta[report.category];
              const CategoryIcon = category.icon;
              const isSelected = selectedReportId === report.id;

              return (
                <article key={report.id} className={`rounded-2xl border bg-white p-4 shadow-sm transition-colors ${isSelected ? 'border-pink-200' : 'border-slate-100'}`}>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${category.chipClass}`}>
                        <CategoryIcon size={12} />
                        {category.label}
                      </span>
                      <h5 className="mt-2 text-sm font-bold text-slate-800 sm:text-base">{report.title}</h5>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">{report.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReportId(report.id)}
                      className={`h-10 rounded-xl border text-sm font-semibold transition-colors ${isSelected ? 'border-pink-200 bg-pink-50 text-pink-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                    >
                      Visualizar na tela
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReportMode('summary');
                        setSelectedReportId(report.id);
                      }}
                      className="h-10 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      Gerar resumido
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReportMode('detailed');
                        setSelectedReportId(report.id);
                      }}
                      className="h-10 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      Gerar detalhado
                    </button>
                    <div className="flex items-center gap-2">
                      <button type="button" className="flex h-10 flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100">
                        <FileText size={14} />
                        PDF
                      </button>
                      <button type="button" className="flex h-10 flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100">
                        <FileSpreadsheet size={14} />
                        Excel/CSV
                      </button>
                      <button type="button" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100" aria-label="Compartilhar ou imprimir">
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm xl:sticky xl:top-24 xl:h-fit">
            <div className="mb-3 flex items-center gap-2">
              <FileSearch size={17} className="text-pink-600" />
              <p className="text-sm font-bold text-slate-800">Pre-visualizacao</p>
            </div>
            <h5 className="text-base font-black text-slate-800">{selectedReport.title}</h5>
            <p className="mt-1 text-sm text-slate-500">{selectedReport.description}</p>

            <div className="mt-4 space-y-2">
              {filtersSummary.map((item) => (
                <p key={item} className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">
                  {item}
                </p>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" className="h-10 rounded-xl border border-pink-200 bg-pink-50 text-sm font-semibold text-pink-700">Abrir relatorio</button>
              <button type="button" className="h-10 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">Exportar PDF</button>
              <button type="button" className="flex h-10 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                <FileSpreadsheet size={14} />
                Excel/CSV
              </button>
              <button type="button" className="flex h-10 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                <Printer size={14} />
                Imprimir
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500">Modo atual de geracao: {reportMode === 'summary' ? 'Resumido' : 'Detalhado'}.</p>
          </aside>
        </div>
      </section>
    </div>
  );
};
