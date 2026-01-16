
import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Plus, 
  Lock, 
  X, 
  User, 
  Briefcase, 
  Share2, 
  CalendarDays, 
  Trash2, 
  Ban, 
  MessageCircle,
  CalendarCheck2
} from 'lucide-react';
import { Appointment, Service } from '../../types';
import CustomDialog from '../CustomDialog';
import SuccessToast, { ToastType } from '../SuccessToast';
import ShareModal from '../ShareModal';

const PX_PER_MIN = 1.5;

const Agenda: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, date: new Date().toISOString().split('T')[0], time: '10:00', endTime: '11:00', client: 'Ana Beatriz', service: 'Limpeza de Pele', duration: 60, type: 'facial', status: 'confirmed' },
    { id: 2, date: new Date().toISOString().split('T')[0], time: '16:30', endTime: '17:30', client: 'Marina Silva', service: 'Botox', duration: 60, type: 'estetica', status: 'confirmed' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [searchClient, setSearchClient] = useState('');
  const [selectedService, setSelectedService] = useState<string>('');

  const [conflictDialog, setConflictDialog] = useState<{ isOpen: boolean; app?: Appointment; pendingNewApp?: Appointment }>({ isOpen: false });
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id?: number }>({ isOpen: false });
  const [closeDayDialog, setCloseDayDialog] = useState(false);
  const [successToast, setSuccessToast] = useState({ isVisible: false, message: '', type: 'success' as ToastType });
  const [shareModal, setShareModal] = useState(false);

  const servicesList: Service[] = [
    { id: 1, name: 'Limpeza de Pele', price: '180', duration: 60, category: 'Facial', active: true },
    { id: 2, name: 'Drenagem 50min', price: '150', duration: 50, category: 'Corporal', active: true },
    { id: 3, name: 'Botox Express', price: '800', duration: 30, category: 'Estética', active: true },
    { id: 4, name: 'Preenchimento Completo', price: '2500', duration: 180, category: 'Estética', active: true },
    { id: 5, name: 'Massagem Relaxante', price: '120', duration: 40, category: 'Corporal', active: true },
  ];

  const currentDateKey = currentDate.toISOString().split('T')[0];
  const dailyAppointments = useMemo(() => appointments.filter(app => app.date === currentDateKey), [appointments, currentDateKey]);

  const getCarouselDays = () => {
    const days: Date[] = [];
    const start = new Date();
    for (let i = 0; i < 14; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  const handleOpenModal = (time: string, app?: Appointment) => {
    if (app && app.type === 'block') return;
    if (app) {
      setEditingId(app.id);
      setSearchClient(app.client);
      setSelectedService(app.service);
      setSelectedTime(app.time);
    } else {
      setEditingId(null);
      setSearchClient('');
      setSelectedService('');
      setSelectedTime(time);
    }
    setShowModal(true);
  };

  const executeSave = (newApp: Appointment, replaceId?: number) => {
    const isEdit = !!editingId;
    const isReplace = !!replaceId;

    setAppointments(prev => {
      let filtered = prev;
      if (editingId) filtered = filtered.filter(a => a.id !== editingId);
      if (replaceId) filtered = filtered.filter(a => a.id !== replaceId);
      return [...filtered, newApp];
    });
    
    setShowModal(false);
    setSuccessToast({ 
      isVisible: true, 
      message: isReplace ? 'Sobreposição Concluída!' : (isEdit ? 'Agenda Atualizada!' : 'Novo Horário Agendado!'),
      type: isEdit ? 'edit' : 'success'
    });
  };

  const saveAppointment = () => {
    const service = servicesList.find(s => s.name === selectedService);
    if (!service || !searchClient) return;

    const [h, m] = selectedTime.split(':').map(Number);
    const startMins = h * 60 + m;
    const endMins = startMins + service.duration;
    const endTimeStr = `${Math.floor(endMins/60).toString().padStart(2,'0')}:${(endMins%60).toString().padStart(2,'0')}`;

    const overlapping = dailyAppointments.find(app => {
      if (editingId && app.id === editingId) return false;
      const [sh, sm] = app.time.split(':').map(Number);
      const [eh, em] = app.endTime.split(':').map(Number);
      const aStart = sh * 60 + sm;
      const aEnd = eh * 60 + em;
      return (startMins < aEnd) && (endMins > aStart);
    });

    const newApp: Appointment = {
      id: editingId || Date.now(),
      date: currentDateKey,
      time: selectedTime,
      endTime: endTimeStr,
      client: searchClient,
      service: service.name,
      duration: service.duration,
      type: service.category.toLowerCase() as any,
      status: 'confirmed'
    };

    if (overlapping) {
      setConflictDialog({ isOpen: true, app: overlapping, pendingNewApp: newApp });
    } else {
      executeSave(newApp);
    }
  };

  const hasAppointments = (date: Date) => {
    const key = date.toISOString().split('T')[0];
    return appointments.some(a => a.date === key && a.type !== 'block');
  };

  const isBlocked = (date: Date) => {
    const key = date.toISOString().split('T')[0];
    return appointments.some(a => a.date === key && a.type === 'block');
  };

  const handleDelete = () => {
    if (deleteDialog.id) {
       setAppointments(prev => prev.filter(a => a.id !== deleteDialog.id));
       setDeleteDialog({ isOpen: false });
       setSuccessToast({ isVisible: true, message: 'Horário Removido!', type: 'delete' });
    }
  };

  const toggleBlockDay = () => {
    if (isBlocked(currentDate)) {
      setAppointments(prev => prev.filter(a => !(a.date === currentDateKey && a.type === 'block')));
      setSuccessToast({ isVisible: true, message: 'Agenda Liberada!', type: 'edit' });
    } else {
      const blockApp: Appointment = {
        id: Date.now(),
        date: currentDateKey,
        time: '08:00',
        endTime: '22:00',
        client: 'DIA BLOQUEADO',
        service: 'Indisponível',
        duration: 840,
        type: 'block',
        status: 'canceled'
      };
      // Deleta todos os agendamentos do dia ao bloquear
      setAppointments(prev => [...prev.filter(a => a.date !== currentDateKey), blockApp]);
      setSuccessToast({ isVisible: true, message: 'Agenda Fechada!', type: 'delete' });
    }
    setCloseDayDialog(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 relative pb-20">
      
      <SuccessToast 
        isVisible={successToast.isVisible} 
        onClose={() => setSuccessToast({ ...successToast, isVisible: false })}
        message={successToast.message}
        type={successToast.type}
      />

      <CustomDialog 
        isOpen={conflictDialog.isOpen}
        title="Substituir Horário?"
        message={`Conflito com ${conflictDialog.app?.client}. Ao confirmar, o horário anterior será APAGADO.`}
        confirmText="Confirmar Troca"
        onConfirm={() => {
          if (conflictDialog.pendingNewApp && conflictDialog.app) executeSave(conflictDialog.pendingNewApp, conflictDialog.app.id);
          setConflictDialog({ isOpen: false });
        }}
        onCancel={() => setConflictDialog({ isOpen: false })}
      />

      <CustomDialog 
        isOpen={deleteDialog.isOpen}
        title="Deseja Excluir?"
        message="O agendamento da cliente será removido permanentemente da sua lista."
        confirmText="Sim, Deletar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false })}
      />

      <CustomDialog 
        isOpen={closeDayDialog}
        title={isBlocked(currentDate) ? "Liberar Agenda?" : "Fechar Agenda?"}
        message={isBlocked(currentDate) ? "Deseja reabrir este dia para novos agendamentos?" : "Todos os horários marcados hoje serão EXCLUÍDOS. Confirmar?"}
        confirmText={isBlocked(currentDate) ? "Liberar Agora" : "Bloquear Tudo"}
        onConfirm={toggleBlockDay}
        onCancel={() => setCloseDayDialog(false)}
      />

      {/* Header Premium */}
      <div className="bg-white p-6 md:p-10 rounded-[4rem] border border-rose-50 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
           <CalendarDays size={180} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 relative z-10">
          <div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-pink-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-pink-100">
                <CalendarDays size={32} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Agenda <span className="text-pink-400 italic font-medium">Care</span></h2>
                <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] mt-1 ml-1 flex items-center gap-2">
                  <Clock size={12} /> {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShareModal(true)} 
              className="flex-1 md:flex-none bg-white text-pink-500 px-8 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-50 transition-all active:scale-95 border-2 border-rose-50 shadow-sm"
            >
              <Share2 size={18} strokeWidth={2.5} /> Espelho da Agenda
            </button>
            <button 
              onClick={() => setCloseDayDialog(true)} 
              className={`flex-1 md:flex-none px-8 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 border-2 ${
                isBlocked(currentDate) 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                  : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
              }`}
            >
              {isBlocked(currentDate) ? <CalendarCheck2 size={18} /> : <Ban size={18} />}
              {isBlocked(currentDate) ? 'Abrir Agenda' : 'Bloquear Dia'}
            </button>
          </div>
        </div>

        {/* 14 Days Carousel */}
        <div className="relative z-10">
          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x px-1">
            {getCarouselDays().map((day, idx) => {
              const isSelected = day.toDateString() === currentDate.toDateString();
              const occupied = hasAppointments(day);
              const blocked = isBlocked(day);
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentDate(day)}
                  className={`min-w-[95px] snap-start rounded-[2.8rem] p-7 text-center transition-all duration-300 relative border-2 ${
                    isSelected 
                      ? 'bg-pink-500 border-pink-500 text-white shadow-2xl shadow-pink-200 scale-105 z-20' 
                      : blocked 
                        ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 grayscale'
                        : 'bg-white border-slate-50 text-slate-400 hover:border-pink-100 hover:bg-rose-50/40'
                  }`}
                >
                  <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isSelected ? 'text-pink-100' : 'text-slate-400'}`}>
                    {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </p>
                  <p className="text-3xl font-black leading-none">{day.getDate()}</p>
                  
                  {blocked ? (
                    <div className="absolute -top-1 -right-1 bg-slate-400 text-white p-1 rounded-full border-2 border-white shadow-sm">
                      <Lock size={10} strokeWidth={4} />
                    </div>
                  ) : occupied && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white shadow-[0_0_12px_white]' : 'bg-pink-500 shadow-[0_0_8px_rgba(244,114,182,0.8)] animate-pulse'}`} />
                    </div>
                  )}
                  {isToday && !isSelected && (
                     <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black text-pink-500 uppercase tracking-tighter">Hoje</div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
        </div>
      </div>

      {/* Agenda Grid Area */}
      <div className={`bg-white rounded-[4rem] border border-rose-50 shadow-sm relative overflow-hidden transition-all duration-500 ${isBlocked(currentDate) ? 'opacity-40 grayscale pointer-events-none scale-[0.99]' : ''}`} style={{ minHeight: '1100px' }}>
        {isBlocked(currentDate) && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-white/80 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-slate-100 shadow-2xl flex flex-col items-center gap-4">
               <Lock size={48} className="text-slate-400 animate-bounce" />
               <p className="font-black text-slate-500 uppercase tracking-[0.2em] text-sm">Agenda Fechada para este dia</p>
            </div>
          </div>
        )}

        <div className="relative">
          {timeSlots.map((time) => (
            <div key={time} className={`flex border-b border-rose-50/10 ${time.endsWith(':00') ? 'bg-white' : 'bg-slate-50/10'}`} style={{ height: `${30 * PX_PER_MIN}px` }}>
              <div className="w-20 md:w-32 border-r border-rose-50/30 flex items-center justify-center">
                <span className={`text-[11px] font-black tracking-tighter ${time.endsWith(':00') ? 'text-slate-500' : 'text-slate-300'}`}>{time}</span>
              </div>
              <div className="flex-1 relative group">
                {!isBlocked(currentDate) && (
                  <button 
                    onClick={() => handleOpenModal(time)} 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-pink-50/20 flex items-center justify-center transition-all z-0"
                  >
                    <div className="bg-white p-4 rounded-full shadow-2xl text-pink-500 active:scale-90 transition-transform">
                      <Plus size={24} strokeWidth={3} />
                    </div>
                  </button>
                )}
              </div>
            </div>
          ))}

          {dailyAppointments.map((app) => (
            <div 
              key={app.id}
              onClick={() => handleOpenModal(app.time, app)}
              className={`absolute left-20 md:left-32 right-4 rounded-[3rem] border-l-[14px] shadow-sm p-7 overflow-hidden animate-in zoom-in-95 duration-200 cursor-pointer group active:scale-[0.98] transition-all ring-1 ring-black/5 ring-inset ${
                app.type === 'facial' ? 'bg-pink-50/90 border-pink-400 text-pink-950' :
                app.type === 'corporal' ? 'bg-blue-50/90 border-blue-400 text-blue-950' :
                app.type === 'estetica' ? 'bg-purple-50/90 border-purple-400 text-purple-950' : 
                app.type === 'block' ? 'bg-slate-100 border-slate-500 text-slate-800 opacity-80' : 
                'bg-slate-50/90 border-slate-500 text-slate-800'
              }`}
              style={{ 
                top: `${((parseInt(app.time.split(':')[0]) - 8) * 60 + parseInt(app.time.split(':')[1])) * PX_PER_MIN}px`, 
                height: `${app.duration * PX_PER_MIN}px`, 
                zIndex: 10, 
                width: 'calc(100% - 150px)' 
              }}
            >
              <div className="flex justify-between items-start h-full">
                <div className="flex-1 truncate">
                   <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-[1.2rem] bg-white/70 flex items-center justify-center text-current/80 shadow-inner">
                        {app.type === 'block' ? <Lock size={20} /> : <User size={20} />}
                      </div>
                      <div className="truncate">
                        <p className="font-black text-base md:text-2xl tracking-tighter leading-none mb-1">{app.client}</p>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">{app.service}</p>
                      </div>
                   </div>
                   <div className="flex gap-3 ml-16 mt-2">
                     <span className="text-[10px] font-black bg-white/40 px-4 py-1.5 rounded-full uppercase tracking-widest">{app.time} - {app.endTime} • {app.duration}m</span>
                   </div>
                </div>
                
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeleteDialog({ isOpen: true, id: app.id }); }} 
                    className="p-5 bg-white/80 hover:bg-rose-500 hover:text-white backdrop-blur-3xl rounded-[1.8rem] text-rose-500 shadow-2xl shadow-rose-200 border border-white/80 active:scale-90 transition-all"
                  >
                    <Trash2 size={24} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Moderno com Animações Mais Rápidas */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className={`p-10 text-white flex justify-between items-start relative overflow-hidden ${editingId ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600' : 'bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600'}`}>
              <div className="relative z-10">
                <h3 className="text-4xl font-black tracking-tighter mb-4">{editingId ? 'Refinar Horário' : 'Novo Registro'}</h3>
                <div className="flex gap-3">
                  <p className="text-white text-[12px] font-black uppercase tracking-widest bg-black/10 px-6 py-3 rounded-[1.5rem] flex items-center gap-2 backdrop-blur-md border border-white/10">
                    <Clock size={16} /> {selectedTime}
                  </p>
                  <p className="text-white text-[12px] font-black uppercase tracking-widest bg-black/10 px-6 py-3 rounded-[1.5rem] flex items-center gap-2 backdrop-blur-md border border-white/10">
                    <CalendarCheck2 size={16} /> {currentDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-5 hover:bg-white/20 rounded-[1.8rem] transition-all relative z-10"
              >
                <X size={36} strokeWidth={3} />
              </button>
              <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
            </div>
            
            <div className="p-10 space-y-10">
              <div className="space-y-4">
                <label className="text-[12px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2">
                  <User size={16} className="text-pink-400" /> Paciente / Cliente
                </label>
                <input 
                  autoFocus
                  value={searchClient} 
                  onChange={(e) => setSearchClient(e.target.value)} 
                  placeholder="Nome completo da cliente" 
                  className="w-full px-10 py-7 bg-slate-50 border-2 border-transparent rounded-[2.8rem] focus:bg-white focus:border-pink-200 focus:ring-8 focus:ring-pink-50 outline-none font-bold text-slate-800 transition-all text-xl shadow-inner placeholder:text-slate-300" 
                />
              </div>

              <div className="space-y-4">
                <label className="text-[12px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2">
                  <Briefcase size={16} className="text-pink-400" /> Procedimento Care
                </label>
                <div className="grid gap-4 max-h-64 overflow-y-auto pr-4 scrollbar-hide">
                  {servicesList.map(s => (
                    <button 
                      key={s.id} 
                      onClick={() => setSelectedService(s.name)} 
                      className={`flex justify-between items-center p-7 rounded-[3rem] border-2 transition-all active:scale-[0.96] ${
                        selectedService === s.name 
                          ? 'border-pink-500 bg-pink-50/50 shadow-2xl shadow-pink-100/40' 
                          : 'border-slate-50 bg-white hover:border-pink-100 hover:bg-rose-50/10'
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-black text-base text-slate-800 tracking-tight">{s.name}</p>
                        <p className="text-[11px] font-black text-pink-400 uppercase tracking-[0.1em]">{s.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-lg">R$ {s.price}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{s.duration} min</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={saveAppointment} 
                disabled={!searchClient || !selectedService} 
                className={`w-full py-8 text-white rounded-[3.2rem] font-black uppercase tracking-[0.3em] text-base shadow-2xl hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none mt-6 ${
                  editingId 
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-600 shadow-indigo-200' 
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-200'
                }`}
              >
                {editingId ? 'Confirmar Mudanças' : 'Agendar Agora'}
              </button>
            </div>
          </div>
        </div>
      )}

      {shareModal && (
        <ShareModal 
          isOpen={shareModal} 
          onClose={() => setShareModal(false)} 
          shareUrl={`https://timecare.app/espelho/${currentDateKey}`} 
        />
      )}
    </div>
  );
};

export default Agenda;
