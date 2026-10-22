import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  GraduationCap 
} from 'lucide-react';
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
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-pretitle">Section {selectedSection}</div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-description">
            {filteredStudents.length} students enrolled in Section {selectedSection}.
          </p>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
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

          <div className="segmented-control">
            <button
              type="button"
              onClick={() => setFilterTier('ALL')}
              className={`segmented-btn ${filterTier === 'ALL' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterTier('SAFE')}
              className={`segmented-btn ${filterTier === 'SAFE' ? 'active' : ''}`}
            >
              ≥ 75%
            </button>
            <button
              type="button"
              onClick={() => setFilterTier('WARNING')}
              className={`segmented-btn ${filterTier === 'WARNING' ? 'active' : ''}`}
            >
              65–74%
            </button>
            <button
              type="button"
              onClick={() => setFilterTier('CRITICAL')}
              className={`segmented-btn ${filterTier === 'CRITICAL' ? 'active' : ''}`}
            >
              &lt; 65%
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="tabler-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Parent / Guardian</th>
              <th>Contact Phone</th>
              <th>Attended / Total</th>
              <th>Attendance</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr 
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="roll-number">{student.rollNumber}</td>
                  <td style={{ fontWeight: 600 }}>{student.name}</td>
                  <td>{student.parentName}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>
                    {student.parentPhone}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    {student.attendedClasses} / {student.totalClasses}
                  </td>
                  <td>
                    <span className={`status-pill ${
                      student.attendancePercentage < 65 ? 'status-pill-danger' :
                      student.attendancePercentage < 75 ? 'status-pill-warning' : 'status-pill-success'
                    }`}>
                      {student.attendancePercentage}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                      }}
                      className="btn-tabler btn-tabler-outline btn-tabler-sm"
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{selectedStudent.name}</span>
              <span className="status-pill status-pill-teal" style={{ fontFamily: 'var(--font-mono)' }}>
                {selectedStudent.rollNumber}
              </span>
            </div>
          }
          subtitle={`Section ${selectedStudent.section}`}
          footer={
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="btn-tabler btn-tabler-outline"
            >
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Stat Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: 6, textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Attendance</div>
                <div style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  marginTop: '0.2rem',
                  color: selectedStudent.attendancePercentage < 65 ? '#dc2626' : selectedStudent.attendancePercentage < 75 ? '#d97706' : '#0f766e'
                }}>
                  {selectedStudent.attendancePercentage}%
                </div>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: 6, textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Classes</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '0.2rem', color: '#0f172a' }}>
                  {selectedStudent.attendedClasses} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>/ {selectedStudent.totalClasses}</span>
                </div>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: 6, textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Status</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.45rem', color: '#0f766e' }}>
                  Enrolled
                </div>
              </div>
            </div>

            {/* Parent Contact */}
            <div style={{ padding: '0.85rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 6 }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                Parent / Guardian Contact
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Name:</div>
                  <strong style={{ color: '#0f172a' }}>{selectedStudent.parentName}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Phone:</div>
                  <strong style={{ color: '#0f766e', fontFamily: 'var(--font-mono)' }}>{selectedStudent.parentPhone}</strong>
                </div>
              </div>
            </div>

            {/* Midterm Scores */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                <GraduationCap size={15} color="#0f766e" /> Midterm Marks
              </div>

              {studentMarks.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: 6 }}>
                  No midterm marks recorded yet.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="tabler-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Assessment</th>
                        <th>Marks Obtained</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentMarks.map(m => (
                        <tr key={m.id}>
                          <td style={{ fontWeight: 600 }}>{m.subject}</td>
                          <td><Badge variant="teal">{m.assessmentName}</Badge></td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0f766e' }}>
                            {m.marksObtained} / {m.maxMarks}
                          </td>
                          <td style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{m.updatedAt}</td>
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
