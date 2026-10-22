import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  UserX, 
  PhoneCall, 
  AlertCircle, 
  Search, 
  Check 
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
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

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-pretitle">Daily Operations • {selectedDate}</div>
          <h1 className="page-title">Section {selectedSection} Attendance Roster</h1>
          <p className="page-description">
            Faculty attendance marking. Confirm absentees before scheduling automated voice communication.
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
            className={`btn-tabler ${currentAbsentees.length > 0 ? 'btn-tabler-primary' : 'btn-tabler-outline'}`}
            style={{ opacity: currentAbsentees.length === 0 ? 0.6 : 1 }}
          >
            <UserX size={14} />
            Review & Confirm Absentees ({currentAbsentees.length})
          </button>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-card-label">Enrolled Students</div>
          <div className="metric-card-value">{sectionStudents.length}</div>
          <div className="metric-card-subtext">Section {selectedSection} Total</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-label">Present Today</div>
          <div className="metric-card-value" style={{ color: '#0f766e' }}>
            {sectionStudents.length - currentAbsentees.length}
          </div>
          <div className="metric-card-subtext">
            {(((sectionStudents.length - currentAbsentees.length) / sectionStudents.length) * 100).toFixed(1)}% Attendance
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-label">Absent Today</div>
          <div className="metric-card-value" style={{ color: '#e11d48' }}>
            {currentAbsentees.length}
          </div>
          <div className="metric-card-subtext">Requires parental call confirmation</div>
        </div>
      </div>

      {/* Roster Table Card */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span>Attendance Checklist</span>
            <div style={{ position: 'relative', width: 220 }}>
              <input
                type="search"
                placeholder="Search roster..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '0.35rem 0.65rem 0.35rem 1.8rem', fontSize: '0.78rem', height: 32, margin: 0 }}
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
                <th>Cumulative Record</th>
                <th>Parent Contact</th>
                <th style={{ textAlign: 'center' }}>Today's Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(student => {
                const status = getStatusForStudent(student.id);
                const isAbsent = status === 'ABSENT';

                return (
                  <tr key={student.id} style={{ backgroundColor: isAbsent ? '#fff1f2' : undefined }}>
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
        title="Confirm Absentee List for Parental Outreach"
        subtitle={`Section ${selectedSection} • Date: ${selectedDate}`}
        footer={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(false)}
              className="btn-tabler btn-tabler-outline"
            >
              Cancel & Modify
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmAbsenteesForCall(currentAbsentees.map(a => a.id));
                setIsConfirmModalOpen(false);
              }}
              className="btn-tabler btn-tabler-primary"
            >
              <PhoneCall size={14} /> Confirm & Queue Calls ({currentAbsentees.length})
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 6,
            fontSize: '0.78rem',
            color: '#92400e',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Coordinator Confirmation (`FR-06`):</strong> Once confirmed, the system creates idempotent simulated call tasks for the absentees below.
            </div>
          </div>

          <div className="table-responsive">
            <table className="tabler-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Parent / Phone</th>
                  <th>Attendance %</th>
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
