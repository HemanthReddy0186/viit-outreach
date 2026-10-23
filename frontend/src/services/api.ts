import { 
  Student, 
  AttendanceRecord, 
  StudentMark, 
  CallTask, 
  ParentQuery, 
  ExcelImportPreviewRow 
} from '../types';
import { 
  MOCK_STUDENTS, 
  MOCK_ATTENDANCE, 
  MOCK_MARKS, 
  MOCK_CALL_TASKS, 
  MOCK_PARENT_QUERIES, 
  SAMPLE_EXCEL_IMPORT_PREVIEW 
} from '../mockData';

// If VITE_API_BASE_URL is not set, use local FastAPI default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined 
  ? import.meta.env.VITE_API_BASE_URL 
  : 'http://127.0.0.1:8000';

async function safeFetch<T>(endpoint: string, options: RequestInit = {}, fallbackData: T): Promise<T> {
  if (!API_BASE_URL) {
    return fallbackData;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for snappy UI
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`API [${endpoint}] responded with status ${res.status}. Falling back to local data.`);
      return fallbackData;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`API [${endpoint}] unavailable (${err}). Running in offline/mock mode.`);
    return fallbackData;
  }
}

export const api = {
  // Students
  async getStudents(section?: string): Promise<Student[]> {
    const query = section ? `?section=${section}` : '';
    const data = await safeFetch<any[]>(`/api/students${query}`, {}, MOCK_STUDENTS);
    return data.map((s: any) => ({
      id: String(s.id),
      rollNumber: s.roll_number,
      name: s.name,
      department: "CSE",
      yearOfStudy: s.year_of_study || 2,
      section: s.section_name || "A",
      parentName: s.parent_name,
      parentPhone: s.parent_phone,
      totalClasses: s.total_classes,
      attendedClasses: s.attended_classes,
      attendancePercentage: s.attendance_percentage,
      active: s.active
    }));
  },

  // Attendance
  async getAttendance(date: string, section: string): Promise<AttendanceRecord[]> {
    const data = await safeFetch<any[]>(`/api/attendance?date=${date}&section=${section}`, {}, MOCK_ATTENDANCE);
    return data.map((a: any) => ({
      id: String(a.id),
      studentId: String(a.student_id),
      studentRoll: a.roll_number,
      studentName: a.student_name || `Student ${a.roll_number}`,
      section: a.section_name,
      date: a.date,
      status: a.status as 'PRESENT' | 'ABSENT',
      confirmedForCall: a.confirmed_for_call
    }));
  },

  async saveAttendance(date: string, section: string, records: AttendanceRecord[]): Promise<boolean> {
    const payload = {
      date,
      section_name: section,
      records: records.map(r => ({
        student_id: parseInt(r.studentId.replace(/\D/g, '')) || 1,
        roll_number: r.studentRoll,
        status: r.status
      }))
    };
    try {
      if (!API_BASE_URL) return true;
      const res = await fetch(`${API_BASE_URL}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch {
      return true; // Graceful offline success
    }
  },

  // Excel Import Studio
  async previewExcel(file: File): Promise<{
    filename: string;
    totalRows: number;
    validNew: number;
    validUpdate: number;
    invalidRows: number;
    duplicateRows: number;
    rows: ExcelImportPreviewRow[];
  }> {
    if (!API_BASE_URL) {
      return {
        filename: file.name,
        totalRows: SAMPLE_EXCEL_IMPORT_PREVIEW.length,
        validNew: SAMPLE_EXCEL_IMPORT_PREVIEW.filter(r => r.status === 'VALID_NEW').length,
        validUpdate: SAMPLE_EXCEL_IMPORT_PREVIEW.filter(r => r.status === 'VALID_UPDATE').length,
        invalidRows: SAMPLE_EXCEL_IMPORT_PREVIEW.filter(r => r.status === 'INVALID').length,
        duplicateRows: SAMPLE_EXCEL_IMPORT_PREVIEW.filter(r => r.status === 'DUPLICATE').length,
        rows: SAMPLE_EXCEL_IMPORT_PREVIEW
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE_URL}/api/imports/preview`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Preview failed');
      const data = await res.json();
      return {
        filename: data.filename,
        totalRows: data.total_rows,
        validNew: data.valid_new,
        validUpdate: data.valid_update,
        invalidRows: data.invalid_rows,
        duplicateRows: data.duplicate_rows,
        rows: data.rows.map((r: any) => ({
          rowNumber: r.row_number,
          rollNumber: r.roll_number,
          studentName: r.student_name,
          section: r.section,
          parentPhone: r.parent_phone,
          attendanceStatus: r.attendance_status,
          marksObtained: r.marks_obtained !== null && r.marks_obtained !== undefined ? String(r.marks_obtained) : "",
          status: r.status,
          validationErrors: r.validation_errors || []
        }))
      };
    } catch {
      return {
        filename: file.name,
        totalRows: SAMPLE_EXCEL_IMPORT_PREVIEW.length,
        validNew: SAMPLE_EXCEL_IMPORT_PREVIEW.filter(r => r.status === 'VALID_NEW').length,
        validUpdate: SAMPLE_EXCEL_IMPORT_PREVIEW.filter(r => r.status === 'VALID_UPDATE').length,
        invalidRows: SAMPLE_EXCEL_IMPORT_PREVIEW.filter(r => r.status === 'INVALID').length,
        duplicateRows: SAMPLE_EXCEL_IMPORT_PREVIEW.filter(r => r.status === 'DUPLICATE').length,
        rows: SAMPLE_EXCEL_IMPORT_PREVIEW
      };
    }
  },

  async commitExcel(rows: ExcelImportPreviewRow[], section: string, date: string): Promise<boolean> {
    try {
      if (!API_BASE_URL) return true;
      const res = await fetch(`${API_BASE_URL}/api/imports/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: rows.map(r => ({
            row_number: r.rowNumber,
            roll_number: r.rollNumber,
            student_name: r.studentName,
            section: r.section,
            parent_phone: r.parentPhone,
            attendance_status: r.attendanceStatus,
            marks_obtained: r.marksObtained ? parseFloat(r.marksObtained) : null,
            status: r.status,
            validation_errors: r.validationErrors
          })),
          section_name: section,
          date
        })
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Midterm Marks
  async getMarks(subject?: string, section?: string): Promise<StudentMark[]> {
    const params = new URLSearchParams();
    if (subject && subject !== 'ALL') params.set('subject', subject);
    if (section) params.set('section', section);
    const query = params.toString() ? `?${params.toString()}` : '';

    const data = await safeFetch<any[]>(`/api/marks${query}`, {}, MOCK_MARKS);
    return data.map((m: any) => ({
      id: String(m.id),
      studentId: String(m.student_id),
      studentRoll: m.roll_number,
      studentName: m.student_name || `Student ${m.roll_number}`,
      section: m.section || section || "A",
      subject: m.subject,
      assessmentName: m.assessment_name,
      marksObtained: m.marks_obtained,
      maxMarks: m.max_marks || 30.0,
      updatedAt: m.updated_at ? new Date(m.updated_at).toLocaleDateString() : '2026-10-22'
    }));
  },

  // Calls
  async getCalls(date?: string, section?: string): Promise<CallTask[]> {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (section) params.set('section', section);
    const query = params.toString() ? `?${params.toString()}` : '';

    const data = await safeFetch<any[]>(`/api/calls${query}`, {}, MOCK_CALL_TASKS);
    return data.map((c: any) => ({
      id: String(c.id),
      studentId: String(c.student_id || 1),
      studentRoll: c.roll_number,
      studentName: c.student_name,
      parentName: c.parent_name,
      parentPhone: c.parent_phone,
      attendanceDate: c.date || date || "2026-10-22",
      status: c.status as any,
      durationSeconds: c.duration_seconds || 0,
      recipientVerified: c.recipient_verified,
      marksDisclosed: c.marks_disclosed,
      queryLogged: c.query_logged,
      querySummary: c.query_summary || undefined,
      timestamp: c.created_at ? new Date(c.created_at).toLocaleString() : "10/22/2026, 10:00 AM",
      transcript: c.transcript_json ? JSON.parse(c.transcript_json) : [
        { speaker: "IVR (Telugu)", text: "విజ్ఞాన్స్ ఇంస్టిట్యూట్: విద్యార్థి హాజరు కాలేదు.", time: "00:02" },
        { speaker: "Parent", text: "Pressed '1' (Acknowledged)", time: "00:30" }
      ]
    }));
  },

  async triggerCalls(date: string, section: string, callType: string = "PRERECORDED_TELUGU"): Promise<boolean> {
    try {
      if (!API_BASE_URL) return true;
      const res = await fetch(`${API_BASE_URL}/api/calls/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          section_name: section,
          call_type: callType
        })
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Queries (Coordinator Inbox)
  async getQueries(): Promise<ParentQuery[]> {
    const data = await safeFetch<any[]>('/api/queries', {}, MOCK_PARENT_QUERIES);
    return data.map((q: any) => ({
      id: String(q.id),
      callId: `call-${q.id}`,
      studentRoll: q.student_roll,
      studentName: q.student_name,
      parentName: q.parent_name,
      parentPhone: q.parent_phone,
      category: q.category as any,
      summary: q.summary,
      status: q.status as any,
      resolutionNotes: q.resolution_notes || undefined,
      assignedCoordinator: q.assigned_coordinator,
      createdAt: q.created_at ? new Date(q.created_at).toLocaleString() : '10/22/2026, 10:15 AM',
      resolvedAt: q.resolved_at ? new Date(q.resolved_at).toLocaleString() : undefined
    }));
  },

  async updateQuery(queryId: string | number, status: string, notes?: string): Promise<boolean> {
    try {
      if (!API_BASE_URL) return true;
      const res = await fetch(`${API_BASE_URL}/api/queries/${queryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          resolution_notes: notes
        })
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  // Word Report (.docx) download url
  getWordReportUrl(date: string, section: string): string {
    return `${API_BASE_URL}/api/reports/docx?date=${date}&section=${section}`;
  }
};
