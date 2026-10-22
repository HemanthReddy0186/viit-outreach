import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileSpreadsheet, 
  GraduationCap, 
  PhoneCall, 
  Inbox, 
  FileText,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../mockData';

export type NavItem = 
  | 'dashboard' 
  | 'students' 
  | 'attendance' 
  | 'import' 
  | 'marks' 
  | 'calls' 
  | 'queries' 
  | 'reports';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  pendingQueriesCount: number;
  activeCallsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingQueriesCount,
  activeCallsCount
}) => {
  const navItems = [
    { id: 'dashboard' as NavItem, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students' as NavItem, label: 'Student Directory', icon: Users },
    { id: 'attendance' as NavItem, label: 'Daily Attendance', icon: CalendarCheck, highlight: true },
    { id: 'import' as NavItem, label: 'Excel Import Studio', icon: FileSpreadsheet },
    { id: 'marks' as NavItem, label: 'Midterm Marks', icon: GraduationCap },
    { id: 'calls' as NavItem, label: 'AI Voice Outreach', icon: PhoneCall, badge: activeCallsCount > 0 ? `${activeCallsCount} live` : undefined, badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'queries' as NavItem, label: 'Coordinator Inbox', icon: Inbox, badge: pendingQueriesCount > 0 ? `${pendingQueriesCount}` : undefined, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'reports' as NavItem, label: 'Word Reports (.docx)', icon: FileText },
  ];

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 bg-slate-900/90 border-r border-slate-800/80 backdrop-blur-xl z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 text-lg">
                  VIIT
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-heading font-bold text-slate-100 text-sm tracking-tight">
                  VIIT Outreach
                </h1>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AI MVP
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[170px]" title={INSTITUTION_INFO.name}>
                Vignan's IIT, Visakhapatnam
              </p>
            </div>
          </div>

          <div className="mt-4 px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Department</span>
            <span className="font-semibold text-slate-200">CSE (II B.Tech)</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Core Workflows
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700 text-white shadow-md shadow-indigo-600/25 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Safety & Simulation Status Banner */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/50 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>AI Voice Simulator Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Phase 1 Testing: Calls are purely simulated. No real phone numbers are dialed.
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Coord: Dr. K.S. Rao
          </span>
          <span className="text-[10px] font-mono text-slate-400">v1.0.0-phase1</span>
        </div>
      </div>
    </aside>
  );
};
