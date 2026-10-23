import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True, nullable=False) # e.g. "CSE", "ECE"
    name = Column(String(150), nullable=False)
    active = Column(Boolean, default=True)
    
    sections = relationship("Section", back_populates="department", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="department")

class Section(Base):
    __tablename__ = "sections"
    
    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    name = Column(String(10), nullable=False) # "A", "B", "C"
    year_of_study = Column(Integer, default=2) # 1, 2, 3, 4
    semester = Column(Integer, default=1) # 1, 2
    coordinator_name = Column(String(100), default="Dr. K. Srinivasa Rao")
    coordinator_phone = Column(String(20), default="+91 98480 11223")
    coordinator_email = Column(String(100), default="coordinator@vignan.ac.in")
    
    department = relationship("Department", back_populates="sections")
    students = relationship("Student", back_populates="section")

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    roll_number = Column(String(30), unique=True, index=True, nullable=False) # e.g. "23L31A0501"
    name = Column(String(120), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)
    year_of_study = Column(Integer, default=2)
    parent_name = Column(String(120), nullable=False)
    parent_phone = Column(String(25), nullable=False) # Phone number for automated voice calls
    total_classes = Column(Integer, default=0)
    attended_classes = Column(Integer, default=0)
    attendance_percentage = Column(Float, default=0.0)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    department = relationship("Department", back_populates="students")
    section = relationship("Section", back_populates="students")
    attendance_records = relationship("DailyAttendance", back_populates="student", cascade="all, delete-orphan")
    marks = relationship("StudentMark", back_populates="student", cascade="all, delete-orphan")
    call_tasks = relationship("CallTask", back_populates="student")

class DailyAttendance(Base):
    __tablename__ = "daily_attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    roll_number = Column(String(30), index=True, nullable=False)
    section_name = Column(String(10), default="A")
    date = Column(String(15), index=True, nullable=False) # ISO YYYY-MM-DD
    status = Column(String(10), default="PRESENT") # "PRESENT" or "ABSENT"
    confirmed_for_call = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    __table_args__ = (
        UniqueConstraint('student_id', 'date', name='uq_student_date_attendance'),
    )
    
    student = relationship("Student", back_populates="attendance_records")

class StudentMark(Base):
    """
    Academic Assessment Registry (FR-05).
    Stored in an independent table so attendance updates/Excel imports never overwrite marks.
    """
    __tablename__ = "student_marks"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    roll_number = Column(String(30), index=True, nullable=False)
    subject = Column(String(100), nullable=False) # "DBMS", "Operating Systems", etc.
    assessment_name = Column(String(50), default="Midterm-1")
    marks_obtained = Column(Float, nullable=False)
    max_marks = Column(Float, default=30.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    student = relationship("Student", back_populates="marks")

class CallTask(Base):
    """
    Voice Outreach Task for automated parental notification.
    Supports low-cost Prerecorded Telugu OBD as well as conversational AI.
    """
    __tablename__ = "call_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
    roll_number = Column(String(30), index=True, nullable=False)
    student_name = Column(String(120), nullable=False)
    parent_name = Column(String(120), nullable=False)
    parent_phone = Column(String(25), nullable=False)
    section_name = Column(String(10), default="A")
    date = Column(String(15), index=True, nullable=False)
    
    call_type = Column(String(30), default="PRERECORDED_TELUGU") # "PRERECORDED_TELUGU" or "AI_CONVERSATION"
    status = Column(String(20), default="QUEUED") # QUEUED, RINGING, COMPLETED, NO_ANSWER, FAILED
    duration_seconds = Column(Integer, default=0)
    recipient_verified = Column(Boolean, default=False)
    marks_disclosed = Column(Boolean, default=False)
    query_logged = Column(Boolean, default=False)
    query_summary = Column(Text, nullable=True)
    response_digit = Column(String(5), nullable=True) # DTMF: "1" = Acknowledged, "2" = Callback Request
    transcript_json = Column(Text, nullable=True) # Serialized dialogue / IVR log
    retry_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    student = relationship("Student", back_populates="call_tasks")

class ParentQuery(Base):
    """
    Coordinator Action Inbox for parent inquiries captured during voice outreach.
    """
    __tablename__ = "parent_queries"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
    student_roll = Column(String(30), index=True, nullable=False)
    student_name = Column(String(120), nullable=False)
    parent_name = Column(String(120), nullable=False)
    parent_phone = Column(String(25), nullable=False)
    category = Column(String(50), default="ATTENDANCE_DISPUTE")
    summary = Column(Text, nullable=False)
    status = Column(String(20), default="PENDING") # PENDING, IN_PROGRESS, RESOLVED
    resolution_notes = Column(Text, nullable=True)
    assigned_coordinator = Column(String(100), default="Dr. K. Srinivasa Rao")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

class ImportLog(Base):
    __tablename__ = "import_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    import_date = Column(String(15), default=lambda: datetime.date.today().isoformat())
    section_name = Column(String(10), default="A")
    total_rows = Column(Integer, default=0)
    valid_new = Column(Integer, default=0)
    valid_update = Column(Integer, default=0)
    errors_count = Column(Integer, default=0)
    duplicates_count = Column(Integer, default=0)
    diagnostics_json = Column(Text, nullable=True)
    committed_by = Column(String(100), default="Dr. K. Srinivasa Rao")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
