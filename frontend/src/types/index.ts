export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  department: string;
  yearOfStudy: number;
  section: string;
  parentName: string;
  parentPhone: string;
  attendancePercentage: number;
  totalClasses: number;
  attendedClasses: number;
  active: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  section: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'ON_DUTY';
  confirmedForCall: boolean;
}

export interface StudentMark {
  id: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  section: string;
  assessmentName: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
  updatedAt: string;
}

export interface CallTranscriptLine {
  speaker: 'AI Assistant' | 'Parent' | 'IVR (Telugu)' | 'IVR' | string;
  text: string;
  time: string;
}

export interface CallTask {
  id: string;
  studentRoll: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  attendanceDate: string;
  status: 'QUEUED' | 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_ANSWER' | 'FAILED';
  recipientVerified: boolean;
  marksDisclosed: boolean;
  queryLogged: boolean;
  querySummary?: string;
  durationSeconds: number;
  timestamp: string;
  transcript: CallTranscriptLine[];
}

export interface ParentQuery {
  id: string;
  callTaskId?: string;
  studentRoll: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  category: 'ATTENDANCE_DISPUTE' | 'HEALTH_LEAVE' | 'FEE_QUERY' | 'EXAM_SCHEDULE' | 'GENERAL';
  summary: string;
  assignedCoordinator: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface ExcelImportPreviewRow {
  rowNumber: number;
  rollNumber: string;
  studentName: string;
  department?: string;
  section: string;
  parentName?: string;
  parentPhone: string;
  attendanceStatus?: string;
  marksObtained?: string;
  status: 'VALID_NEW' | 'VALID_UPDATE' | 'INVALID' | 'DUPLICATE';
  validationErrors: string[];
}
