
import React from 'react';
import { BarChart3, PieChart, Download, Calendar } from 'lucide-react';

const Relatorios: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Relatórios</h2>
          <p className="text-slate-500 mt-1">Análises detalhadas do seu negócio.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 bg-white border border-rose-100 text-slate-600 px-4 py-2.5 rounded-2xl hover:bg-rose-50 transition-all font-medium">
            <Download size={18} /> PDF
          </button>
          <button className="flex items-center gap-2 bg-pink-500 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all font-medium">
            Gerar Completo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
         <div className="bg-white p-8 rounded-[2.5rem] border border-rose-50 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-8">
              <BarChart3 className="text-pink-500" /> Faturamento por Categoria
            </h3>
            <div className="space-y-6">
               {[
                 { label: 'Procedimentos Faciais', value: 65, color: 'bg-pink-400' },
                 { label: 'Venda de Produtos', value: 25, color: 'bg-rose-300' },
                 { label: 'Corporal / Drenagem', value: 10, color: 'bg-slate-200' },
               ].map((item, idx) => (
                 <div key={idx}>
                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                       <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.value}%` }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-rose-50 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="bg-pink-50 p-6 rounded-full text-pink-500 mb-6">
               <PieChart size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Novas Métricas em Breve</h3>
            <p className="text-slate-400 text-sm max-w-xs">Estamos preparando dashboards de fidelização de clientes e ROI de campanhas.</p>
         </div>
      </div>
    </div>
  );
};

export default Relatorios;
