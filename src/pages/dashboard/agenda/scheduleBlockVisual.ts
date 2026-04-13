export interface ScheduleBlockVisual {
  label: string;
  cardClassName: string;
  badgeClassName: string;
}

export const getScheduleBlockVisual = (): ScheduleBlockVisual => {
  return {
    label: 'Bloqueado',
    cardClassName:
      'border border-slate-300 border-l-slate-500 bg-gradient-to-br from-slate-200 via-slate-100 to-zinc-100 text-slate-800 shadow-[0_12px_24px_rgba(15,23,42,0.20)]',
    badgeClassName: 'border-slate-300 bg-white/80 text-slate-700',
  };
};
