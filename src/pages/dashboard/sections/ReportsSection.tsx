import { useState } from 'react';
import { ArrowLeft, BarChart3, ChevronRight, FileSpreadsheet, FileText, LineChart, Wallet } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAnalyticsReports } from '../../../hooks/useAnalyticsReports';
import { formatCurrency } from '../helpers';

type ReportView = 'menu' | 'financial' | 'performance';

const percent = (value: number): string => `${(value ?? 0).toFixed(2)}%`;

export const ReportsSection = () => {
  const [view, setView] = useState<ReportView>('menu');
  const {
    filters,
    setFilters,
    financial,
    performance,
    isLoadingFinancial,
    isLoadingPerformance,
    isExporting,
    financialError,
    performanceError,
    loadFinancial,
    loadPerformance,
    exportCsv,
    exportPdf,
  } = useAnalyticsReports();

  if (view === 'financial') {
    return (
      <div className="space-y-4">
        <section className="rounded-[1.3rem] border border-slate-100 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => setView('menu')}
            className="mb-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            Voltar
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-pink-50 p-2 text-pink-600"><Wallet size={16} /></span>
            <h3 className="text-xl font-black text-slate-800">Financeiro</h3>
          </div>
          <p className="mt-2 text-sm text-slate-500">Resumo de receitas e recebimentos do periodo selecionado.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs font-semibold text-slate-600">Data inicial</span>
              <input
                type="date"
                value={filters.startDate}
                onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-pink-500 focus:outline-none"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-semibold text-slate-600">Data final</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-pink-500 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <Button className="h-10 bg-pink-600 text-white hover:bg-pink-700" onClick={() => void loadFinancial()} isLoading={isLoadingFinancial}>
              Buscar
            </Button>
            <Button variant="outline" className="h-10 border-slate-200 text-slate-700" onClick={() => void exportCsv()} isLoading={isExporting}>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                <FileSpreadsheet size={14} strokeWidth={2.4} />
              </span>
              CSV
            </Button>
            <Button variant="outline" className="h-10 border-slate-200 text-slate-700" onClick={() => void exportPdf()} isLoading={isExporting}>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-rose-100 text-rose-700">
                <FileText size={14} strokeWidth={2.4} />
              </span>
              PDF
            </Button>
          </div>

          {financialError ? (
            <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{financialError}</p>
          ) : null}
        </section>

        <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total recebido</p>
            <p className="mt-1 text-xl font-black text-slate-800">{formatCurrency(financial?.totalReceived ?? 0)}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total em aberto</p>
            <p className="mt-1 text-xl font-black text-slate-800">{formatCurrency(financial?.totalOutstanding ?? 0)}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total faturado</p>
            <p className="mt-1 text-xl font-black text-slate-800">{formatCurrency(financial?.totalBilled ?? 0)}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Variacao</p>
            <p className="mt-1 text-xl font-black text-slate-800">{percent(financial?.receivedVariationPercent ?? 0)}</p>
          </article>
        </section>
      </div>
    );
  }

  if (view === 'performance') {
    return (
      <div className="space-y-4">
        <section className="rounded-[1.3rem] border border-slate-100 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => setView('menu')}
            className="mb-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            Voltar
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-sky-50 p-2 text-sky-600"><LineChart size={16} /></span>
            <h3 className="text-xl font-black text-slate-800">Desempenho</h3>
          </div>
          <p className="mt-2 text-sm text-slate-500">Indicadores operacionais e de produtividade da clinica.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs font-semibold text-slate-600">Data inicial</span>
              <input
                type="date"
                value={filters.startDate}
                onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-pink-500 focus:outline-none"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-semibold text-slate-600">Data final</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 focus:border-pink-500 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <Button className="h-10 bg-pink-600 text-white hover:bg-pink-700" onClick={() => void loadPerformance()} isLoading={isLoadingPerformance}>
              Buscar
            </Button>
            <Button variant="outline" className="h-10 border-slate-200 text-slate-700" onClick={() => void exportCsv()} isLoading={isExporting}>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                <FileSpreadsheet size={14} strokeWidth={2.4} />
              </span>
              CSV
            </Button>
            <Button variant="outline" className="h-10 border-slate-200 text-slate-700" onClick={() => void exportPdf()} isLoading={isExporting}>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-rose-100 text-rose-700">
                <FileText size={14} strokeWidth={2.4} />
              </span>
              PDF
            </Button>
          </div>

          {performanceError ? (
            <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{performanceError}</p>
          ) : null}
        </section>

        <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Agendamentos</p>
            <p className="mt-1 text-xl font-black text-slate-800">{performance?.totalAppointments ?? 0}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Concluidos</p>
            <p className="mt-1 text-xl font-black text-slate-800">{performance?.completedAppointments ?? 0}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cancelados</p>
            <p className="mt-1 text-xl font-black text-slate-800">{performance?.cancelledAppointments ?? 0}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ocupacao</p>
            <p className="mt-1 text-xl font-black text-slate-800">{percent(performance?.occupancyRatePercent ?? 0)}</p>
          </article>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 sm:p-6">
        <div className="mb-1 flex items-center gap-2">
          <BarChart3 size={18} className="text-pink-600" />
          <p className="font-semibold text-slate-700">Relatorios</p>
        </div>
        <h3 className="text-2xl font-black text-slate-800">Central de analises</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setView('financial');
            void loadFinancial();
          }}
          className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-slate-50"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-pink-50 p-2 text-pink-600"><Wallet size={18} /></span>
              <div>
                <p className="font-semibold text-slate-800">Financeiro</p>
                <p className="text-xs text-slate-500">Resumo de receitas e recebimentos</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setView('performance');
            void loadPerformance();
          }}
          className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-slate-50"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-sky-50 p-2 text-sky-600"><LineChart size={18} /></span>
              <div>
                <p className="font-semibold text-slate-800">Desempenho</p>
                <p className="text-xs text-slate-500">Indicadores operacionais da clinica</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
        </button>
      </div>
    </div>
  );
};
