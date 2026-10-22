import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  UserX, 
  Save, 
  PhoneCall, 
  AlertCircle, 
  ShieldAlert, 
  Sparkles,
  Search,
  Check,
  RefreshCw
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

  // Map attendance record status or default to PRESENT
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
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  // Quick mark all present
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
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-heading font-bold text-slate-100 tracking-tight">
              Section {selectedSection} Roster Attendance
            </h2>
            <Badge variant="indigo">{selectedDate}</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mark daily attendance. Coordinators must confirm absentees prior to automated call queuing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isSavedNotice && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
              <Check className="h-3.5 w-3.5" /> Changes saved locally
            </span>
          )}

          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Mark All Present
          </button>

          <button
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={currentAbsentees.length === 0}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all ${
              currentAbsentees.length > 0
                ? 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-rose-600/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <UserX className="h-4 w-4" />
            Review & Confirm Absentees ({currentAbsentees.length})
          </button>
        </div>
      </div>

      {/* Attendance Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Enrolled</span>
            <p className="text-2xl font-heading font-bold text-slate-100 mt-1">{sectionStudents.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 text-slate-300">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-400 font-medium">Present Today</span>
            <p className="text-2xl font-heading font-bold text-emerald-400 mt-1">
              {sectionStudents.length - currentAbsentees.length}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-400 font-medium">Absent Today</span>
            <p className="text-2xl font-heading font-bold text-rose-400 mt-1">{currentAbsentees.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/40">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search student or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 w-full rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Click status toggle to switch Present/Absent
          </span>
        </div>

        <div 
          tabIndex={0} 
          role="region" 
          aria-label="Attendance Roster Table"
          className="table-wrapper max-h-[600px] overflow-auto"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80">
                <th className="py-3 px-4 font-semibold">Roll Number</th>
                <th className="py-3 px-4 font-semibold">Student Name</th>
                <th className="py-3 px-4 font-semibold">Cumulative Attendance</th>
                <th className="py-3 px-4 font-semibold">Parent Contact</th>
                <th className="py-3 px-4 font-semibold text-center">Today's Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((student) => {
                const status = getStatusForStudent(student.id);
                const isAbsent = status === 'ABSENT';

                return (
                  <tr 
                    key={student.id} 
                    className={`transition-colors ${
                      isAbsent ? 'bg-rose-950/15 hover:bg-rose-950/25' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      {student.rollNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        student.attendancePercentage < 65
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : student.attendancePercentage < 75
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {student.attendancePercentage}% ({student.attendedClasses}/{student.totalClasses})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      <span>{student.parentName}</span>
                      <span className="text-[11px] font-mono text-slate-400 block">{student.parentPhone}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(student)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold font-mono text-xs transition-all ${
                          isAbsent
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                            : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30'
                        }`}
                      >
                        {isAbsent ? (
                          <>
                            <XCircle className="h-3.5 w-3.5" />
                            ABSENT
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            PRESENT
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

      {/* Two-Step Absentee Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Absentee List for Parental Outreach"
        subtitle={`Section ${selectedSection} • Date: ${selectedDate}`}
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel & Modify
            </button>
            <button
              onClick={() => {
                onConfirmAbsenteesForCall(currentAbsentees.map(a => a.id));
                setIsConfirmModalOpen(false);
              }}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <PhoneCall className="h-4 w-4" />
              Confirm & Queue Simulated Calls ({currentAbsentees.length})
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Coordinator Sign-Off Required:</strong> Per institutional policy (`FR-06`), calls are only scheduled after explicit coordinator review. Confirming will create idempotent call tasks for the students listed below.
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Roll Number</th>
                  <th className="py-2.5 px-3 font-semibold">Student Name</th>
                  <th className="py-2.5 px-3 font-semibold">Parent Name</th>
                  <th className="py-2.5 px-3 font-semibold">Parent Phone</th>
                  <th className="py-2.5 px-3 font-semibold">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {currentAbsentees.map(student => (
                  <tr key={student.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">{student.rollNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-100">{student.name}</td>
                    <td className="py-2.5 px-3 text-slate-300">{student.parentName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{student.parentPhone}</td>
                    <td className="py-2.5 px-3 font-mono text-rose-400 font-bold">{student.attendancePercentage}%</td>
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
