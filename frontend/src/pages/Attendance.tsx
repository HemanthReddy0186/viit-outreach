import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  UserX, 
  PhoneCall, 
  Search, 
  Check,
  Users
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import { Student, AttendanceRecord } from '../types';

interface AttendanceProps {
  students: Student[];
  attendance: AttendanceRecord[];
  selectedDate: string;
  selectedSection: string;
  onUpdateAttendance: (updated: AttendanceRecord[]) => void;
  onConfirmAbsenteesForCall: (absenteeIds: string[]) => void;
}

export const Attendance: React.FC<AttendanceProps> = ({
  students,
  attendance,
  selectedDate,
  selectedSection,
  onUpdateAttendance,
  onConfirmAbsenteesForCall
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const sectionStudents = students.filter(s => s.section === selectedSection);

  const getStatusForStudent = (studentId: string): 'PRESENT' | 'ABSENT' => {
    const record = attendance.find(
      a => a.studentId === studentId && a.date === selectedDate && a.section === selectedSection
    );
    return record ? (record.status as 'PRESENT' | 'ABSENT') : 'PRESENT';
  };

  const handleToggleStatus = (student: Student) => {
    const currentStatus = getStatusForStudent(student.id);
    const newStatus = currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT';

    const existingIndex = attendance.findIndex(
      a => a.studentId === student.id && a.date === selectedDate && a.section === selectedSection
    );

    let updatedRecords: AttendanceRecord[];
    if (existingIndex >= 0) {
      updatedRecords = [...attendance];
      updatedRecords[existingIndex] = {
        ...updatedRecords[existingIndex],
        status: newStatus
      };
    } else {
      updatedRecords = [
        ...attendance,
        {
          id: `att-${Date.now()}-${student.id}`,
          studentId: student.id,
          studentRoll: student.rollNumber,
          studentName: student.name,
          section: selectedSection,
          date: selectedDate,
          status: newStatus,
          confirmedForCall: false
        }
      ];
    }
    onUpdateAttendance(updatedRecords);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleMarkAllPresent = () => {
    const updated = attendance.map(a => {
      if (a.section === selectedSection && a.date === selectedDate) {
        return { ...a, status: 'PRESENT' as const };
      }
      return a;
    });
    onUpdateAttendance(updated);
  };

  const filtered = sectionStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentAbsentees = sectionStudents.filter(
    s => getStatusForStudent(s.id) === 'ABSENT'
  );
  const presentCount = sectionStudents.length - currentAbsentees.length;
  const attendanceRate = sectionStudents.length > 0 
    ? ((presentCount / sectionStudents.length) * 100).toFixed(1)
    : '0.0';

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-pretitle">Section {selectedSection}</div>
          <h1 className="page-title">Daily Attendance</h1>
          <p className="page-description">
            Roster for {selectedDate}. Toggle status to mark absentees.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {isSavedNotice && (
            <span style={{ fontSize: '0.75rem', color: '#0f766e', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              <Check size={14} /> Saved
            </span>
          )}

          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="btn-tabler btn-tabler-outline btn-tabler-sm"
          >
            Mark All Present
          </button>

          <button
            type="button"
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={currentAbsentees.length === 0}
            className={`btn-tabler btn-tabler-sm ${currentAbsentees.length > 0 ? 'btn-tabler-primary' : 'btn-tabler-outline'}`}
            style={{ opacity: currentAbsentees.length === 0 ? 0.6 : 1 }}
          >
            <UserX size={14} />
            Review Absentees ({currentAbsentees.length})
          </button>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="metrics-grid">
        <StatCard
          title="Total Enrolled"
          value={sectionStudents.length}
          subtitle={`Section ${selectedSection}`}
          icon={Users}
        />

        <StatCard
          title="Present Today"
          value={presentCount}
          subtitle={`${attendanceRate}% attendance rate`}
          icon={CheckCircle2}
          trend={{ value: `${presentCount}/${sectionStudents.length}`, positive: currentAbsentees.length === 0 }}
        />

        <StatCard
          title="Absent Today"
          value={currentAbsentees.length}
          subtitle={currentAbsentees.length > 0 ? 'Pending call notification' : 'Full attendance'}
          icon={UserX}
          trend={{ value: `${currentAbsentees.length} absent`, positive: false }}
        />
      </div>

      {/* Roster Table Card */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span>Attendance Checklist</span>
            <div style={{ position: 'relative', width: 200 }}>
              <input
                type="search"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.35rem 0.65rem 0.35rem 1.8rem',
                  fontSize: '0.78rem',
                  height: 32,
                  margin: 0,
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff'
                }}
              />
              <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>
        }
      >
        <div className="table-responsive">
          <table className="tabler-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Attendance %</th>
                <th>Parent Contact</th>
                <th style={{ textAlign: 'center' }}>Today's Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(student => {
                const status = getStatusForStudent(student.id);
                const isAbsent = status === 'ABSENT';

                return (
                  <tr key={student.id} style={{ backgroundColor: isAbsent ? '#fef2f2' : undefined }}>
                    <td className="roll-number">{student.rollNumber}</td>
                    <td style={{ fontWeight: 600 }}>{student.name}</td>
                    <td>
                      <span className={`status-pill ${
                        student.attendancePercentage < 65 ? 'status-pill-danger' :
                        student.attendancePercentage < 75 ? 'status-pill-warning' : 'status-pill-success'
                      }`}>
                        {student.attendancePercentage}% ({student.attendedClasses}/{student.totalClasses})
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>
                      <div>{student.parentName}</div>
                      <div style={{ color: '#64748b', fontFamily: 'var(--font-mono)' }}>{student.parentPhone}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(student)}
                        className={`btn-tabler btn-tabler-sm ${isAbsent ? 'btn-tabler-danger' : 'btn-tabler-outline'}`}
                        style={{ minWidth: 95, justifyContent: 'center' }}
                      >
                        {isAbsent ? (
                          <>
                            <XCircle size={13} /> ABSENT
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={13} color="#0f766e" /> PRESENT
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Absentee Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Review Absentees"
        subtitle={`Section ${selectedSection} • ${selectedDate}`}
        footer={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(false)}
              className="btn-tabler btn-tabler-outline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmAbsenteesForCall(currentAbsentees.map(a => a.id));
                setIsConfirmModalOpen(false);
              }}
              className="btn-tabler btn-tabler-primary"
            >
              <PhoneCall size={14} /> Queue Parent Calls ({currentAbsentees.length})
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
            Review the {currentAbsentees.length} absent students before initiating automated voice calls.
          </p>

          <div className="table-responsive">
            <table className="tabler-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Parent Contact</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {currentAbsentees.map(s => (
                  <tr key={s.id}>
                    <td className="roll-number">{s.rollNumber}</td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td style={{ fontSize: '0.75rem' }}>
                      {s.parentName} ({s.parentPhone})
                    </td>
                    <td>
                      <span className="status-pill status-pill-danger">{s.attendancePercentage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
};
