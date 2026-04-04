import { formatDayLabel, toDateInputValue } from '../dateUtils';

interface DaySelectorProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  appointmentsCount?: number;
  onSelect: (date: Date) => void;
}

export const DaySelector = ({
  date,
  isSelected,
  isToday,
  appointmentsCount = 0,
  onSelect,
}: DaySelectorProps) => {
  const label = formatDayLabel(date);

  return (
    <button
      type="button"
      onClick={() => onSelect(date)}
      className={`min-h-[62px] rounded-xl border px-2 py-2 text-center transition-all focus:outline-none focus:ring-4 focus:ring-pink-100 ${
        isSelected
          ? 'border-pink-300 bg-pink-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50/40'
      }`}
      aria-label={`Selecionar ${toDateInputValue(date)}`}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span className={`text-[11px] font-semibold uppercase tracking-wide ${isSelected ? 'text-pink-700' : 'text-slate-500'}`}>
          {label.weekdayShort}
        </span>
        {appointmentsCount > 0 ? (
          <span className="rounded-full border border-pink-200 bg-pink-100 px-1.5 py-0.5 text-[10px] font-bold text-pink-700">
            {appointmentsCount}
          </span>
        ) : null}
      </div>

      <div className={`mt-1 text-xl font-black leading-none ${isSelected ? 'text-pink-700' : isToday ? 'text-pink-600' : 'text-slate-800'}`}>
        {label.day}
      </div>
    </button>
  );
};
