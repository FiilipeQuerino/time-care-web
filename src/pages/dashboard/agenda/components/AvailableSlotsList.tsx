import { Clock3 } from 'lucide-react';
import { SlotItem } from '../../../../hooks/useAvailableSlots';
import { Appointment } from '../../../../types/appointment';
import { getAppointmentTimeRange, toMinutes } from '../dateUtils';

interface AvailableSlotsListProps {
  slots: SlotItem[];
  selectedSlot: string;
  isLoading: boolean;
  appointments: Appointment[];
  onSelectSlot: (time: string) => void;
  onOpenAppointment?: (appointment: Appointment) => void;
}

export const AvailableSlotsList = ({
  slots,
  selectedSlot,
  isLoading,
  appointments,
  onSelectSlot,
  onOpenAppointment,
}: AvailableSlotsListProps) => {
  const appointmentByTime = (time: string): Appointment | null => {
    const slotMinute = toMinutes(time);
    const found = appointments.find((appointment) => {
      const range = getAppointmentTimeRange(appointment);
      const start = toMinutes(range.start);
      const end = toMinutes(range.end);
      return slotMinute >= start && slotMinute < end;
    });

    return found ?? null;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800 sm:text-lg">Timeline do dia</h3>
          <p className="text-xs text-slate-500">07:00 - 22:00</p>
        </div>
        {isLoading ? <span className="text-xs font-semibold text-pink-600">Atualizando...</span> : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className="grid animate-pulse grid-cols-[66px_minmax(0,1fr)] items-stretch border-b border-slate-100 last:border-b-0 sm:grid-cols-[74px_minmax(0,1fr)]"
              >
                <div className="flex items-center justify-end px-2">
                  <div className="h-3 w-9 rounded-full bg-slate-200" />
                </div>
                <div className="min-h-[58px] px-3 py-2">
                  <div className="h-4 w-20 rounded-full bg-slate-200" />
                  <div className="mt-2 h-3 w-44 rounded-full bg-slate-100" />
                </div>
              </div>
            ))
          : slots.map((slot) => {
              const isSelected = selectedSlot === slot.time;
              const appointment = appointmentByTime(slot.time);
              const label = appointment
                ? `${appointment.clientName || `Cliente #${appointment.clientId}`} - ${appointment.procedureName || `Procedimento #${appointment.procedureId}`}`
                : null;

              return (
                <div
                  key={slot.time}
                  className="grid grid-cols-[66px_minmax(0,1fr)] items-stretch border-b border-slate-100 last:border-b-0 sm:grid-cols-[74px_minmax(0,1fr)]"
                >
                  <div className="flex items-center justify-end px-2 text-[11px] font-semibold text-slate-500 sm:text-xs">{slot.time}</div>

                  <button
                    type="button"
                    onClick={() => {
                      if (slot.isAvailable) {
                        onSelectSlot(slot.time);
                        return;
                      }

                      if (appointment && onOpenAppointment) {
                        onOpenAppointment(appointment);
                      }
                    }}
                    className={`relative min-h-[58px] px-3 py-2 text-left text-sm transition-all ${
                      slot.isAvailable
                        ? isSelected
                          ? 'bg-pink-600 text-white'
                          : 'bg-white text-slate-800 hover:bg-pink-50'
                        : appointment
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                          : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                    }`}
                    title={slot.reason}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{slot.isAvailable ? 'Livre' : 'Ocupado'}</span>
                      <Clock3
                        size={14}
                        className={slot.isAvailable ? (isSelected ? 'text-white' : 'text-pink-500') : 'text-slate-400'}
                      />
                    </div>
                    {label ? <p className="mt-0.5 truncate text-[11px] text-slate-500">{label}</p> : null}
                  </button>
                </div>
              );
            })}
      </div>
    </div>
  );
};
