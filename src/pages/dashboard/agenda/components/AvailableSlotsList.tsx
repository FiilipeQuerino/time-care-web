import { Clock3 } from 'lucide-react';
import { useMemo } from 'react';
import { SlotItem } from '../../../../hooks/useAvailableSlots';
import { Appointment } from '../../../../types/appointment';
import { getAppointmentTimeRange, toMinutes } from '../dateUtils';
import { getAppointmentStatusVisual } from '../statusVisual';

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
  const TIMELINE_START_MINUTES = 7 * 60;
  const TIMELINE_END_MINUTES = 22 * 60;
  const REFERENCE_STEP_MINUTES = 30;
  const PIXELS_PER_MINUTE = 1.35;
  const TIME_COLUMN_WIDTH = 76;

  const timelineHeight = (TIMELINE_END_MINUTES - TIMELINE_START_MINUTES) * PIXELS_PER_MINUTE;
  const rowHeight = REFERENCE_STEP_MINUTES * PIXELS_PER_MINUTE;

  const visibleAppointments = useMemo(() => {
    return appointments
      .map((appointment) => {
        const { start, end, durationInMinutes } = getAppointmentTimeRange(appointment);
        const startMinutes = toMinutes(start);
        const endMinutes = toMinutes(end);

        const normalizedEnd =
          endMinutes > startMinutes ? endMinutes : startMinutes + Math.max(appointment.durationInMinutes ?? durationInMinutes ?? 0, 1);

        const clampedStart = Math.max(startMinutes, TIMELINE_START_MINUTES);
        const clampedEnd = Math.min(normalizedEnd, TIMELINE_END_MINUTES);

        if (Number.isNaN(clampedStart) || Number.isNaN(clampedEnd) || clampedEnd <= clampedStart) return null;

        return {
          appointment,
          top: (clampedStart - TIMELINE_START_MINUTES) * PIXELS_PER_MINUTE,
          height: Math.max((clampedEnd - clampedStart) * PIXELS_PER_MINUTE, 30),
          intervalLabel: `${start}-${end}`,
        };
      })
      .filter((item): item is { appointment: Appointment; top: number; height: number; intervalLabel: string } => Boolean(item))
      .sort((a, b) => a.top - b.top);
  }, [appointments]);

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
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div
              key={`loading-${index}`}
              className="grid animate-pulse grid-cols-[76px_minmax(0,1fr)] items-stretch border-b border-slate-100 last:border-b-0 sm:grid-cols-[88px_minmax(0,1fr)]"
            >
              <div className="flex items-center justify-end px-2">
                <div className="h-3.5 w-11 rounded-full bg-slate-200" />
              </div>
              <div className="min-h-[58px] px-3 py-2">
                <div className="h-4 w-20 rounded-full bg-slate-200" />
                <div className="mt-2 h-3 w-44 rounded-full bg-slate-100" />
              </div>
            </div>
          ))
        ) : (
          <div className="relative" style={{ height: `${timelineHeight}px` }}>
            {slots.map((slot) => {
              const slotStart = toMinutes(slot.time);
              const isSelected = selectedSlot === slot.time;

              if (slotStart < TIMELINE_START_MINUTES || slotStart > TIMELINE_END_MINUTES) return null;

              return (
                <div
                  key={slot.time}
                  className="absolute inset-x-0 grid grid-cols-[76px_minmax(0,1fr)] border-b border-slate-100 sm:grid-cols-[84px_minmax(0,1fr)]"
                  style={{
                    top: `${(slotStart - TIMELINE_START_MINUTES) * PIXELS_PER_MINUTE}px`,
                    height: `${rowHeight}px`,
                  }}
                >
                  <div className="flex items-start justify-end pl-1 pr-2 pt-1 text-[11px] font-semibold text-slate-500 sm:pr-2 sm:text-xs">
                    {slot.time}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (slot.isAvailable) onSelectSlot(slot.time);
                    }}
                    disabled={!slot.isAvailable}
                    className={`h-full w-full px-3 text-left transition-colors ${
                      slot.isAvailable
                        ? isSelected
                          ? 'bg-emerald-50/70'
                          : 'bg-transparent hover:bg-emerald-50/45'
                        : 'bg-transparent'
                    } ${slot.isAvailable ? '' : 'cursor-default'}`}
                    title={slot.reason}
                    aria-label={slot.isAvailable ? `Selecionar horario ${slot.time}` : `Horario ${slot.time} indisponivel`}
                  >
                    {slot.isAvailable ? (
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                        <Clock3 size={12} />
                        Livre
                      </span>
                    ) : null}
                  </button>
                </div>
              );
            })}

            <div
              className="pointer-events-none absolute top-0"
              style={{
                left: `${TIME_COLUMN_WIDTH}px`,
                right: '8px',
                height: `${timelineHeight}px`,
              }}
            >
              {visibleAppointments.map(({ appointment, top, height, intervalLabel }) => (
                (() => {
                  const statusVisual = getAppointmentStatusVisual(appointment.status, appointment.statusLabel);
                  return (
                    <button
                      key={appointment.appointmentId}
                      type="button"
                      onClick={() => {
                        if (onOpenAppointment) onOpenAppointment(appointment);
                      }}
                      className={`pointer-events-auto absolute w-full rounded-xl border-l-4 px-3 py-2 text-left transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-pink-300 ${statusVisual.cardClassName}`}
                      style={{
                        top: `${top}px`,
                        minHeight: `${height}px`,
                      }}
                      aria-label={`Agendamento ${intervalLabel} de ${appointment.clientName || `Cliente ${appointment.clientId}`}`}
                    >
                      <p className="text-[11px] font-semibold tracking-wide text-white/85">{intervalLabel}</p>
                      <p className="mt-0.5 truncate text-sm font-bold text-white">
                        {appointment.clientName || `Cliente #${appointment.clientId}`}
                      </p>
                      <p className="truncate text-xs font-medium text-white/85">
                        {appointment.procedureName || `Procedimento #${appointment.procedureId}`}
                      </p>
                      <p className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusVisual.badgeClassName}`}>
                        {statusVisual.label}
                      </p>
                    </button>
                  );
                })()
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
