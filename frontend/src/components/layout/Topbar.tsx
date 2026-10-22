import React from 'react';
import { Search } from 'lucide-react';

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
  selectedDate,
  onDateChange,
  selectedSection,
  onSectionChange,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="app-topbar">
      {/* Left side: Clean context title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
          Department of CSE
        </span>
        <span style={{ color: '#cbd5e1' }}>•</span>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Academic Year 2026–27
        </span>
      </div>

      {/* Right side: Search, Section Toggle, Date, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: 190 }}>
          <input
            type="search"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              padding: '0.35rem 0.65rem 0.35rem 1.8rem',
              fontSize: '0.78rem',
              height: 32,
              margin: 0,
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
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
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            style={{
              padding: '0.35rem 0.6rem',
              fontSize: '0.78rem',
              height: 32,
              margin: 0,
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
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
          borderLeft: '1px solid #f1f5f9'
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: '#f0fdfa',
            color: '#0f766e',
            border: '1px solid #ccfbf1',
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
