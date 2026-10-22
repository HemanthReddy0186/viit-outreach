import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileSpreadsheet, 
  GraduationCap, 
  PhoneCall, 
  Inbox, 
  FileText
} from 'lucide-react';

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
    { id: 'students' as NavItem, label: 'Students', icon: Users },
    { id: 'attendance' as NavItem, label: 'Daily Attendance', icon: CalendarCheck },
    { id: 'import' as NavItem, label: 'Excel Import', icon: FileSpreadsheet },
    { id: 'marks' as NavItem, label: 'Midterm Marks', icon: GraduationCap },
    { id: 'calls' as NavItem, label: 'Voice Outreach', icon: PhoneCall, badge: activeCallsCount > 0 ? `${activeCallsCount} live` : undefined },
    { id: 'queries' as NavItem, label: 'Parent Inquiries', icon: Inbox, badge: pendingQueriesCount > 0 ? `${pendingQueriesCount}` : undefined },
    { id: 'reports' as NavItem, label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div style={{ padding: '1.25rem 1.25rem 1rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            backgroundColor: '#0f766e',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}>
            V
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', lineHeight: 1.2 }}>
              VIIT Outreach
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              CSE • II B.Tech
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '0.75rem 0.5rem', flex: 1, overflowY: 'auto' }}>
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

      {/* Clean Minimal Footer */}
      <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid #f1f5f9' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.72rem',
          color: '#64748b'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#0f766e' }} />
          <span>System Online</span>
        </div>
      </div>
    </aside>
  );
};
