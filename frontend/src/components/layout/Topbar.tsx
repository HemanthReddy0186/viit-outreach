import React from 'react';
import { 
  Search, 
  Calendar, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

interface TopbarProps {
  currentTab: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedSection: 'A' | 'B';
  onSectionChange: (section: 'A' | 'B') => void;
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
  return (
    <header className="app-topbar">
      {/* Left side: Context badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span className="status-pill status-pill-teal" style={{ fontSize: '0.75rem' }}>
          <ShieldCheck size={13} />
          Authorized Staff Portal
        </span>
        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
          CSE • II B.Tech
        </span>
      </div>

      {/* Right side: Search, Section, Date, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: 200 }}>
          <input
            type="search"
            placeholder="Search roll / student..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              padding: '0.35rem 0.65rem 0.35rem 1.8rem',
              fontSize: '0.75rem',
              height: 32,
              margin: 0,
              borderRadius: 6
            }}
          />
          <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>

        {/* Section Toggle */}
        <div className="segmented-control">
          <button
            type="button"
            onClick={() => onSectionChange('A')}
            className={`segmented-btn ${selectedSection === 'A' ? 'active' : ''}`}
          >
            Sec A
          </button>
          <button
            type="button"
            onClick={() => onSectionChange('B')}
            className={`segmented-btn ${selectedSection === 'B' ? 'active' : ''}`}
          >
            Sec B
          </button>
        </div>

        {/* Date Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            style={{
              padding: '0.35rem 0.6rem',
              fontSize: '0.75rem',
              height: 32,
              margin: 0,
              borderRadius: 6,
              fontFamily: 'var(--font-mono)'
            }}
          />
        </div>

        {/* Staff Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingLeft: '0.75rem',
          borderLeft: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: '#0f766e',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            SR
          </div>
          <div style={{ fontSize: '0.78rem', lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>Dr. K.S. Rao</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Coordinator</div>
          </div>
        </div>
      </div>
    </header>
  );
};
