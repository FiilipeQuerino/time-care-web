import { MoreHorizontal, LucideIcon } from 'lucide-react';
import { MenuSection } from '../../../types/navigation';

interface NavItem {
  id: MenuSection;
  label: string;
  icon: LucideIcon;
}

interface DashboardMobileNavigationProps {
  mobilePrimaryNav: NavItem[];
  mobileSecondaryNav: NavItem[];
  mobileAgendaItem: NavItem | undefined;
  activeSection: MenuSection;
  highlightedSection?: MenuSection | null;
  isMobileMoreOpen: boolean;
  isMobileSecondaryActive: boolean;
  onSelectSection: (section: MenuSection) => void;
  onToggleMore: () => void;
  onCloseMore: () => void;
}

export const DashboardMobileNavigation = ({
  mobilePrimaryNav,
  mobileSecondaryNav,
  mobileAgendaItem,
  activeSection,
  highlightedSection,
  isMobileMoreOpen,
  isMobileSecondaryActive,
  onSelectSection,
  onToggleMore,
  onCloseMore,
}: DashboardMobileNavigationProps) => {
  return (
    <>
      {isMobileMoreOpen ? (
        <>
          <button
            type="button"
            aria-label="Fechar menu adicional"
            className="md:hidden fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[1px]"
            onClick={onCloseMore}
          />
          <div className="md:hidden fixed bottom-24 left-4 right-4 z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Acesso rapido</p>
            <div className="grid grid-cols-3 gap-2">
              {mobileSecondaryNav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-onboarding-target={`nav-${item.id}`}
                  onClick={() => onSelectSection(item.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-semibold transition-colors ${
                    activeSection === item.id
                      ? 'border-pink-200 bg-pink-50 text-pink-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  } ${highlightedSection === item.id ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-white' : ''}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-pink-100 px-3 pt-2 pb-3 z-50 shadow-[0_-10px_30px_rgba(15,23,42,0.08)]">
        <div className="grid grid-cols-5 items-end gap-1">
          {mobilePrimaryNav.slice(0, 2).map((item) => (
            <button
              key={item.id}
              data-onboarding-target={`nav-${item.id}`}
              onClick={() => onSelectSection(item.id)}
              aria-label={item.label}
              className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl border px-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                item.id === activeSection
                  ? 'border-pink-200 bg-gradient-to-b from-pink-50 to-rose-50 text-pink-700'
                  : 'border-transparent text-slate-400'
              } ${highlightedSection === item.id ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-white' : ''}`}
            >
              <item.icon size={19} strokeWidth={item.id === activeSection ? 2.5 : 2} />
            </button>
          ))}

          {mobileAgendaItem ? (
            <button
              type="button"
              data-onboarding-target="nav-agenda"
              onClick={() => onSelectSection('agenda')}
              aria-label={mobileAgendaItem.label}
              className={`-mt-7 flex h-16 w-full flex-col items-center justify-center rounded-2xl border text-[10px] font-black uppercase tracking-wide shadow-lg transition-all ${
                activeSection === 'agenda'
                  ? 'border-pink-300 bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-pink-200'
                  : 'border-pink-200 bg-white text-pink-600 shadow-pink-100'
              } ${highlightedSection === 'agenda' ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-white' : ''}`}
            >
              <mobileAgendaItem.icon size={20} strokeWidth={2.5} />
            </button>
          ) : null}

          {mobilePrimaryNav.slice(3).map((item) => (
            <button
              key={item.id}
              data-onboarding-target={`nav-${item.id}`}
              onClick={() => onSelectSection(item.id)}
              aria-label={item.label}
              className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl border px-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                item.id === activeSection
                  ? 'border-pink-200 bg-gradient-to-b from-pink-50 to-rose-50 text-pink-700'
                  : 'border-transparent text-slate-400'
              } ${highlightedSection === item.id ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-white' : ''}`}
            >
              <item.icon size={19} strokeWidth={item.id === activeSection ? 2.5 : 2} />
            </button>
          ))}

          <button
            type="button"
            onClick={onToggleMore}
            aria-label="Mais opcoes"
            className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
              isMobileMoreOpen || isMobileSecondaryActive ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
            }`}
          >
            <MoreHorizontal size={19} />
          </button>
        </div>
      </nav>
    </>
  );
};
