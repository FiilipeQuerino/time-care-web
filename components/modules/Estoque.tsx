
import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  Search, 
  PlusCircle, 
  MinusCircle, 
  Edit3, 
  Trash2, 
  X, 
  Check,
  Layers,
  BarChart2
} from 'lucide-react';

interface EstoqueItem {
  id: number;
  name: string;
  category: string;
  qty: number;
  unit: string;
  min: number;
}

const Estoque: React.FC = () => {
  const [items, setItems] = useState<EstoqueItem[]>([
    { id: 1, name: 'Ácido Hialurônico 1ml', category: 'Injetáveis', qty: 12, unit: 'Seringas', min: 5 },
    { id: 2, name: 'Luvas Nitrílicas M', category: 'Descartáveis', qty: 3, unit: 'Caixas', min: 10 },
    { id: 3, name: 'Agulhas 30G', category: 'Agulhas', qty: 14, unit: 'Unidades', min: 30 },
    { id: 4, name: 'Soro Fisiológico 500ml', category: 'Insumos', qty: 8, unit: 'Frascos', min: 4 },
    { id: 5, name: 'Toxina Botulínica 100u', category: 'Injetáveis', qty: 2, unit: 'Frascos', min: 5 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EstoqueItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Insumos',
    qty: 0,
    unit: 'Unidades',
    min: 0
  });

  const getStatus = (qty: number, min: number) => {
    if (qty <= min * 0.5) return { label: 'Crítico', color: 'bg-rose-100 text-rose-600 border-rose-200' };
    if (qty <= min) return { label: 'Atenção', color: 'bg-amber-100 text-amber-600 border-amber-200' };
    return { label: 'Normal', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' };
  };

  const criticalCount = items.filter(item => item.qty <= item.min * 0.5).length;

  const handleOpenModal = (item?: EstoqueItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        qty: item.qty,
        unit: item.unit,
        min: item.min
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: 'Insumos',
        qty: 0,
        unit: 'Unidades',
        min: 0
      });
    }
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
    } else {
      setItems([...items, { id: Date.now(), ...formData }]);
    }
    setShowModal(false);
  };

  const adjustQty = (id: number, delta: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i));
  };

  const deleteItem = (id: number) => {
    if (window.confirm('Excluir este item do estoque?')) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Estoque</h2>
          <p className="text-slate-500 mt-1">Controle de insumos e materiais técnicos.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-3xl border border-rose-50 shadow-sm flex items-center gap-4">
            <div className={`p-2 rounded-xl ${criticalCount > 0 ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-500'}`}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Itens Críticos</p>
              <p className={`text-xl font-black ${criticalCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{criticalCount}</p>
            </div>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-pink-500 text-white px-6 py-4 rounded-3xl shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all flex items-center gap-2 font-bold transform hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} /> Novo Item
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-rose-50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/50 rounded-full translate-x-16 -translate-y-16"></div>
        <div className="relative flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar no inventário..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-slate-700 font-medium"
            />
          </div>
          <button className="hidden md:flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-pink-500 transition-colors">
            <BarChart2 size={16} /> Relatório de Consumo
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-rose-50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-rose-50">
              <th className="px-6 py-5">Item do Inventário</th>
              <th className="px-6 py-5">Categoria</th>
              <th className="px-6 py-5 text-center">Quantidade Atual</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Gestão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {items.map((item) => {
              const status = getStatus(item.qty, item.min);
              return (
                <tr key={item.id} className="hover:bg-rose-50/20 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mín: {item.min} {item.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-lg">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-4">
                      <button onClick={() => adjustQty(item.id, -1)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <MinusCircle size={22} />
                      </button>
                      <div className="w-16 text-center">
                        <p className="text-lg font-black text-slate-800 leading-none">{item.qty}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{item.unit}</p>
                      </div>
                      <button onClick={() => adjustQty(item.id, 1)} className="text-slate-300 hover:text-emerald-500 transition-colors">
                        <PlusCircle size={22} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-10 text-white flex justify-between items-center relative">
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-bold">{editingItem ? 'Editar Item' : 'Novo Item'}</h3>
                <p className="text-pink-100 text-sm font-medium mt-1 flex items-center gap-2">
                  <Layers size={14} /> Controle preciso para sua clínica.
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white/20 rounded-2xl transition-all group relative z-10">
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nome do Produto</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Luvas de Látex P"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Categoria</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700"
                  >
                    <option>Insumos</option>
                    <option>Injetáveis</option>
                    <option>Descartáveis</option>
                    <option>Cremes/Óleos</option>
                    <option>Limpeza</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Unidade</label>
                  <input 
                    required
                    type="text" 
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Frascos, Seringas..."
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Estoque Atual</label>
                  <input 
                    required
                    type="number" 
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: Number(e.target.value) })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Estoque Mínimo</label>
                  <input 
                    required
                    type="number" 
                    value={formData.min}
                    onChange={(e) => setFormData({ ...formData, min: Number(e.target.value) })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-pink-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95"
                >
                  <Check size={20} /> {editingItem ? 'Salvar Alterações' : 'Cadastrar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estoque;
