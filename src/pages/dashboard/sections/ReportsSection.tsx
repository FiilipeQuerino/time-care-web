import { BarChart3, FileSpreadsheet, FileText, LineChart, Wallet } from 'lucide-react';

export const ReportsSection = () => (
  <div className="space-y-5">
    <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 size={18} className="text-pink-600" />
        <p className="font-semibold text-slate-700">Relatorios</p>
      </div>
      <h3 className="text-2xl font-black text-slate-800">Central de analises</h3>
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-pink-50 p-2 text-pink-600"><Wallet size={18} /></span>
          <div>
            <p className="font-semibold text-slate-800">Financeiro</p>
            <p className="text-xs text-slate-500">Resumo de receitas e recebimentos</p>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-sky-50 p-2 text-sky-600"><LineChart size={18} /></span>
          <div>
            <p className="font-semibold text-slate-800">Desempenho</p>
            <p className="text-xs text-slate-500">Indicadores operacionais da clinica</p>
          </div>
        </div>
      </article>

      <button type="button" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-left hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><FileText size={18} /></span>
          <div>
            <p className="font-semibold text-slate-800">Exportar PDF</p>
            <p className="text-xs text-slate-500">Versao resumida para compartilhar</p>
          </div>
        </div>
      </button>

      <button type="button" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-left hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-violet-50 p-2 text-violet-600"><FileSpreadsheet size={18} /></span>
          <div>
            <p className="font-semibold text-slate-800">Exportar Excel/CSV</p>
            <p className="text-xs text-slate-500">Planilha para analise detalhada</p>
          </div>
        </div>
      </button>
    </div>

  </div>
);
