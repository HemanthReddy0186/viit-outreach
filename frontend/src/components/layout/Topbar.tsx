import React from 'react';
import { 
  Bell, 
  Search, 
  Calendar, 
  Building2, 
  GraduationCap, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../mockData';

interface TopbarProps {
  currentTab: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedSection: string;
  onSectionChange: (section: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  selectedDate,
  onDateChange,
  selectedSection,
  onSectionChange,
  searchQuery,
  onSearchChange
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return { title: 'Executive Overview', desc: 'Real-time attendance rates, absentee status, and outreach metrics' };
      case 'students': return { title: 'Student Master Directory', desc: 'CSE 2nd Year student profiles, contact records, and attendance standing' };
      case 'attendance': return { title: 'Daily Attendance Roster', desc: 'Mark section attendance, calculate percentages, and confirm absentees' };
      case 'import': return { title: 'Excel Import Studio', desc: 'Upload .xlsx files with validation preview, error auditing, and marks preservation' };
      case 'marks': return { title: 'Midterm Assessment Marks', desc: 'Official evaluation records protected from attendance overwrites' };
      case 'calls': return { title: 'Automated AI Voice Outreach', desc: 'Simulated dialogue state machine, identity verification, and transcripts' };
      case 'queries': return { title: 'Coordinator Query Inbox', desc: 'Parent questions recorded by AI assistant pending coordinator resolution' };
      case 'reports': return { title: 'Institutional Word Reports (.docx)', desc: 'Generate and download official call outcome and attendance reports' };
      default: return { title: 'College Administration Portal', desc: 'VIIT CSE Department' };
    }
  };

  const { title, desc } = getTabTitle(currentTab);

  return (
    <header className="sticky top-0 z-20 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-heading font-bold text-slate-100 tracking-tight">
            {title}
          </h2>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-3 w-3" />
            Protected Staff Session
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
          {desc}
        </p>
      </div>

      {/* Controls & User Profile */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative hidden md:block w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search roll no / name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Section Picker */}
        <div className="flex items-center rounded-lg bg-slate-950/70 border border-slate-800 p-0.5 text-xs font-medium">
          <button
            onClick={() => onSectionChange('A')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              selectedSection === 'A'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sec A
          </button>
          <button
            onClick={() => onSectionChange('B')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              selectedSection === 'B'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sec B
          </button>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none text-xs cursor-pointer font-mono"
          />
        </div>

        {/* Coordinator Info Pill */}
        <div className="pl-3 border-l border-slate-800 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-slate-800">
            SR
          </div>
          <div className="hidden lg:block text-left text-xs leading-tight">
            <p className="font-semibold text-slate-200">Dr. K.S. Rao</p>
            <p className="text-[10px] text-slate-500">Coordinator (Sec A)</p>
          </div>
        </div>
      </div>
    </header>
  );
};
