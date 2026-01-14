
import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, CreditCard, Wallet } from 'lucide-react';

const Financeiro: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-800">Financeiro</h2>
        <p className="text-slate-500 mt-1">Acompanhe seu fluxo de caixa e faturamento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-emerald-50 w-24 h-24 rounded-full transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl w-fit mb-4">
              <ArrowUpRight size={24} />
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">Entradas (Mês)</p>
            <p className="text-2xl font-black text-slate-800 tracking-tight">R$ 28.450,00</p>
            <p className="text-xs text-emerald-500 font-bold mt-2">▲ 12% vs mês anterior</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-rose-50 w-24 h-24 rounded-full transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="bg-rose-100 text-rose-600 p-3 rounded-2xl w-fit mb-4">
              <ArrowDownRight size={24} />
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">Saídas (Mês)</p>
            <p className="text-2xl font-black text-slate-800 tracking-tight">R$ 12.120,00</p>
            <p className="text-xs text-rose-400 font-bold mt-2">▼ 5% vs mês anterior</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-6 rounded-3xl shadow-lg shadow-pink-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full"></div>
          <div className="relative text-white">
            <div className="bg-white/20 p-3 rounded-2xl w-fit mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-white/70 text-sm font-medium mb-1">Lucro Estimado</p>
            <p className="text-2xl font-black tracking-tight">R$ 16.330,00</p>
            <p className="text-xs text-white/80 font-bold mt-2">Saldo em conta atualizado</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-rose-50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-rose-50">
          <h3 className="text-lg font-bold text-slate-800">Últimas Transações</h3>
        </div>
        <div className="divide-y divide-rose-50">
          {[
            { id: 1, type: 'In', desc: 'Preenchimento Labial - Ana Souza', value: 'R$ 1.500', method: 'Cartão de Crédito', date: 'Hoje, 14:30' },
            { id: 2, type: 'Out', desc: 'Compra de Insumos - Fornecedor X', value: 'R$ 2.450', method: 'Boleto', date: 'Hoje, 10:15' },
            { id: 3, type: 'In', desc: 'Limpeza de Pele - Carlos Lima', value: 'R$ 180', method: 'PIX', date: 'Ontem, 16:45' },
          ].map(t => (
            <div key={t.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-2xl ${t.type === 'In' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-400'}`}>
                  {t.type === 'In' ? <ArrowUpRight size={20}/> : <ArrowDownRight size={20}/>}
                </div>
                <div>
                  <p className="font-bold text-slate-700">{t.desc}</p>
                  <p className="text-xs text-slate-400">{t.date} • {t.method}</p>
                </div>
              </div>
              <div className={`text-lg font-black ${t.type === 'In' ? 'text-emerald-500' : 'text-rose-400'}`}>
                {t.type === 'In' ? '+' : '-'} {t.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Financeiro;
