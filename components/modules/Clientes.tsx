
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Phone, 
  Mail, 
  Edit3, 
  UserMinus, 
  UserCheck, 
  Trash2, 
  X, 
  User, 
  Check,
  Download,
  Smartphone,
  MessageCircle,
  Import
} from 'lucide-react';
import { Client } from '../../types';

const Clientes: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'Ana Beatriz Souza', email: 'ana.souza@email.com', phone: '(11) 98765-4321', lastVisit: '12 Out 2023', totalSpent: 'R$ 2.450', status: 'Ativo' },
    { id: 2, name: 'Carlos Eduardo Lima', email: 'carlos.lima@email.com', phone: '(11) 91234-5678', lastVisit: '05 Out 2023', totalSpent: 'R$ 890', status: 'Ativo' },
    { id: 3, name: 'Juliana Paes', email: 'ju.paes@email.com', phone: '(11) 99887-7665', lastVisit: '15 Set 2023', totalSpent: 'R$ 5.120', status: 'VIP' },
    { id: 4, name: 'Marina Silva', email: 'marina.s@email.com', phone: '(11) 97766-5544', lastVisit: '01 Set 2023', totalSpent: 'R$ 340', status: 'Inativo' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Ativo' as 'Ativo' | 'Inativo' | 'VIP'
  });

  const handleImportContacts = async () => {
    // Contact Picker API simulation for mobile
    try {
      if ('contacts' in navigator && 'select' in (navigator as any).contacts) {
        const props = ['name', 'tel', 'email'];
        const contacts = await (navigator as any).contacts.select(props, { multiple: true });
        
        if (contacts.length > 0) {
          const newClients = contacts.map((c: any, index: number) => ({
            id: Date.now() + index,
            name: c.name[0] || 'Novo Contato',
            email: c.email ? c.email[0] : '',
            phone: c.tel ? c.tel[0] : '',
            lastVisit: 'Recém Importado',
            totalSpent: 'R$ 0',
            status: 'Ativo'
          }));
          setClients(prev => [...newClients, ...prev]);
          alert(`${contacts.length} contatos importados com sucesso!`);
        }
      } else {
        alert("A importação direta não é suportada neste navegador. Tente em um dispositivo Android/iOS atual.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = "Nome,Email,Telefone,Status,Total Gasto\n";
    const rows = clients.map(c => `${c.name},${c.email},${c.phone},${c.status},${c.totalSpent}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "clientes_timecare.csv";
    link.click();
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const text = encodeURIComponent(`Olá ${name}! Tudo bem? Gostaria de agendar um novo procedimento conosco na Time Care? ✨`);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({ name: client.name, email: client.email, phone: client.phone, status: client.status });
    } else {
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', status: 'Ativo' });
    }
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...formData } : c));
    } else {
      setClients([{ id: Date.now(), ...formData, lastVisit: 'Hoje', totalSpent: 'R$ 0' }, ...clients]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Clientes</h2>
          <p className="text-slate-500 mt-1 font-medium">Sua base de cuidados e beleza.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleImportContacts}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 text-white px-5 py-4 md:py-3 rounded-2xl shadow-xl shadow-slate-100 hover:bg-slate-900 transition-all font-bold"
          >
            <Smartphone size={18} /> Importar do Celular
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-pink-500 text-white px-5 py-4 md:py-3 rounded-2xl shadow-xl shadow-pink-100 hover:bg-pink-600 transition-all font-bold"
          >
            <Plus size={20} /> Novo Cliente
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Nome, e-mail ou telefone..." 
            className="w-full pl-14 pr-4 py-4 bg-white border border-rose-50 shadow-sm rounded-2xl focus:ring-2 focus:ring-pink-100 outline-none text-slate-700 font-semibold"
          />
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-rose-50 text-slate-600 px-6 py-4 rounded-2xl shadow-sm hover:bg-rose-50 transition-all font-bold">
            <Filter size={18} /> Filtros
          </button>
          <button onClick={handleExportCSV} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-rose-50 text-slate-600 px-6 py-4 rounded-2xl shadow-sm hover:bg-rose-50 transition-all font-bold">
            <Download size={18} /> CSV
          </button>
        </div>
      </div>

      {/* Grid view for all devices - Cards are better than tables for small screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-[2.5rem] border border-rose-50 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/50 rounded-full translate-x-8 -translate-y-8"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-pink-100 group-hover:scale-105 transition-transform">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg tracking-tight line-clamp-1">{client.name}</h4>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    client.status === 'VIP' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                    client.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    {client.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <Phone size={14} className="text-pink-300" /> {client.phone}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                  <Mail size={14} className="text-slate-300" /> {client.email}
                </div>
              </div>

              <div className="pt-4 border-t border-rose-50 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Último Consumo</p>
                   <p className="font-bold text-pink-500">{client.totalSpent}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleWhatsApp(client.phone, client.name)} className="p-3 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                    <MessageCircle size={20} />
                  </button>
                  <button onClick={() => handleOpenModal(client)} className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                    <Edit3 size={20} />
                  </button>
                  <button className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - reuse from previous but refined */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           {/* ... Form UI same as before ... */}
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-10 text-white flex justify-between items-center relative">
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-bold">{editingClient ? 'Editar Cliente' : 'Novo Cadastro'}</h3>
                <p className="text-pink-100 text-sm font-medium mt-1">Mantenha sua base de dados atualizada.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white/20 rounded-2xl transition-all group relative z-10">
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Maria Santos"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Telefone / WhatsApp</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700"
                  >
                    <option>Ativo</option>
                    <option>VIP</option>
                    <option>Inativo</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancelar</button>
                 <button type="submit" className="flex-[2] py-4 bg-pink-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95">
                   <Check size={20} /> Salvar Cadastro
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
