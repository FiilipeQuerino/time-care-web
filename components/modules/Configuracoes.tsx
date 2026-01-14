
import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronRight, 
  ChevronLeft, 
  Camera, 
  Check, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Smartphone,
  MessageSquare,
  Package,
  BarChart2,
  FileText
} from 'lucide-react';

type ConfigSection = 'main' | 'profile' | 'clinic' | 'notifications' | 'security' | 'whatsapp';

const Configuracoes: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ConfigSection>('main');

  const mainSections = [
    { id: 'profile' as ConfigSection, icon: <User />, title: 'Meu Perfil', desc: 'Dados pessoais e senha', color: 'text-blue-500 bg-blue-50' },
    { id: 'clinic' as ConfigSection, icon: <Building />, title: 'Dados da Clínica', desc: 'CNPJ, Endereço e Logotipo', color: 'text-pink-500 bg-pink-50' },
    { id: 'whatsapp' as ConfigSection, icon: <MessageSquare />, title: 'Automação WhatsApp', desc: 'Lembretes e templates', color: 'text-emerald-500 bg-emerald-50' },
    { id: 'notifications' as ConfigSection, icon: <Bell />, title: 'Notificações', desc: 'Alertas de agenda e estoque', color: 'text-amber-500 bg-amber-50' },
    { id: 'security' as ConfigSection, icon: <Shield />, title: 'Privacidade & Segurança', desc: 'Logs de acesso e permissões', color: 'text-slate-500 bg-slate-50' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSettings onBack={() => setActiveSection('main')} />;
      case 'clinic': return <ClinicSettings onBack={() => setActiveSection('main')} />;
      case 'notifications': return <NotificationSettings onBack={() => setActiveSection('main')} />;
      case 'whatsapp': return <WhatsAppSettings onBack={() => setActiveSection('main')} />;
      default:
        return (
          <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
            {mainSections.map((section, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveSection(section.id)}
                className="w-full bg-white p-6 rounded-[2rem] border border-rose-50 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-5 text-left">
                  <div className={`p-4 rounded-[1.5rem] transition-colors ${section.color}`}>
                    {React.cloneElement(section.icon as React.ReactElement<any>, { size: 24 })}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg tracking-tight">{section.title}</h4>
                    <p className="text-slate-400 text-sm font-medium">{section.desc}</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-pink-400 transition-colors" />
              </button>
            ))}

            <button className="w-full mt-12 bg-rose-50 text-rose-500 p-6 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-rose-100 transition-all border border-rose-100">
              <LogOut size={20} /> Sair do Sistema
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-4 md:px-0">
        <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Ajustes</h2>
        <p className="text-slate-500 mt-1 font-medium">Configure as preferências do seu Time Care.</p>
      </div>
      {renderContent()}
    </div>
  );
};

/* --- Sub-Components --- */

const WhatsAppSettings = ({ onBack }: { onBack: () => void }) => (
  <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 px-4 md:px-0">
    <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-pink-500 font-bold text-sm transition-colors mb-4 uppercase tracking-widest">
      <ChevronLeft size={18} /> Voltar
    </button>

    <div className="bg-white rounded-[2.5rem] border border-rose-50 p-8 shadow-sm space-y-8">
      <div className="border-b border-rose-50 pb-6">
        <h3 className="text-xl font-bold text-slate-800">Modelos de Mensagem</h3>
        <p className="text-sm text-slate-400 font-medium">Defina os textos padrão para envio via WhatsApp.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirmação de Agendamento</label>
          <textarea 
            className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-medium text-slate-700 h-32 resize-none"
            defaultValue="Olá {{cliente}}! Seu agendamento para {{servico}} está confirmado para às {{horario}}. ✨ Mal podemos esperar para cuidar de você!"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Lembrete de Retorno (30 dias)</label>
          <textarea 
            className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-medium text-slate-700 h-32 resize-none"
            defaultValue="Oi {{cliente}}! Faz um mês que você realizou {{servico}}. Que tal agendar sua manutenção hoje? ❤️"
          />
        </div>

        <div className="flex gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
           <FileText className="text-emerald-500 shrink-0" size={20} />
           <p className="text-xs text-emerald-700 leading-relaxed font-medium">
             {/* Fix literal curly braces in JSX by wrapping them in strings */}
             Dica: Use <b>{"{{cliente}}"}</b>, <b>{"{{horario}}"}</b> e <b>{"{{servico}}"}</b> para que o sistema preencha automaticamente os dados antes de abrir o WhatsApp.
           </p>
        </div>
      </div>

      <button className="w-full py-5 bg-pink-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-2">
        <Check size={20} /> Atualizar Templates
      </button>
    </div>
  </div>
);

// Reuse previous Profile, Clinic, Notifications components with subtle layout fixes for mobile
const ProfileSettings = ({ onBack }: { onBack: () => void }) => (
  <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 px-4 md:px-0">
    <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-pink-500 font-bold text-sm transition-colors mb-4 uppercase tracking-widest">
      <ChevronLeft size={18} /> Voltar
    </button>
    <div className="bg-white rounded-[2.5rem] border border-rose-50 p-8 shadow-sm space-y-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative group">
          <img src="https://picsum.photos/id/64/200/200" alt="Avatar" className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-xl group-hover:opacity-80 transition-opacity" />
          <button className="absolute bottom-1 right-1 bg-pink-500 text-white p-2.5 rounded-2xl shadow-lg border-2 border-white hover:scale-110 transition-transform">
            <Camera size={18} />
          </button>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold text-slate-800">Dra. Ana Silva</h3>
          <p className="text-xs font-black text-pink-400 uppercase tracking-[0.2em] mt-1">Esteta Master</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">E-mail</label>
          <input defaultValue="ana.silva@timecare.com" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp</label>
          <input defaultValue="(11) 98765-4321" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700" />
        </div>
      </div>
      <button className="w-full py-5 bg-pink-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-2">
        <Check size={20} /> Salvar Perfil
      </button>
    </div>
  </div>
);

const ClinicSettings = ({ onBack }: { onBack: () => void }) => (
  <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 px-4 md:px-0">
    <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-pink-500 font-bold text-sm transition-colors mb-4 uppercase tracking-widest">
      <ChevronLeft size={18} /> Voltar
    </button>
    <div className="bg-white rounded-[2.5rem] border border-rose-50 p-8 shadow-sm space-y-8">
      <div className="flex gap-6 items-center">
        <div className="w-24 h-24 bg-pink-50 rounded-[2rem] flex items-center justify-center text-pink-500 border-2 border-pink-100 border-dashed">
          <Camera size={24} />
        </div>
        <div>
           <h3 className="text-xl font-bold text-slate-800">Time Care Clinic</h3>
           <p className="text-sm text-slate-400 font-medium">Sua identidade visual.</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Endereço</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
            <input defaultValue="Av. Paulista, 1000 - SP" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700" />
          </div>
        </div>
      </div>
      <button className="w-full py-5 bg-slate-800 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-slate-100">
        Atualizar Clínica
      </button>
    </div>
  </div>
);

const NotificationSettings = ({ onBack }: { onBack: () => void }) => {
  const [switches, setSwitches] = useState({ whatsapp: true, email: false, stock: true });
  const toggle = (key: keyof typeof switches) => setSwitches(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 px-4 md:px-0">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-pink-500 font-bold text-sm transition-colors mb-4 uppercase tracking-widest">
        <ChevronLeft size={18} /> Voltar
      </button>
      <div className="bg-white rounded-[2.5rem] border border-rose-50 p-8 shadow-sm space-y-6">
        <div className="border-b border-rose-50 pb-6 mb-2">
          <h3 className="text-xl font-bold text-slate-800">Canais de Notificação</h3>
          <p className="text-sm text-slate-400 font-medium">Escolha como quer ser alertada.</p>
        </div>
        <div className="space-y-4">
          {[
            { id: 'whatsapp', label: 'Lembretes WhatsApp', icon: <MessageSquare size={20} /> },
            { id: 'stock', label: 'Alertas de Estoque', icon: <Package size={20} /> },
            { id: 'email', label: 'Relatórios E-mail', icon: <Mail size={20} /> },
          ].map(item => (
            <div key={item.id} className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50/50 border border-transparent hover:border-rose-100 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${switches[item.id as keyof typeof switches] ? 'bg-pink-100 text-pink-500' : 'bg-slate-200 text-slate-400'}`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-slate-700 text-sm">{item.label}</h4>
              </div>
              <button onClick={() => toggle(item.id as keyof typeof switches)} className={`w-12 h-7 rounded-full relative transition-all duration-300 ${switches[item.id as keyof typeof switches] ? 'bg-pink-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${switches[item.id as keyof typeof switches] ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
