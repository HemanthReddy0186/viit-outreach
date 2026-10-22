import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Database,
  RefreshCw 
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SAMPLE_EXCEL_IMPORT_PREVIEW } from '../mockData';
import { ExcelImportPreviewRow } from '../types';

interface ExcelImportProps {
  onCommitSuccess: () => void;
}

export const ExcelImport: React.FC<ExcelImportProps> = ({ onCommitSuccess }) => {
  const [previewRows] = useState<ExcelImportPreviewRow[]>(SAMPLE_EXCEL_IMPORT_PREVIEW);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState(false);

  const validNewCount = previewRows.filter(r => r.status === 'VALID_NEW').length;
  const validUpdateCount = previewRows.filter(r => r.status === 'VALID_UPDATE').length;
  const invalidCount = previewRows.filter(r => r.status === 'INVALID').length;
  const duplicateCount = previewRows.filter(r => r.status === 'DUPLICATE').length;

  const handleCommit = () => {
    setIsCommitting(true);
    setTimeout(() => {
      setIsCommitting(false);
      setCommitSuccess(true);
      onCommitSuccess();
    }, 1200);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-pretitle">Batch Data Operations</div>
          <h1 className="page-title">Excel Import & Synchronization Studio</h1>
          <p className="page-description">
            Authoritative pre-commit validation (`FR-02`). Safeguards existing marks and suppresses duplicates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => alert("Downloaded validation error diagnostics log (error_audit_2026-10-22.csv).")}
            className="btn-tabler btn-tabler-outline"
          >
            <Download size={14} /> Download Error Log
          </button>
          <button
            type="button"
            onClick={handleCommit}
            disabled={isCommitting || commitSuccess}
            className="btn-tabler btn-tabler-primary"
          >
            {isCommitting ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Committing...
              </>
            ) : commitSuccess ? (
              <>
                <CheckCircle2 size={14} /> Committed to DB!
              </>
            ) : (
              <>
                <Database size={14} /> Confirm & Commit ({validNewCount + validUpdateCount})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Marks Preservation Callout */}
      <div className="institution-banner">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <ShieldCheck size={20} color="#0f766e" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ color: '#0f766e', fontSize: '0.85rem' }}>
              Midterm Marks Preservation Guarantee (`FR-05`)
            </strong>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
              Student attendance and examination marks are stored independently. Blank cells in the marks column of an attendance upload <strong>never</strong> erase or overwrite existing midterm marks.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Drop Zone Card */}
      <Card>
        <div style={{
          border: '2px dashed #cbd5e1',
          borderRadius: 8,
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          cursor: 'pointer'
        }}>
          <UploadCloud size={36} color="#0f766e" style={{ margin: '0 auto 0.5rem auto' }} />
          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
            Upload Section Attendance & Marks Spreadsheet
          </div>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
            Drag and drop your <code>.xlsx</code> or <code>.csv</code> roster file here, or click to browse.
          </p>
          <div style={{
            marginTop: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            fontSize: '0.72rem',
            color: '#334155'
          }}>
            <FileSpreadsheet size={14} color="#0f766e" />
            Loaded file: <strong>VIIT_CSE_II_SecA_Attendance_2026-10-22.xlsx</strong> (4 records parsed)
          </div>
        </div>
      </Card>

      {/* Metric Counters */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-card-label">Valid New Students</div>
          <div className="metric-card-value" style={{ color: '#0f766e' }}>{validNewCount}</div>
          <div className="metric-card-subtext">Will insert master record</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-label">Valid Updates</div>
          <div className="metric-card-value" style={{ color: '#0284c7' }}>{validUpdateCount}</div>
          <div className="metric-card-subtext">Preserves existing marks</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-label">Validation Errors</div>
          <div className="metric-card-value" style={{ color: '#e11d48' }}>{invalidCount}</div>
          <div className="metric-card-subtext">Malformed phone number</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-label">Suppressed Duplicates</div>
          <div className="metric-card-value" style={{ color: '#d97706' }}>{duplicateCount}</div>
          <div className="metric-card-subtext">Prevents double-entry</div>
        </div>
      </div>

      {/* Validation Audit Table */}
      <Card
        title="Validation Pre-Commit Audit Table"
        subtitle="Review row status, column auto-mapping, and error diagnostics before final database commit"
      >
        <div className="table-responsive">
          <table className="tabler-table">
            <thead>
              <tr>
                <th>Row #</th>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Sec</th>
                <th>Parent Phone</th>
                <th>Attendance</th>
                <th>Marks</th>
                <th>Audit Status</th>
                <th>Validation Diagnostics</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map(row => {
                let badgeVariant: any = 'neutral';
                let label: string = row.status;
                if (row.status === 'VALID_NEW') { badgeVariant = 'success'; label = 'NEW RECORD'; }
                if (row.status === 'VALID_UPDATE') { badgeVariant = 'info'; label = 'VALID UPDATE'; }
                if (row.status === 'INVALID') { badgeVariant = 'danger'; label = 'VALIDATION FAILED'; }
                if (row.status === 'DUPLICATE') { badgeVariant = 'warning'; label = 'DUPLICATE SUPPRESSED'; }

                return (
                  <tr key={row.rowNumber}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.rowNumber}</td>
                    <td className="roll-number">{row.rollNumber}</td>
                    <td style={{ fontWeight: 600 }}>{row.studentName}</td>
                    <td>{row.section}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{row.parentPhone}</td>
                    <td>{row.attendanceStatus || '—'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {row.marksObtained ? (
                        <strong style={{ color: '#0f766e' }}>{row.marksObtained}</strong>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#d97706', fontStyle: 'italic' }}>[Blank - Preserved]</span>
                      )}
                    </td>
                    <td>
                      <Badge variant={badgeVariant}>{label}</Badge>
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>
                      {row.validationErrors.length > 0 ? (
                        <span style={{ color: row.status === 'INVALID' ? '#e11d48' : '#64748b' }}>
                          {row.validationErrors.join(', ')}
                        </span>
                      ) : (
                        <span style={{ color: '#0f766e' }}>Passed all checks</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
