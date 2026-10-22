import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Download, 
  ArrowRight,
  Database,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SAMPLE_EXCEL_IMPORT_PREVIEW } from '../mockData';
import { ExcelImportPreviewRow } from '../types';

interface ExcelImportProps {
  onCommitSuccess: () => void;
}

export const ExcelImport: React.FC<ExcelImportProps> = ({ onCommitSuccess }) => {
  const [fileUploaded, setFileUploaded] = useState(true); // Demo loaded state
  const [previewRows, setPreviewRows] = useState<ExcelImportPreviewRow[]>(SAMPLE_EXCEL_IMPORT_PREVIEW);
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
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-heading font-bold text-slate-100 tracking-tight">
          Excel Data Import & Synchronization Studio
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Authoritative validation pipeline (`FR-02`). Previews and audits records before writing to the database.
        </p>
      </div>

      {/* Critical Marks Preservation Assurance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-start gap-3.5 shadow-lg">
        <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-semibold text-emerald-300">
            Midterm Marks Preservation Guarantee (`FR-05`)
          </h4>
          <p className="text-slate-300 leading-relaxed">
            Attendance and examination assessments are segregated in separate relational tables. 
            If an uploaded Excel sheet contains blank cells in the marks column, the system <strong>will strictly preserve</strong> existing official midterm marks and will never delete or overwrite them.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <Card>
        <div className="p-8 border-2 border-dashed border-slate-700/80 hover:border-indigo-500/60 rounded-2xl bg-slate-950/50 flex flex-col items-center justify-center text-center transition-all cursor-pointer group">
          <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform mb-3">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">
            Upload VIIT Section Excel Attendance Sheet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Supports <code className="text-indigo-300 font-mono">.xlsx</code>, <code className="text-indigo-300 font-mono">.xls</code>, and <code className="text-indigo-300 font-mono">.csv</code> up to 10MB.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-400">
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Active Sample: <strong className="text-slate-200">VIIT_CSE_II_SecA_Attendance_2026-10-22.xlsx</strong> (4 records parsed)</span>
          </div>
        </div>
      </Card>

      {/* Validation Summary Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide">Valid New Students</span>
          <p className="text-2xl font-heading font-bold text-emerald-400 mt-1">{validNewCount}</p>
          <span className="text-[10px] text-slate-400">Will insert master record</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wide">Valid Updates</span>
          <p className="text-2xl font-heading font-bold text-cyan-400 mt-1">{validUpdateCount}</p>
          <span className="text-[10px] text-slate-400">Preserves existing marks</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wide">Validation Errors</span>
          <p className="text-2xl font-heading font-bold text-rose-400 mt-1">{invalidCount}</p>
          <span className="text-[10px] text-slate-400">Will be rejected / skipped</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">Suppressed Duplicates</span>
          <p className="text-2xl font-heading font-bold text-amber-400 mt-1">{duplicateCount}</p>
          <span className="text-[10px] text-slate-400">Prevents double-entry</span>
        </div>
      </div>

      {/* Pre-Commit Row-by-Row Preview Table */}
      <Card
        title="Validation Pre-Commit Audit Table"
        subtitle="Review row status, column auto-mapping, and error diagnostics before final database commit"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Downloaded validation error diagnostics log (error_audit_2026-10-22.csv).")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download Error Report
            </button>
            <button
              onClick={handleCommit}
              disabled={isCommitting || commitSuccess}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all ${
                commitSuccess
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isCommitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Committing...
                </>
              ) : commitSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Committed to DB!
                </>
              ) : (
                <>
                  <Database className="h-3.5 w-3.5" /> Confirm & Commit Valid Rows ({validNewCount + validUpdateCount})
                </>
              )}
            </button>
          </div>
        }
      >
        <div 
          tabIndex={0} 
          role="region" 
          aria-label="Excel Validation Preview Table"
          className="table-wrapper max-h-[500px] overflow-auto"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80">
                <th className="py-3 px-3 font-semibold">Row #</th>
                <th className="py-3 px-3 font-semibold">Roll Number</th>
                <th className="py-3 px-3 font-semibold">Student Name</th>
                <th className="py-3 px-3 font-semibold">Sec</th>
                <th className="py-3 px-3 font-semibold">Parent Phone</th>
                <th className="py-3 px-3 font-semibold">Attendance</th>
                <th className="py-3 px-3 font-semibold">Marks</th>
                <th className="py-3 px-3 font-semibold">Audit Result</th>
                <th className="py-3 px-3 font-semibold">Validation Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {previewRows.map((row) => {
                let badgeVariant: any = 'neutral';
                let label: string = row.status;
                if (row.status === 'VALID_NEW') { badgeVariant = 'success'; label = 'NEW RECORD'; }
                if (row.status === 'VALID_UPDATE') { badgeVariant = 'info'; label = 'VALID UPDATE'; }
                if (row.status === 'INVALID') { badgeVariant = 'danger'; label = 'VALIDATION FAILED'; }
                if (row.status === 'DUPLICATE') { badgeVariant = 'warning'; label = 'DUPLICATE SUPPRESSED'; }

                return (
                  <tr key={row.rowNumber} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400 font-bold">{row.rowNumber}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-200">{row.rollNumber}</td>
                    <td className="py-3 px-3 font-medium text-slate-100">{row.studentName}</td>
                    <td className="py-3 px-3 font-mono">{row.section}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{row.parentPhone}</td>
                    <td className="py-3 px-3 font-mono">
                      {row.attendanceStatus || <span className="text-slate-400 font-italic">—</span>}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {row.marksObtained ? (
                        <span className="font-bold text-indigo-400">{row.marksObtained}</span>
                      ) : (
                        <span className="text-amber-400/80 font-mono text-[11px]">[Blank - Preserved]</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={badgeVariant} dot>
                        {label}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-400">
                      {row.validationErrors.length > 0 ? (
                        <span className={row.status === 'INVALID' ? 'text-rose-400 font-medium' : 'text-slate-400'}>
                          {row.validationErrors.join(', ')}
                        </span>
                      ) : (
                        <span className="text-emerald-400">All checks passed</span>
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
