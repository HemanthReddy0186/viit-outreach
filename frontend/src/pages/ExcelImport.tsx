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
          <div className="page-pretitle">Data Synchronization</div>
          <h1 className="page-title">Excel Import</h1>
          <p className="page-description">
            Upload attendance spreadsheets to synchronize section records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => alert("Downloaded validation log (error_audit.csv).")}
            className="btn-tabler btn-tabler-outline btn-tabler-sm"
          >
            <Download size={13} /> Error Log
          </button>
          <button
            type="button"
            onClick={handleCommit}
            disabled={isCommitting || commitSuccess}
            className="btn-tabler btn-tabler-primary btn-tabler-sm"
          >
            {isCommitting ? (
              <>
                <RefreshCw size={13} className="animate-spin" /> Committing...
              </>
            ) : commitSuccess ? (
              <>
                <CheckCircle2 size={13} /> Committed!
              </>
            ) : (
              <>
                <Database size={13} /> Commit ({validNewCount + validUpdateCount}) Records
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload Drop Zone Card */}
      <Card>
        <div style={{
          border: '1px dashed #cbd5e1',
          borderRadius: 6,
          padding: '2rem 1.5rem',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          cursor: 'pointer'
        }}>
          <UploadCloud size={32} color="#0f766e" style={{ margin: '0 auto 0.5rem auto' }} />
          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>
            Upload Attendance & Marks Spreadsheet
          </div>
          <p style={{ margin: '0.2rem 0 0.75rem 0', fontSize: '0.75rem', color: '#64748b' }}>
            Drag and drop your <code>.xlsx</code> or <code>.csv</code> file, or click to browse.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.65rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            fontSize: '0.72rem',
            color: '#334155'
          }}>
            <FileSpreadsheet size={13} color="#0f766e" />
            Loaded: <strong>VIIT_CSE_II_SecA_Attendance.xlsx</strong> (4 records parsed)
          </div>
        </div>

        <div style={{ marginTop: '0.85rem' }} className="subtle-hint">
          <ShieldCheck size={14} color="#0f766e" style={{ flexShrink: 0 }} />
          <span>Existing midterm marks are stored independently and will not be overwritten by blank cells.</span>
        </div>
      </Card>

      {/* Metric Counters */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-card-label">New Records</div>
          <div className="metric-card-value" style={{ color: '#0f766e' }}>{validNewCount}</div>
          <div className="metric-card-subtext">Will insert new student</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-label">Valid Updates</div>
          <div className="metric-card-value" style={{ color: '#0f766e' }}>{validUpdateCount}</div>
          <div className="metric-card-subtext">Updates attendance record</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-label">Validation Errors</div>
          <div className="metric-card-value" style={{ color: '#dc2626' }}>{invalidCount}</div>
          <div className="metric-card-subtext">Requires correction</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-label">Duplicates</div>
          <div className="metric-card-value" style={{ color: '#d97706' }}>{duplicateCount}</div>
          <div className="metric-card-subtext">Ignored automatically</div>
        </div>
      </div>

      {/* Preview Table */}
      <Card title="Pre-Commit Preview">
        <div className="table-responsive">
          <table className="tabler-table">
            <thead>
              <tr>
                <th>Row</th>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Sec</th>
                <th>Parent Phone</th>
                <th>Attendance</th>
                <th>Marks</th>
                <th>Status</th>
                <th>Diagnostics</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map(row => {
                let badgeVariant: any = 'neutral';
                let label: string = row.status;
                if (row.status === 'VALID_NEW') { badgeVariant = 'success'; label = 'NEW'; }
                if (row.status === 'VALID_UPDATE') { badgeVariant = 'teal'; label = 'UPDATE'; }
                if (row.status === 'INVALID') { badgeVariant = 'danger'; label = 'ERROR'; }
                if (row.status === 'DUPLICATE') { badgeVariant = 'warning'; label = 'DUPLICATE'; }

                return (
                  <tr key={row.rowNumber}>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{row.rowNumber}</td>
                    <td className="roll-number">{row.rollNumber}</td>
                    <td style={{ fontWeight: 600 }}>{row.studentName}</td>
                    <td>{row.section}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{row.parentPhone}</td>
                    <td>{row.attendanceStatus || '—'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {row.marksObtained ? (
                        <strong style={{ color: '#0f766e' }}>{row.marksObtained}</strong>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>[Preserved]</span>
                      )}
                    </td>
                    <td>
                      <Badge variant={badgeVariant}>{label}</Badge>
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>
                      {row.validationErrors.length > 0 ? (
                        <span style={{ color: row.status === 'INVALID' ? '#dc2626' : '#64748b' }}>
                          {row.validationErrors.join(', ')}
                        </span>
                      ) : (
                        <span style={{ color: '#0f766e' }}>Valid</span>
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
