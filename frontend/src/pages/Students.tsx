import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  Phone, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  ShieldCheck,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Student, StudentMark } from '../types';

interface StudentsProps {
  students: Student[];
  marks: StudentMark[];
  selectedSection: string;
}

export const Students: React.FC<StudentsProps> = ({
  students,
  marks,
  selectedSection
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'SAFE'>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filtering
  const filteredStudents = students.filter(student => {
    const matchesSection = student.section === selectedSection;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesTier = true;
    if (filterTier === 'CRITICAL') matchesTier = student.attendancePercentage < 65;
    if (filterTier === 'WARNING') matchesTier = student.attendancePercentage >= 65 && student.attendancePercentage < 75;
    if (filterTier === 'SAFE') matchesTier = student.attendancePercentage >= 75;

    return matchesSection && matchesSearch && matchesTier;
  });

  const studentMarks = selectedStudent 
    ? marks.filter(m => m.studentRoll === selectedStudent.rollNumber)
    : [];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-slate-100 tracking-tight">
            CSE Section {selectedSection} Roster
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Displaying {filteredStudents.length} of {students.filter(s => s.section === selectedSection).length} enrolled students
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 w-60 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-xs font-medium">
            <button
              onClick={() => setFilterTier('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${filterTier === 'ALL' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTier('CRITICAL')}
              className={`px-3 py-1 rounded-lg transition-all ${filterTier === 'CRITICAL' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              &lt; 65%
            </button>
            <button
              onClick={() => setFilterTier('WARNING')}
              className={`px-3 py-1 rounded-lg transition-all ${filterTier === 'WARNING' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              65-74%
            </button>
            <button
              onClick={() => setFilterTier('SAFE')}
              className={`px-3 py-1 rounded-lg transition-all ${filterTier === 'SAFE' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ≥ 75%
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Students Table */}
      <Card className="p-0 overflow-hidden">
        <div 
          tabIndex={0} 
          role="region" 
          aria-label="Student Roster Directory"
          className="table-wrapper max-h-[650px] overflow-auto"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80">
                <th className="py-3.5 px-4 font-semibold">Roll Number</th>
                <th className="py-3.5 px-4 font-semibold">Student Name</th>
                <th className="py-3.5 px-4 font-semibold">Parent / Guardian</th>
                <th className="py-3.5 px-4 font-semibold">Contact Phone</th>
                <th className="py-3.5 px-4 font-semibold">Attended / Total</th>
                <th className="py-3.5 px-4 font-semibold">Cumulative %</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      {student.rollNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      {student.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {student.parentName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {student.parentPhone}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {student.attendedClasses} / {student.totalClasses}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold border ${
                        student.attendancePercentage < 65
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : student.attendancePercentage < 75
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {student.attendancePercentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(student);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                        title="View Full Student Record"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Student Details Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={
            <div className="flex items-center gap-2.5">
              <span>{selectedStudent.name}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                {selectedStudent.rollNumber}
              </span>
            </div>
          }
          subtitle={`VIIT Computer Science & Engineering • Section ${selectedStudent.section}`}
          footer={
            <button
              onClick={() => setSelectedStudent(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Close Record
            </button>
          }
        >
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Attendance %</span>
                <p className={`text-xl font-heading font-bold mt-1 ${
                  selectedStudent.attendancePercentage < 65 ? 'text-rose-400' :
                  selectedStudent.attendancePercentage < 75 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {selectedStudent.attendancePercentage}%
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Classes Attended</span>
                <p className="text-xl font-heading font-bold text-slate-200 mt-1">
                  {selectedStudent.attendedClasses} <span className="text-xs text-slate-400 font-normal">/ {selectedStudent.totalClasses}</span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Academic Status</span>
                <p className="text-xs font-semibold text-indigo-400 mt-2">
                  Regular Enrolled
                </p>
              </div>
            </div>

            {/* Parent & Contact Verification */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Verified Guardian Information (Call Recipient)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Parent / Guardian:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedStudent.parentName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Registered Phone:</span>
                  <p className="font-mono text-indigo-400 mt-0.5">{selectedStudent.parentPhone}</p>
                </div>
              </div>
            </div>

            {/* Midterm Assessment Scores */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-400" />
                  <span>Midterm Evaluation Scores</span>
                </div>
                <span className="text-[11px] text-slate-400 font-normal">Independent Assessment DB</span>
              </div>

              {studentMarks.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
                  No midterm marks recorded yet for this student.
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Subject</th>
                        <th className="py-2.5 px-3 font-semibold">Assessment</th>
                        <th className="py-2.5 px-3 font-semibold">Score</th>
                        <th className="py-2.5 px-3 font-semibold">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {studentMarks.map(m => (
                        <tr key={m.id}>
                          <td className="py-2.5 px-3 font-medium text-slate-100">{m.subject}</td>
                          <td className="py-2.5 px-3 text-slate-400">{m.assessmentName}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">
                            {m.marksObtained} / {m.maxMarks}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{m.updatedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
