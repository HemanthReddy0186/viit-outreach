import React from 'react';
import { 
  CheckCircle2, 
  UserX, 
  PhoneCall, 
  AlertTriangle, 
  ArrowRight, 
  CalendarCheck, 
  UploadCloud 
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Student, AttendanceRecord, CallTask, ParentQuery } from '../types';

interface DashboardProps {
  students: Student[];
  attendance: AttendanceRecord[];
  callTasks: CallTask[];
  queries: ParentQuery[];
  onNavigate: (tab: any) => void;
  selectedDate: string;
  selectedSection: string;
  onTriggerCallSimulation: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  attendance,
  callTasks,
  queries,
  onNavigate,
  selectedDate,
  selectedSection,
  onTriggerCallSimulation
}) => {
  const sectionStudents = students.filter(s => s.section === selectedSection);
  const totalStudents = sectionStudents.length;

  const todayAbsentees = attendance.filter(
    a => a.section === selectedSection && a.date === selectedDate && a.status === 'ABSENT'
  );
  const absenteeCount = todayAbsentees.length;
  const presentCount = totalStudents - absenteeCount;
  const todayAttendanceRate = totalStudents > 0 
    ? ((presentCount / totalStudents) * 100).toFixed(1) 
    : '0.0';

  const safeCount = sectionStudents.filter(s => s.attendancePercentage >= 75).length;
  const condonationCount = sectionStudents.filter(s => s.attendancePercentage >= 65 && s.attendancePercentage < 75).length;
  const criticalCount = sectionStudents.filter(s => s.attendancePercentage < 65).length;

  const pendingQueries = queries.filter(q => q.status === 'PENDING');

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-pretitle">Section {selectedSection} Overview</div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">
            Daily attendance status and parent communication for {selectedDate}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => onNavigate('attendance')}
            className="btn-tabler btn-tabler-primary"
          >
            <CalendarCheck size={14} /> Mark Attendance
          </button>
          <button
            type="button"
            onClick={() => onNavigate('import')}
            className="btn-tabler btn-tabler-outline"
          >
            <UploadCloud size={14} /> Import Excel
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <StatCard
          title="Attendance Rate"
          value={`${todayAttendanceRate}%`}
          subtitle={`${presentCount} of ${totalStudents} present`}
          icon={CheckCircle2}
          trend={{ value: `${presentCount}/${totalStudents}`, positive: absenteeCount === 0 }}
        />

        <StatCard
          title="Absentees Today"
          value={absenteeCount}
          subtitle={`Section ${selectedSection}`}
          icon={UserX}
          trend={{ value: `${absenteeCount} absent`, positive: false }}
        />

        <StatCard
          title="Parent Calls"
          value={callTasks.length}
          subtitle={`${callTasks.filter(c => c.status === 'COMPLETED').length} completed`}
          icon={PhoneCall}
        />

        <StatCard
          title="Pending Inquiries"
          value={pendingQueries.length}
          subtitle="Requires follow-up"
          icon={AlertTriangle}
          trend={{ value: `${pendingQueries.length} pending`, positive: pendingQueries.length === 0 }}
        />
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Today's Absentees */}
          <Card
            title={`Absentees (${absenteeCount})`}
            action={
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onTriggerCallSimulation}
                  className="btn-tabler btn-tabler-primary btn-tabler-sm"
                >
                  <PhoneCall size={13} /> Run Parent Calls
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('attendance')}
                  className="btn-tabler btn-tabler-outline btn-tabler-sm"
                >
                  Roster <ArrowRight size={13} />
                </button>
              </div>
            }
          >
            {todayAbsentees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                <CheckCircle2 size={28} color="#0f766e" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>All students present today</p>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem' }}>No absentees recorded for Section {selectedSection}.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="tabler-table">
                  <thead>
                    <tr>
                      <th>Roll Number</th>
                      <th>Student</th>
                      <th>Attendance</th>
                      <th>Parent Contact</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAbsentees.map(record => {
                      const student = students.find(s => s.id === record.studentId);
                      const call = callTasks.find(c => c.studentRoll === record.studentRoll);

                      return (
                        <tr key={record.id}>
                          <td className="roll-number">{record.studentRoll}</td>
                          <td style={{ fontWeight: 600 }}>{record.studentName}</td>
                          <td>
                            <span className={`status-pill ${(student?.attendancePercentage || 0) < 65 ? 'status-pill-danger' : 'status-pill-warning'}`}>
                              {student?.attendancePercentage}%
                            </span>
                          </td>
                          <td style={{ fontSize: '0.75rem' }}>
                            <div>{student?.parentName}</div>
                            <div style={{ color: '#64748b', fontFamily: 'var(--font-mono)' }}>{student?.parentPhone}</div>
                          </td>
                          <td>
                            {call ? (
                              <Badge variant={call.status === 'COMPLETED' ? 'success' : call.status === 'RINGING' ? 'info' : 'warning'}>
                                {call.status}
                              </Badge>
                            ) : (
                              <Badge variant="danger">PENDING</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Recent Transcripts */}
          <Card
            title="Recent Parent Calls"
            action={
              <button
                type="button"
                onClick={() => onNavigate('calls')}
                className="btn-tabler btn-tabler-outline btn-tabler-sm"
              >
                View All <ArrowRight size={13} />
              </button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {callTasks.slice(0, 2).map(call => (
                <div key={call.id} style={{
                  padding: '0.85rem',
                  borderRadius: 6,
                  border: '1px solid #f1f5f9',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="roll-number">{call.studentRoll}</span>
                      <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>{call.studentName}</strong>
                    </div>
                    <Badge variant={call.status === 'COMPLETED' ? 'success' : 'warning'}>{call.status}</Badge>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                    <div style={{ marginBottom: '0.2rem' }}>
                      <strong style={{ color: '#0f766e' }}>Assistant:</strong> {call.transcript[0]?.text}
                    </div>
                    {call.transcript[1] && (
                      <div>
                        <strong style={{ color: '#475569' }}>Parent:</strong> {call.transcript[1]?.text}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Attendance Health Standing */}
          <Card title="Attendance Distribution">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#065f46', fontWeight: 600 }}>Safe (≥ 75%)</span>
                  <strong>{safeCount} Students ({((safeCount / totalStudents) * 100).toFixed(0)}%)</strong>
                </div>
                <div className="attendance-progress-track">
                  <div className="attendance-progress-fill" style={{ width: `${(safeCount / totalStudents) * 100}%`, backgroundColor: '#0f766e' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#92400e', fontWeight: 600 }}>Condonation (65%–74%)</span>
                  <strong>{condonationCount} Students ({((condonationCount / totalStudents) * 100).toFixed(0)}%)</strong>
                </div>
                <div className="attendance-progress-track">
                  <div className="attendance-progress-fill" style={{ width: `${(condonationCount / totalStudents) * 100}%`, backgroundColor: '#f59e0b' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#991b1b', fontWeight: 600 }}>Detention Risk (&lt; 65%)</span>
                  <strong>{criticalCount} Students ({((criticalCount / totalStudents) * 100).toFixed(0)}%)</strong>
                </div>
                <div className="attendance-progress-track">
                  <div className="attendance-progress-fill" style={{ width: `${(criticalCount / totalStudents) * 100}%`, backgroundColor: '#dc2626' }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Pending Inquiries */}
          <Card
            title={`Pending Inquiries (${pendingQueries.length})`}
            action={
              <button
                type="button"
                onClick={() => onNavigate('queries')}
                className="btn-tabler btn-tabler-outline btn-tabler-sm"
              >
                Inbox <ArrowRight size={13} />
              </button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {pendingQueries.map(q => (
                <div
                  key={q.id}
                  onClick={() => onNavigate('queries')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 6,
                    border: '1px solid #fed7aa',
                    backgroundColor: '#fffbeb',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <Badge variant="warning">{q.category.replace('_', ' ')}</Badge>
                    <span style={{ fontSize: '0.7rem', color: '#92400e', fontFamily: 'var(--font-mono)' }}>
                      {q.createdAt.split(' ')[1]} {q.createdAt.split(' ')[2]}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                    {q.studentRoll} • {q.studentName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem', lineHeight: 1.3 }}>
                    "{q.summary}"
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
