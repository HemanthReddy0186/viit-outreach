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
  ShieldCheck,
  Building2
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
    { id: 'attendance' as NavItem, label: 'Daily Attendance', icon: CalendarCheck },
    { id: 'import' as NavItem, label: 'Excel Import Studio', icon: FileSpreadsheet },
    { id: 'marks' as NavItem, label: 'Midterm Marks', icon: GraduationCap },
    { id: 'calls' as NavItem, label: 'AI Voice Outreach', icon: PhoneCall, badge: activeCallsCount > 0 ? `${activeCallsCount} live` : undefined },
    { id: 'queries' as NavItem, label: 'Coordinator Inbox', icon: Inbox, badge: pendingQueriesCount > 0 ? `${pendingQueriesCount}` : undefined },
    { id: 'reports' as NavItem, label: 'Word Reports (.docx)', icon: FileText },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div style={{ padding: '1.25rem 1.25rem 1rem 1.25rem', borderBottom: '1px solid var(--pico-border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 6,
            backgroundColor: '#0f766e',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '-0.02em'
          }}>
            VIIT
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', lineHeight: 1.2 }}>
              VIIT Outreach
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Vignan's IIT, Visakhapatnam
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '0.85rem',
          padding: '0.4rem 0.65rem',
          borderRadius: 6,
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          fontSize: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          color: '#475569'
        }}>
          <span>Dept</span>
          <strong style={{ color: '#0f766e' }}>CSE (II B.Tech)</strong>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '0.75rem 0.65rem', flex: 1, overflowY: 'auto' }}>
        <div style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#94a3b8',
          letterSpacing: '0.05em',
          padding: '0.4rem 0.75rem'
        }}>
          Workflows
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} color={isActive ? '#0f766e' : '#64748b'} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span className="status-pill status-pill-teal" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--pico-border-color)', backgroundColor: '#ffffff' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: '#0f766e',
          fontWeight: 600,
          marginBottom: '0.35rem'
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#0f766e' }} />
          Simulated Calling Active
        </div>
        <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3 }}>
          Phase 1 Prototype. Fictional data only. No external phone calls placed.
        </p>
      </div>
    </aside>
  );
};
