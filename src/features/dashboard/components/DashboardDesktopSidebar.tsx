import { Clock, LogOut, LucideIcon } from 'lucide-react';
import { MenuSection } from '../../../types/navigation';

interface NavItem {
  id: MenuSection;
  label: string;
  icon: LucideIcon;
}

interface DashboardDesktopSidebarProps {
  navItems: NavItem[];
  activeSection: MenuSection;
  highlightedSection?: MenuSection | null;
  onSelectSection: (section: MenuSection) => void;
  onLogout: () => void;
}

export const DashboardDesktopSidebar = ({
  navItems,
  activeSection,
  highlightedSection,
  onSelectSection,
  onLogout,
}: DashboardDesktopSidebarProps) => {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-white via-rose-50/70 to-pink-50/70 backdrop-blur-lg border-r border-pink-100/80 text-slate-800 flex-col p-6 z-50 shadow-[10px_0_36px_rgba(244,114,182,0.08)]">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white">
          <Clock size={24} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-black tracking-tight">TimeCare</span>
      </div>
      <nav className="flex-1 flex flex-col gap-2.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            data-onboarding-target={`nav-${item.id}`}
            onClick={() => onSelectSection(item.id)}
            className={`group relative flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
              item.id === activeSection
                ? 'border-pink-200 bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-[0_12px_24px_rgba(236,72,153,0.35)]'
                : 'border-transparent bg-white/60 text-slate-600 hover:border-pink-100 hover:bg-white hover:text-slate-900 hover:shadow-sm'
            } ${highlightedSection === item.id ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-white' : ''}`}
          >
            <span
              className={`absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full transition-all ${
                item.id === activeSection ? 'bg-white/90' : 'bg-transparent group-hover:bg-pink-200'
              }`}
            />
            <item.icon size={20} />
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all mt-auto">
        <LogOut size={20} />
        <span className="font-semibold">Sair</span>
      </button>
    </aside>
  );
};
