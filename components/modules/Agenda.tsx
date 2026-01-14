
import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Lock, 
  X, 
  User, 
  Briefcase, 
  MoreHorizontal,
} from 'lucide-react';
import { Appointment, Service } from '../../types';


// Pixels per minute for visual representation
const PX_PER_MIN = 1.5;

const Agenda: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  };

  const getCarouselDays = () => {
    const days: Date[] = [];

    for (let i = -3; i <= 3; i++) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, time: '10:00', endTime: '11:00', client: 'Ana Beatriz', service: 'Limpeza de Pele', duration: 60, type: 'facial', status: 'confirmed' },
    { id: 2, time: '14:00', endTime: '14:30', client: 'Ricardo Alves', service: 'Drenagem', duration: 30, type: 'corporal', status: 'pending' },
    { id: 3, time: '16:30', endTime: '17:30', client: 'Marina Silva', service: 'Botox', duration: 60, type: 'estetica', status: 'confirmed' },
    { id: 4, time: '19:00', endTime: '20:00', client: 'Manutenção Equip.', service: 'Equipamento Laser', duration: 60, type: 'block', status: 'finished' },
    { id: 5, time: '21:00', endTime: '22:30', client: 'Juliana Paes', service: 'Protocolo VIP', duration: 90, type: 'estetica', status: 'confirmed' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [searchClient, setSearchClient] = useState('');
  const [selectedService, setSelectedService] = useState<string>('');

  // Simulation data
  const clientsList = ['Ana Beatriz Souza', 'Carlos Eduardo Lima', 'Juliana Paes', 'Marina Silva', 'Roberto Carlos'];
  const servicesList: Service[] = [
    { id: 1, name: 'Limpeza de Pele', price: '180', duration: 60, category: 'Facial', active: true },
    { id: 2, name: 'Drenagem 50min', price: '150', duration: 50, category: 'Corporal', active: true },
    { id: 3, name: 'Botox Express', price: '800', duration: 30, category: 'Estética', active: true },
    { id: 4, name: 'Preenchimento Completo', price: '2500', duration: 180, category: 'Estética', active: true },
    { id: 5, name: 'Massagem Relaxante', price: '120', duration: 40, category: 'Corporal', active: true },
  ];

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 23) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleOpenModal = (time: string) => {
    setSelectedTime(time);
    setShowModal(true);
  };

  const calculateTop = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const minutesFromStart = (h - 8) * 60 + m;
    return minutesFromStart * PX_PER_MIN;
  };

  // Helper to convert time string to total minutes for comparison
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const saveAppointment = () => {
    const service = servicesList.find(s => s.name === selectedService);
    if (!service || !searchClient) return;

    const startMinutes = timeToMinutes(selectedTime);
    const endMinutes = startMinutes + service.duration;
    
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

    // CHECK FOR OVERLAPS
    const overlappingApp = appointments.find(app => {
      const appStart = timeToMinutes(app.time);
      const appEnd = timeToMinutes(app.endTime);
      
      // Overlap logic: (StartA < EndB) && (EndA > StartB)
      return (startMinutes < appEnd) && (endMinutes > appStart);
    });

    if (overlappingApp) {
      const confirmOverlap = window.confirm(
        `Atenção: Este agendamento coincide com o horário de ${overlappingApp.client} (${overlappingApp.time} - ${overlappingApp.endTime}).\n\nDeseja realizar a sobreposição de horários mesmo assim?`
      );
      if (!confirmOverlap) return;
    }

    const newApp: Appointment = {
      id: Date.now(),
      time: selectedTime,
      endTime: endTimeStr,
      client: searchClient,
      service: service.name,
      duration: service.duration,
      type: service.category.toLowerCase() as any,
      status: 'confirmed'
    };

    setAppointments([...appointments, newApp]);
    setShowModal(false);
    setSearchClient('');
    setSelectedService('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Time Care <span className="text-pink-500">Agenda</span></h2>
          <p className="text-slate-500 mt-1">Horário de operação estendido: 08:00 às 23:00</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-lg font-black text-slate-700 capitalize">
              {formatMonthYear(currentDate)}
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {getCarouselDays().map((day, index) => {
              const isSelected =
                day.toDateString() === currentDate.toDateString();

              return (
                <button
                  key={index}
                  onClick={() => setCurrentDate(day)}
                  className={`min-w-[70px] rounded-2xl p-3 text-center transition-all ${
                    isSelected
                      ? 'bg-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white border border-rose-100 text-slate-600 hover:bg-rose-50'
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </p>
                  <p className="text-lg font-black">{day.getDate()}</p>
                </button>
              );
            })}
          </div>

          <button onClick={() => handleOpenModal('08:00')} className="bg-pink-500 text-white px-6 py-2.5 rounded-2xl shadow-lg shadow-pink-100 flex items-center gap-2 font-bold text-sm hover:bg-pink-600 transition-all">
            <Plus size={18} /> Novo Agendamento
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-rose-50 shadow-sm relative overflow-hidden" style={{ minHeight: '1200px' }}>
        <div className="relative">
          {timeSlots.map((time) => {
            const isHour = time.endsWith(':00');
            return (
              <div 
                key={time} 
                className={`flex border-b border-rose-50/30 ${isHour ? 'bg-white' : 'bg-slate-50/20'}`}
                style={{ height: `${30 * PX_PER_MIN}px` }}
              >
                <div className="w-20 md:w-32 border-r border-rose-50 flex items-center justify-center">
                  <span className={`text-[10px] font-black tracking-widest ${isHour ? 'text-slate-500' : 'text-slate-300'}`}>
                    {time}
                  </span>
                </div>
                <div className="flex-1 relative">
                  <button 
                    onClick={() => handleOpenModal(time)}
                    className="absolute inset-0 opacity-0 hover:opacity-100 bg-pink-50/30 flex items-center justify-center transition-opacity"
                  >
                    <Plus size={20} className="text-pink-300" />
                  </button>
                </div>
              </div>
            );
          })}

          {appointments.map((app) => {
            const top = calculateTop(app.time);
            const height = app.duration * PX_PER_MIN;
            const colorClass = 
              app.type === 'facial' ? 'bg-pink-100 text-pink-700 border-pink-400' :
              app.type === 'corporal' ? 'bg-blue-100 text-blue-700 border-blue-400' :
              app.type === 'estetica' ? 'bg-purple-100 text-purple-700 border-purple-400' : 'bg-slate-100 text-slate-600 border-slate-400';

            return (
              <div 
                key={app.id}
                className={`absolute left-20 md:left-32 right-4 rounded-2xl border-l-4 shadow-sm p-3 overflow-hidden animate-in zoom-in-95 duration-300 ${colorClass} group`}
                style={{ top: `${top}px`, height: `${height}px`, zIndex: 10, width: 'calc(100% - 140px)' }}
              >
                <div className="flex justify-between items-start gap-2 h-full">
                  <div className="overflow-hidden">
                    <p className="font-black text-xs md:text-sm truncate flex items-center gap-1.5">
                      {app.type === 'block' && <Lock size={12} />}
                      {app.client}
                    </p>
                    <p className="text-[10px] font-bold opacity-70 truncate mt-0.5">{app.service}</p>
                    {height > 40 && (
                       <p className="text-[10px] font-black mt-1 opacity-50">{app.time} - {app.endTime}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="text-[9px] font-black bg-white/50 px-2 py-0.5 rounded-full">{app.duration}m</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/50 rounded-lg transition-all text-current">
                       <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-pink-500 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-display font-bold">Novo Agendamento</h3>
                <p className="text-pink-100 text-sm font-medium mt-1 flex items-center gap-2">
                  <Clock size={14} /> Reservando para às {selectedTime}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Cliente</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                  <input 
                    type="text" 
                    value={searchClient}
                    onChange={(e) => setSearchClient(e.target.value)}
                    placeholder="Buscar ou cadastrar cliente..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-slate-700"
                  />
                  {searchClient && !clientsList.includes(searchClient) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-rose-50 rounded-2xl shadow-xl z-10 max-h-40 overflow-y-auto p-2">
                       {clientsList.filter(c => c.toLowerCase().includes(searchClient.toLowerCase())).map(c => (
                         <button key={c} onClick={() => setSearchClient(c)} className="w-full text-left px-4 py-3 hover:bg-pink-50 rounded-xl text-sm font-bold text-slate-700 transition-colors">
                           {c}
                         </button>
                       ))}
                       <button className="w-full text-left px-4 py-3 bg-rose-50 text-pink-500 rounded-xl text-xs font-black uppercase tracking-widest">
                         + Cadastrar "{searchClient}"
                       </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Procedimento</label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                  {servicesList.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setSelectedService(s.name)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        selectedService === s.name 
                          ? 'border-pink-500 bg-pink-50 shadow-sm' 
                          : 'border-slate-100 hover:border-pink-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${selectedService === s.name ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Briefcase size={16} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm">{s.name}</p>
                          <p className="text-[10px] font-black opacity-50 uppercase tracking-tighter">{s.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm text-slate-800">R$ {s.price}</p>
                        <p className="text-[10px] font-bold text-pink-400">{s.duration} min</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={!searchClient || !selectedService}
                onClick={saveAppointment}
                className="w-full py-4 bg-pink-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all disabled:opacity-50"
              >
                Confirmar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="fixed bottom-24 right-8 hidden md:flex flex-col gap-3 p-5 bg-white/90 backdrop-blur-xl rounded-[2rem] border border-rose-100 shadow-2xl z-50">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-rose-50 pb-2 mb-1">Legenda Time Care</p>
        <div className="flex items-center gap-3 text-xs font-bold text-slate-600"><div className="w-4 h-4 rounded-lg bg-pink-200 border-2 border-pink-400"></div> Facial</div>
        <div className="flex items-center gap-3 text-xs font-bold text-slate-600"><div className="w-4 h-4 rounded-lg bg-blue-200 border-2 border-blue-400"></div> Corporal</div>
        <div className="flex items-center gap-3 text-xs font-bold text-slate-600"><div className="w-4 h-4 rounded-lg bg-purple-200 border-2 border-purple-400"></div> Estética</div>
      </div>
    </div>
  );
};

export default Agenda;
