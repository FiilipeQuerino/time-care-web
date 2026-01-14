
import React, { useState } from 'react';
import { 
  Heart, 
  Clock, 
  Plus, 
  Edit2, 
  ToggleLeft, 
  ToggleRight, 
  Trash2, 
  X, 
  DollarSign, 
  Check, 
  LayoutGrid,
  Info
} from 'lucide-react';
import { Service } from '../../types';

const Servicos: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Limpeza de Pele Profunda', price: 'R$ 180', duration: 60, category: 'Facial', active: true },
    { id: 2, name: 'Drenagem Linfática', price: 'R$ 150', duration: 50, category: 'Corporal', active: true },
    { id: 3, name: 'Toxina Botulínica (Botox)', price: 'R$ 1.200', duration: 30, category: 'Estética', active: true },
    { id: 4, name: 'Preenchimento Labial', price: 'R$ 1.500', duration: 45, category: 'Estética', active: true },
    { id: 5, name: 'Peeling Químico', price: 'R$ 250', duration: 40, category: 'Facial', active: true },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 30,
    category: 'Facial' as 'Facial' | 'Corporal' | 'Estética'
  });

  const toggleService = (id: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este procedimento?')) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const newService: Service = {
      id: Date.now(),
      name: formData.name,
      price: `R$ ${formData.price}`,
      duration: Number(formData.duration),
      category: formData.category,
      active: true
    };

    setServices([newService, ...services]);
    setShowModal(false);
    setFormData({ name: '', price: '', duration: 30, category: 'Facial' });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Serviços</h2>
          <p className="text-slate-500 mt-1">Gerencie o catálogo de tratamentos da sua clínica.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-pink-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all flex items-center gap-2 font-bold transform hover:scale-[1.02] active:scale-95"
        >
          <Plus size={22} /> Novo Procedimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className={`bg-white p-6 rounded-[2.5rem] border transition-all group relative overflow-hidden ${service.active ? 'border-rose-50 shadow-sm' : 'border-slate-100 opacity-60 grayscale'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl transition-all duration-500 ${service.active ? 'bg-pink-50 text-pink-500 group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-pink-100' : 'bg-slate-100 text-slate-400'}`}>
                <Heart size={24} className={service.active ? 'fill-current' : ''} />
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-slate-300 hover:text-blue-500 transition-colors" title="Editar">
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => toggleService(service.id)}
                  className={`p-2 transition-colors ${service.active ? 'text-emerald-400 hover:text-emerald-600' : 'text-slate-400 hover:text-emerald-500'}`}
                  title={service.active ? 'Inativar' : 'Ativar'}
                >
                  {service.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors" 
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                   service.category === 'Estética' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                   service.category === 'Corporal' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-pink-50 text-pink-600 border-pink-100'
                }`}>
                  {service.category}
                </span>
                <h3 className="text-xl font-bold text-slate-800 mt-3 group-hover:text-pink-500 transition-colors line-clamp-1">{service.name}</h3>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-rose-50/50">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                  <Clock size={16} className="text-pink-300" /> {service.duration} min
                </div>
                <div className="text-2xl font-display font-black text-slate-900 group-hover:scale-105 transition-transform origin-right">
                  {service.price}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-10 text-white flex justify-between items-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-bold">Novo Procedimento</h3>
                <p className="text-pink-100 text-sm font-medium mt-1 flex items-center gap-2">
                  <LayoutGrid size={14} /> Adicione um novo item ao seu catálogo
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-3 hover:bg-white/20 rounded-2xl transition-all relative z-10 group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nome do Procedimento</label>
                  <div className="relative">
                    <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
                    <input 
                      autoFocus
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Microagulhamento Facial"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Preço Sugerido (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                    <input 
                      required
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0,00"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Duração Estimada</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                    <select 
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700 appearance-none"
                    >
                      <option value={30}>30 minutos</option>
                      <option value={45}>45 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={90}>1 hora e 30 min</option>
                      <option value={120}>2 horas</option>
                      <option value={180}>3 horas</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Categoria</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Facial', 'Corporal', 'Estética'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat as any })}
                        className={`py-3 rounded-2xl font-bold text-sm transition-all border-2 ${
                          formData.category === cat 
                            ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-100' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-pink-200 hover:text-pink-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
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
                  <Check size={20} /> Salvar Procedimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Servicos;
