import React, { useState } from 'react';
import { 
  Lock, 
  Search, 
  CheckCircle2, 
  ShieldCheck 
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

  const filteredMarks = marks.filter(m => {
    const matchesSection = m.section === selectedSection;
    const matchesSubject = selectedSubject === 'ALL' || m.subject === selectedSubject;
    const matchesSearch = 
      m.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.studentRoll.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSubject && matchesSearch;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-pretitle">Academic Assessment Registry</div>
          <h1 className="page-title">Midterm Examination Scores</h1>
          <p className="page-description">
            Assessment scores stored independently (`FR-05`). Protected from bulk attendance overwrites.
          </p>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ position: 'relative', width: 200 }}>
            <input
              type="search"
              placeholder="Search student or roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.35rem 0.65rem 0.35rem 1.8rem', fontSize: '0.78rem', height: 32, margin: 0 }}
            />
            <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>

          <div className="segmented-control">
            <button
              type="button"
              onClick={() => setSelectedSubject('ALL')}
              className={`segmented-btn ${selectedSubject === 'ALL' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedSubject('DBMS')}
              className={`segmented-btn ${selectedSubject === 'DBMS' ? 'active' : ''}`}
            >
              DBMS
            </button>
            <button
              type="button"
              onClick={() => setSelectedSubject('Operating Systems')}
              className={`segmented-btn ${selectedSubject === 'Operating Systems' ? 'active' : ''}`}
            >
              OS
            </button>
            <button
              type="button"
              onClick={() => setSelectedSubject('Python Programming')}
              className={`segmented-btn ${selectedSubject === 'Python Programming' ? 'active' : ''}`}
            >
              Python
            </button>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="institution-banner">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <Lock size={18} color="#0f766e" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ color: '#0f766e', fontSize: '0.85rem' }}>
              AI Read-Only Security Boundary (`FR-08`, `FR-09`)
            </strong>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
              The AI assistant is strictly a <strong>read-only consumer</strong> of official assessment scores. Official marks are never generated or modified by AI. Marks are disclosed to parents only after explicit identity verification and parental consent.
            </p>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="table-responsive">
        <table className="tabler-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Assessment</th>
              <th>Subject</th>
              <th>Marks Obtained</th>
              <th>Percentage</th>
              <th>Recorded Date</th>
              <th style={{ textAlign: 'right' }}>Security Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarks.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No examination records match the selected subject filter.
                </td>
              </tr>
            ) : (
              filteredMarks.map(m => {
                const pct = ((m.marksObtained / m.maxMarks) * 100).toFixed(1);
                return (
                  <tr key={m.id}>
                    <td className="roll-number">{m.studentRoll}</td>
                    <td style={{ fontWeight: 600 }}>{m.studentName}</td>
                    <td>
                      <Badge variant="teal">{m.assessmentName}</Badge>
                    </td>
                    <td style={{ fontWeight: 600 }}>{m.subject}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      <strong style={{ color: '#0f766e', fontSize: '0.9rem' }}>{m.marksObtained}</strong> / {m.maxMarks}
                    </td>
                    <td>
                      <span className={`status-pill ${
                        Number(pct) >= 75 ? 'status-pill-success' : Number(pct) >= 50 ? 'status-pill-warning' : 'status-pill-danger'
                      }`}>
                        {pct}%
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                      {m.updatedAt}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="status-pill status-pill-success" style={{ fontSize: '0.7rem' }}>
                        <CheckCircle2 size={12} /> Read-Only
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
