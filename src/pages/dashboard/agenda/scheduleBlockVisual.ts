export interface ScheduleBlockVisual {
  label: string;
  cardClassName: string;
  badgeClassName: string;
}

export const getScheduleBlockVisual = (): ScheduleBlockVisual => {
  return {
    label: 'Bloqueado',
    cardClassName:
      'border border-slate-300 border-l-slate-500 bg-gradient-to-br from-slate-100 via-slate-200 to-zinc-200 text-slate-800 shadow-[0_10px_20px_rgba(15,23,42,0.18)]',
    badgeClassName: 'border-slate-300 bg-slate-50 text-slate-700',
  };
};
