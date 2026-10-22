import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldAlert, 
  BookOpen, 
  Award, 
  Search, 
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Student, StudentMark } from '../types';

interface MidtermMarksProps {
  students: Student[];
  marks: StudentMark[];
  selectedSection: string;
}

export const MidtermMarks: React.FC<MidtermMarksProps> = ({
  students,
  marks,
  selectedSection
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'ALL' | 'DBMS' | 'Operating Systems' | 'Python Programming'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const sectionStudents = students.filter(s => s.section === selectedSection);

  const filteredMarks = marks.filter(m => {
    const matchesSection = m.section === selectedSection;
    const matchesSubject = selectedSubject === 'ALL' || m.subject === selectedSubject;
    const matchesSearch = 
      m.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.studentRoll.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-heading font-bold text-slate-100 tracking-tight">
          Midterm Evaluation & Assessment Registry
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Academic marks are isolated in independent database tables (`FR-05`) with role-based access control.
        </p>
      </div>

      {/* Security & AI Safeguard Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 flex items-start gap-3.5 shadow-lg">
        <Lock className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-semibold text-indigo-300">
            AI Voice Boundary & Security Constraint (`FR-08`, `FR-09`)
          </h4>
          <p className="text-slate-300 leading-relaxed">
            The AI voice caller operates strictly as a <strong>read-only consumer</strong> of officially approved assessment scores. 
            The AI will <strong>never</strong> predict, invent, or alter marks. Marks are only disclosed over the phone after verified parent authentication and explicit consent.
          </p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedSubject('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedSubject === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Subjects
          </button>
          <button
            onClick={() => setSelectedSubject('DBMS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedSubject === 'DBMS' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            DBMS
          </button>
          <button
            onClick={() => setSelectedSubject('Operating Systems')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedSubject === 'Operating Systems' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Operating Systems
          </button>
          <button
            onClick={() => setSelectedSubject('Python Programming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedSubject === 'Python Programming' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Python
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by student or roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 w-64 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Marks Records Table */}
      <Card className="p-0 overflow-hidden">
        <div 
          tabIndex={0} 
          role="region" 
          aria-label="Midterm Assessment Records"
          className="table-wrapper max-h-[600px] overflow-auto"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80">
                <th className="py-3 px-4 font-semibold">Roll Number</th>
                <th className="py-3 px-4 font-semibold">Student Name</th>
                <th className="py-3 px-4 font-semibold">Assessment</th>
                <th className="py-3 px-4 font-semibold">Subject</th>
                <th className="py-3 px-4 font-semibold">Marks Obtained</th>
                <th className="py-3 px-4 font-semibold">Percentage</th>
                <th className="py-3 px-4 font-semibold">Last Recorded</th>
                <th className="py-3 px-4 font-semibold text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredMarks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No assessment records found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredMarks.map((m) => {
                  const pct = ((m.marksObtained / m.maxMarks) * 100).toFixed(1);
                  return (
                    <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                        {m.studentRoll}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-100">
                        {m.studentName}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <Badge variant="indigo">{m.assessmentName}</Badge>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {m.subject}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-100">
                        <span className="text-indigo-400 text-sm">{m.marksObtained}</span> / {m.maxMarks}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          Number(pct) >= 75 ? 'text-emerald-400 bg-emerald-500/10' :
                          Number(pct) >= 50 ? 'text-amber-300 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          {pct}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {m.updatedAt}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Locked
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
