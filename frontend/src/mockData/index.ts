import { Student, AttendanceRecord, StudentMark, CallTask, ParentQuery, ExcelImportPreviewRow } from '../types';

export const INSTITUTION_INFO = {
  name: "Vignan's Institute of Information Technology (Autonomous)",
  shortName: "VIIT",
  campus: "Beside VSEZ, Duvvada, Vadlapudi Post, Gajuwaka, Visakhapatnam - 530049",
  department: "Department of Computer Science and Engineering",
  academicYear: "2026-2027",
  semester: "II B.Tech I Semester",
  coordinators: [
    { name: "Dr. K. Srinivasa Rao", role: "Associate Professor & Section-A Coordinator", email: "ksrao@vignan.ac.in" },
    { name: "Mrs. P. Lakshmi", role: "Assistant Professor & Section-B Coordinator", email: "plakshmi@vignan.ac.in" }
  ]
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: "std-01",
    rollNumber: "23L31A0501",
    name: "Aaditya Varma Penumatsa",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "P. Satyanarayana Varma",
    parentPhone: "+91 98480 23145",
    totalClasses: 110,
    attendedClasses: 94,
    attendancePercentage: 85.45,
    active: true
  },
  {
    id: "std-02",
    rollNumber: "23L31A0502",
    name: "Bandaru Harsha Vardhan",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "B. Venkateswara Rao",
    parentPhone: "+91 98481 44521",
    totalClasses: 110,
    attendedClasses: 72,
    attendancePercentage: 65.45,
    active: true
  },
  {
    id: "std-03",
    rollNumber: "23L31A0503",
    name: "Chodisetty Sai Pranathi",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "Ch. Ramana Murthy",
    parentPhone: "+91 98482 78912",
    totalClasses: 110,
    attendedClasses: 102,
    attendancePercentage: 92.73,
    active: true
  },
  {
    id: "std-04",
    rollNumber: "23L31A0504",
    name: "Duvvada Tarun Kumar",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "D. Someswara Rao",
    parentPhone: "+91 98483 33214",
    totalClasses: 110,
    attendedClasses: 68,
    attendancePercentage: 61.82,
    active: true
  },
  {
    id: "std-05",
    rollNumber: "23L31A0505",
    name: "Gadiraju Meghana",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "G. Vijaya Bhaskar Raju",
    parentPhone: "+91 98484 55678",
    totalClasses: 110,
    attendedClasses: 98,
    attendancePercentage: 89.09,
    active: true
  },
  {
    id: "std-06",
    rollNumber: "23L31A0506",
    name: "Gudivada Rakesh",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "G. Srinivasa Rao",
    parentPhone: "+91 98485 11987",
    totalClasses: 110,
    attendedClasses: 79,
    attendancePercentage: 71.82,
    active: true
  },
  {
    id: "std-07",
    rollNumber: "23L31A0507",
    name: "Jalagadugula Yamini",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "J. Appala Naidu",
    parentPhone: "+91 98486 99012",
    totalClasses: 110,
    attendedClasses: 91,
    attendancePercentage: 82.73,
    active: true
  },
  {
    id: "std-08",
    rollNumber: "23L31A0508",
    name: "Kandregula Manoj",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "K. Gurunadha Rao",
    parentPhone: "+91 98487 34561",
    totalClasses: 110,
    attendedClasses: 63,
    attendancePercentage: 57.27,
    active: true
  },
  {
    id: "std-09",
    rollNumber: "23L31A0509",
    name: "Karri Likhita Reddy",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "K. Mohan Reddy",
    parentPhone: "+91 98488 67890",
    totalClasses: 110,
    attendedClasses: 104,
    attendancePercentage: 94.55,
    active: true
  },
  {
    id: "std-10",
    rollNumber: "23L31A0510",
    name: "Majjari Dinesh Kumar",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "M. Prakash Rao",
    parentPhone: "+91 98489 12345",
    totalClasses: 110,
    attendedClasses: 88,
    attendancePercentage: 80.00,
    active: true
  },
  {
    id: "std-11",
    rollNumber: "23L31A0511",
    name: "Nambaru Rohit",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "N. Simhachalam",
    parentPhone: "+91 98490 54321",
    totalClasses: 110,
    attendedClasses: 69,
    attendancePercentage: 62.73,
    active: true
  },
  {
    id: "std-12",
    rollNumber: "23L31A0512",
    name: "Palla Sneha Latha",
    department: "CSE",
    yearOfStudy: 2,
    section: "A",
    parentName: "P. Govinda Rao",
    parentPhone: "+91 98491 87654",
    totalClasses: 110,
    attendedClasses: 99,
    attendancePercentage: 90.00,
    active: true
  },
  {
    id: "std-13",
    rollNumber: "23L31A0561",
    name: "Polireddy Sai Charan",
    department: "CSE",
    yearOfStudy: 2,
    section: "B",
    parentName: "P. Subba Reddy",
    parentPhone: "+91 98492 11223",
    totalClasses: 110,
    attendedClasses: 85,
    attendancePercentage: 77.27,
    active: true
  },
  {
    id: "std-14",
    rollNumber: "23L31A0562",
    name: "Rayavarapu Deepthi",
    department: "CSE",
    yearOfStudy: 2,
    section: "B",
    parentName: "R. Jagannadha Rao",
    parentPhone: "+91 98493 44556",
    totalClasses: 110,
    attendedClasses: 101,
    attendancePercentage: 91.82,
    active: true
  },
  {
    id: "std-15",
    rollNumber: "23L31A0563",
    name: "Sabbavarapu Bhanu Prakash",
    department: "CSE",
    yearOfStudy: 2,
    section: "B",
    parentName: "S. Kameswara Rao",
    parentPhone: "+91 98494 77889",
    totalClasses: 110,
    attendedClasses: 74,
    attendancePercentage: 67.27,
    active: true
  },
  {
    id: "std-16",
    rollNumber: "23L31A0564",
    name: "Tetali Vani Sri",
    department: "CSE",
    yearOfStudy: 2,
    section: "B",
    parentName: "T. Venkata Ramana",
    parentPhone: "+91 98495 99001",
    totalClasses: 110,
    attendedClasses: 95,
    attendancePercentage: 86.36,
    active: true
  }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: "att-01", studentId: "std-01", studentRoll: "23L31A0501", studentName: "Aaditya Varma Penumatsa", section: "A", date: "2026-10-22", status: "PRESENT", confirmedForCall: false },
  { id: "att-02", studentId: "std-02", studentRoll: "23L31A0502", studentName: "Bandaru Harsha Vardhan", section: "A", date: "2026-10-22", status: "ABSENT", confirmedForCall: true },
  { id: "att-03", studentId: "std-03", studentRoll: "23L31A0503", studentName: "Chodisetty Sai Pranathi", section: "A", date: "2026-10-22", status: "PRESENT", confirmedForCall: false },
  { id: "att-04", studentId: "std-04", studentRoll: "23L31A0504", studentName: "Duvvada Tarun Kumar", section: "A", date: "2026-10-22", status: "ABSENT", confirmedForCall: true },
  { id: "att-05", studentId: "std-05", studentRoll: "23L31A0505", studentName: "Gadiraju Meghana", section: "A", date: "2026-10-22", status: "PRESENT", confirmedForCall: false },
  { id: "att-06", studentId: "std-06", studentRoll: "23L31A0506", studentName: "Gudivada Rakesh", section: "A", date: "2026-10-22", status: "PRESENT", confirmedForCall: false },
  { id: "att-07", studentId: "std-07", studentRoll: "23L31A0507", studentName: "Jalagadugula Yamini", section: "A", date: "2026-10-22", status: "PRESENT", confirmedForCall: false },
  { id: "att-08", studentId: "std-08", studentRoll: "23L31A0508", studentName: "Kandregula Manoj", section: "A", date: "2026-10-22", status: "ABSENT", confirmedForCall: true },
  { id: "att-09", studentId: "std-09", studentRoll: "23L31A0509", studentName: "Karri Likhita Reddy", section: "A", date: "2026-10-22", status: "PRESENT", confirmedForCall: false },
  { id: "att-10", studentId: "std-10", studentRoll: "23L31A0510", studentName: "Majjari Dinesh Kumar", section: "A", date: "2026-10-22", status: "PRESENT", confirmedForCall: false },
  { id: "att-11", studentId: "std-11", studentRoll: "23L31A0511", studentName: "Nambaru Rohit", section: "A", date: "2026-10-22", status: "ABSENT", confirmedForCall: true },
  { id: "att-12", studentId: "std-12", studentRoll: "23L31A0512", studentName: "Palla Sneha Latha", section: "A", date: "2026-10-22", status: "PRESENT", confirmedForCall: false },
];

export const MOCK_MARKS: StudentMark[] = [
  { id: "mk-01", studentId: "std-02", studentRoll: "23L31A0502", studentName: "Bandaru Harsha Vardhan", section: "A", assessmentName: "Midterm-1", subject: "DBMS", marksObtained: 24, maxMarks: 30, updatedAt: "2026-10-10" },
  { id: "mk-02", studentId: "std-02", studentRoll: "23L31A0502", studentName: "Bandaru Harsha Vardhan", section: "A", assessmentName: "Midterm-1", subject: "Operating Systems", marksObtained: 21, maxMarks: 30, updatedAt: "2026-10-12" },
  { id: "mk-03", studentId: "std-02", studentRoll: "23L31A0502", studentName: "Bandaru Harsha Vardhan", section: "A", assessmentName: "Midterm-1", subject: "Python Programming", marksObtained: 26, maxMarks: 30, updatedAt: "2026-10-14" },
  { id: "mk-04", studentId: "std-04", studentRoll: "23L31A0504", studentName: "Duvvada Tarun Kumar", section: "A", assessmentName: "Midterm-1", subject: "DBMS", marksObtained: 18, maxMarks: 30, updatedAt: "2026-10-10" },
  { id: "mk-05", studentId: "std-04", studentRoll: "23L31A0504", studentName: "Duvvada Tarun Kumar", section: "A", assessmentName: "Midterm-1", subject: "Operating Systems", marksObtained: 19, maxMarks: 30, updatedAt: "2026-10-12" },
  { id: "mk-06", studentId: "std-08", studentRoll: "23L31A0508", studentName: "Kandregula Manoj", section: "A", assessmentName: "Midterm-1", subject: "DBMS", marksObtained: 15, maxMarks: 30, updatedAt: "2026-10-10" },
  { id: "mk-07", studentId: "std-08", studentRoll: "23L31A0508", studentName: "Kandregula Manoj", section: "A", assessmentName: "Midterm-1", subject: "Operating Systems", marksObtained: 16, maxMarks: 30, updatedAt: "2026-10-12" },
  { id: "mk-08", studentId: "std-11", studentRoll: "23L31A0511", studentName: "Nambaru Rohit", section: "A", assessmentName: "Midterm-1", subject: "DBMS", marksObtained: 22, maxMarks: 30, updatedAt: "2026-10-10" },
  { id: "mk-09", studentId: "std-11", studentRoll: "23L31A0511", studentName: "Nambaru Rohit", section: "A", assessmentName: "Midterm-1", subject: "Operating Systems", marksObtained: 20, maxMarks: 30, updatedAt: "2026-10-12" },
];

export const MOCK_CALL_TASKS: CallTask[] = [
  {
    id: "call-901",
    studentRoll: "23L31A0502",
    studentName: "Bandaru Harsha Vardhan",
    parentName: "B. Venkateswara Rao",
    parentPhone: "+91 98481 44521",
    attendanceDate: "2026-10-22",
    status: "COMPLETED",
    recipientVerified: true,
    marksDisclosed: true,
    queryLogged: true,
    querySummary: "Parent inquired whether medical leave certificate can be submitted tomorrow morning.",
    durationSeconds: 114,
    timestamp: "2026-10-22 10:15 AM",
    transcript: [
      { speaker: "AI Assistant", text: "Namaste! This is an automated notification from Vignan's Institute of Information Technology, Visakhapatnam. Am I speaking with Mr. B. Venkateswara Rao, parent of Bandaru Harsha Vardhan?", time: "00:03" },
      { speaker: "Parent", text: "Yes, this is Venkateswara Rao speaking. Is everything alright?", time: "00:12" },
      { speaker: "AI Assistant", text: "Thank you for verifying your identity. We are calling to inform you that according to our college records, Harsha Vardhan is marked absent today, 22nd October 2026. His current cumulative attendance stands at 65.45%, which is below the mandatory 75% threshold.", time: "00:28" },
      { speaker: "Parent", text: "Oh, he had severe stomach ache last night, so I told him to rest. Can we submit a doctor's certificate?", time: "00:46" },
      { speaker: "AI Assistant", text: "I have recorded your request regarding the medical certificate. It will be routed to his Class Coordinator, Dr. K. Srinivasa Rao. Would you also like to hear his Midterm-1 assessment marks?", time: "01:02" },
      { speaker: "Parent", text: "Yes please, tell me how he scored.", time: "01:14" },
      { speaker: "AI Assistant", text: "In Midterm-1, Harsha obtained 24 out of 30 in DBMS, 21 out of 30 in Operating Systems, and 26 out of 30 in Python. A coordinator follow-up has been created. Have a wonderful day!", time: "01:38" },
      { speaker: "Parent", text: "Thank you very much.", time: "01:48" }
    ]
  },
  {
    id: "call-902",
    studentRoll: "23L31A0504",
    studentName: "Duvvada Tarun Kumar",
    parentName: "D. Someswara Rao",
    parentPhone: "+91 98483 33214",
    attendanceDate: "2026-10-22",
    status: "COMPLETED",
    recipientVerified: true,
    marksDisclosed: false,
    queryLogged: true,
    querySummary: "Parent disputed absence, stating student boarded the college bus at 7:45 AM from Kurmannapalem.",
    durationSeconds: 98,
    timestamp: "2026-10-22 10:18 AM",
    transcript: [
      { speaker: "AI Assistant", text: "Namaste! This is the automated assistant for Vignan's Institute of Information Technology calling for Mr. D. Someswara Rao regarding student Duvvada Tarun Kumar.", time: "00:04" },
      { speaker: "Parent", text: "Yes, I am Someswara Rao.", time: "00:11" },
      { speaker: "AI Assistant", text: "Our attendance records indicate Tarun Kumar is absent today, 22nd October. His overall attendance is currently 61.82%.", time: "00:25" },
      { speaker: "Parent", text: "What? That cannot be true. He boarded the college bus at Kurmannapalem at 7:45 AM this morning. Please check the attendance again!", time: "00:42" },
      { speaker: "AI Assistant", text: "I understand your concern. I have immediately logged this attendance dispute for Class Coordinator Dr. K. Srinivasa Rao to verify bus arrival and physical classroom presence. Would you like his midterm marks?", time: "01:05" },
      { speaker: "Parent", text: "No, just please confirm where he is right now.", time: "01:18" },
      { speaker: "AI Assistant", text: "Your query is marked high priority for coordinator intervention. Thank you.", time: "01:32" }
    ]
  },
  {
    id: "call-903",
    studentRoll: "23L31A0508",
    studentName: "Kandregula Manoj",
    parentName: "K. Gurunadha Rao",
    parentPhone: "+91 98487 34561",
    attendanceDate: "2026-10-22",
    status: "NO_ANSWER",
    recipientVerified: false,
    marksDisclosed: false,
    queryLogged: false,
    durationSeconds: 35,
    timestamp: "2026-10-22 10:21 AM",
    transcript: [
      { speaker: "AI Assistant", text: "Dialing parent number +91 98487 34561 on behalf of VIIT...", time: "00:02" },
      { speaker: "AI Assistant", text: "Ringing... Ringing... Call not answered after 35 seconds. Scheduled for retry in 15 minutes.", time: "00:35" }
    ]
  },
  {
    id: "call-904",
    studentRoll: "23L31A0511",
    studentName: "Nambaru Rohit",
    parentName: "N. Simhachalam",
    parentPhone: "+91 98490 54321",
    attendanceDate: "2026-10-22",
    status: "RINGING",
    recipientVerified: false,
    marksDisclosed: false,
    queryLogged: false,
    durationSeconds: 12,
    timestamp: "2026-10-22 10:24 AM",
    transcript: [
      { speaker: "AI Assistant", text: "Connecting call to parent phone +91 98490 54321...", time: "00:02" }
    ]
  }
];

export const MOCK_PARENT_QUERIES: ParentQuery[] = [
  {
    id: "qry-101",
    callTaskId: "call-902",
    studentRoll: "23L31A0504",
    studentName: "Duvvada Tarun Kumar",
    parentName: "D. Someswara Rao",
    parentPhone: "+91 98483 33214",
    category: "ATTENDANCE_DISPUTE",
    summary: "Parent insists student boarded Route-14 college bus from Kurmannapalem at 7:45 AM. Demands verification of physical presence or library log.",
    assignedCoordinator: "Dr. K. Srinivasa Rao",
    status: "PENDING",
    createdAt: "2026-10-22 10:19 AM",
    resolutionNotes: ""
  },
  {
    id: "qry-102",
    callTaskId: "call-901",
    studentRoll: "23L31A0502",
    studentName: "Bandaru Harsha Vardhan",
    parentName: "B. Venkateswara Rao",
    parentPhone: "+91 98481 44521",
    category: "HEALTH_LEAVE",
    summary: "Parent reported acute gastritis. Inquiring about medical certificate submission deadline for condonation.",
    assignedCoordinator: "Dr. K. Srinivasa Rao",
    status: "IN_PROGRESS",
    createdAt: "2026-10-22 10:17 AM",
    resolutionNotes: "Informed parent to submit signed doctor prescription to HOD office by Friday 4 PM."
  },
  {
    id: "qry-103",
    studentRoll: "23L31A0563",
    studentName: "Sabbavarapu Bhanu Prakash",
    parentName: "S. Kameswara Rao",
    parentPhone: "+91 98494 77889",
    category: "EXAM_SCHEDULE",
    summary: "Parent requested clarification regarding Midterm-2 lab examination timetable and internal project reviews.",
    assignedCoordinator: "Mrs. P. Lakshmi",
    status: "RESOLVED",
    createdAt: "2026-10-21 02:45 PM",
    resolvedAt: "2026-10-21 04:15 PM",
    resolutionNotes: "Sent the official academic calendar PDF via coordinator message to registered parent WhatsApp."
  }
];

export const SAMPLE_EXCEL_IMPORT_PREVIEW: ExcelImportPreviewRow[] = [
  {
    rowNumber: 2,
    rollNumber: "23L31A0513",
    studentName: "Potnuru Yashwanth",
    department: "CSE",
    section: "A",
    parentName: "P. Trinadha Rao",
    parentPhone: "+91 98496 12340",
    attendanceStatus: "PRESENT",
    marksObtained: "28",
    status: "VALID_NEW",
    validationErrors: []
  },
  {
    rowNumber: 3,
    rollNumber: "23L31A0502",
    studentName: "Bandaru Harsha Vardhan",
    department: "CSE",
    section: "A",
    parentName: "B. Venkateswara Rao",
    parentPhone: "+91 98481 44521",
    attendanceStatus: "ABSENT",
    marksObtained: "", // Demonstrating blank marks preservation!
    status: "VALID_UPDATE",
    validationErrors: ["Note: Marks column is blank. Existing midterm marks will be preserved."]
  },
  {
    rowNumber: 4,
    rollNumber: "23L31A0599",
    studentName: "Vemuri Anirudh",
    department: "CSE",
    section: "A",
    parentName: "V. Surya Prakash",
    parentPhone: "9849-INVALID-PHONE",
    attendanceStatus: "PRESENT",
    marksObtained: "22",
    status: "INVALID",
    validationErrors: ["Invalid Indian Phone Number: format must contain 10 valid digits."]
  },
  {
    rowNumber: 5,
    rollNumber: "23L31A0501",
    studentName: "Aaditya Varma Penumatsa",
    department: "CSE",
    section: "A",
    parentName: "P. Satyanarayana Varma",
    parentPhone: "+91 98480 23145",
    attendanceStatus: "PRESENT",
    marksObtained: "30",
    status: "DUPLICATE",
    validationErrors: ["Record for student 23L31A0501 already uploaded for 2026-10-22. Duplicate suppressed."]
  }
];
