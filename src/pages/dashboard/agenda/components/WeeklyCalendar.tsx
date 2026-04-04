import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DaySelector } from './DaySelector';
import { formatWeekLabel, getWeekDays, toDateInputValue } from '../dateUtils';

interface WeeklyCalendarProps {
  weekStart: Date;
  selectedDate: Date;
  countsByDate: Record<string, number>;
  onSelectDate: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  monthValue: string;
  onMonthChange: (month: string) => void;
}

export const WeeklyCalendar = ({
  weekStart,
  selectedDate,
  countsByDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  onToday,
  monthValue,
  onMonthChange,
}: WeeklyCalendarProps) => {
  const weekDays = getWeekDays(weekStart);
  const todayKey = toDateInputValue(new Date());

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <h3 className="text-base font-bold text-slate-800 sm:text-lg">{formatWeekLabel(weekStart)}</h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrevWeek}
            className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            aria-label="Semana anterior"
          >
            <ChevronLeft size={18} className="mx-auto" />
          </button>
          <button
            type="button"
            onClick={onNextWeek}
            className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            aria-label="Proxima semana"
          >
            <ChevronRight size={18} className="mx-auto" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToday}
          className="h-11 rounded-xl border border-pink-200 bg-pink-50 px-3 text-sm font-semibold text-pink-700 hover:bg-pink-100"
        >
          Ir para hoje
        </button>

        <input
          type="month"
          value={monthValue}
          onChange={(event) => onMonthChange(event.target.value)}
          className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
          aria-label="Selecionar mes"
        />
      </div>

      <div className="grid grid-cols-7 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {weekDays.map((day) => {
          const key = toDateInputValue(day);
          const selectedKey = toDateInputValue(selectedDate);
          return (
            <div key={key}>
              <DaySelector
                date={day}
                isSelected={key === selectedKey}
                isToday={key === todayKey}
                appointmentsCount={countsByDate[key] ?? 0}
                onSelect={onSelectDate}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
