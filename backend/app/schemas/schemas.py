from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class DepartmentSchema(BaseModel):
    id: int
    code: str
    name: str
    active: bool = True

    model_config = ConfigDict(from_attributes=True)

class SectionSchema(BaseModel):
    id: int
    department_id: int
    name: str
    year_of_study: int
    semester: int
    coordinator_name: str
    coordinator_phone: str
    coordinator_email: str

    model_config = ConfigDict(from_attributes=True)

class StudentSchema(BaseModel):
    id: int
    roll_number: str
    name: str
    department_id: Optional[int] = None
    section_id: Optional[int] = None
    section_name: Optional[str] = "A"
    year_of_study: int = 2
    parent_name: str
    parent_phone: str
    total_classes: int = 0
    attended_classes: int = 0
    attendance_percentage: float = 0.0
    active: bool = True

    model_config = ConfigDict(from_attributes=True)

class AttendanceRecordSchema(BaseModel):
    id: int
    student_id: int
    roll_number: str
    student_name: Optional[str] = None
    section_name: str
    date: str
    status: str
    confirmed_for_call: bool = False

    model_config = ConfigDict(from_attributes=True)

class AttendanceUpdateItem(BaseModel):
    student_id: int
    roll_number: str
    status: str # "PRESENT" or "ABSENT"

class AttendanceBulkUpdate(BaseModel):
    date: str
    section_name: str
    records: List[AttendanceUpdateItem]

class StudentMarkSchema(BaseModel):
    id: int
    student_id: int
    roll_number: str
    student_name: Optional[str] = None
    subject: str
    assessment_name: str
    marks_obtained: float
    max_marks: float = 30.0
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class CallTaskSchema(BaseModel):
    id: int
    student_id: Optional[int] = None
    roll_number: str
    student_name: str
    parent_name: str
    parent_phone: str
    section_name: str
    date: str
    call_type: str = "PRERECORDED_TELUGU"
    status: str
    duration_seconds: int = 0
    recipient_verified: bool = False
    marks_disclosed: bool = False
    query_logged: bool = False
    query_summary: Optional[str] = None
    response_digit: Optional[str] = None
    transcript_json: Optional[str] = None
    retry_count: int = 0

    model_config = ConfigDict(from_attributes=True)

class CallTriggerRequest(BaseModel):
    date: str
    section_name: str
    call_type: Optional[str] = "PRERECORDED_TELUGU" # "PRERECORDED_TELUGU" or "AI_CONVERSATION"
    absentee_ids: Optional[List[int]] = None

class ParentQuerySchema(BaseModel):
    id: int
    student_id: Optional[int] = None
    student_roll: str
    student_name: str
    parent_name: str
    parent_phone: str
    category: str
    summary: str
    status: str
    resolution_notes: Optional[str] = None
    assigned_coordinator: str
    created_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class ParentQueryUpdate(BaseModel):
    status: str # PENDING, IN_PROGRESS, RESOLVED
    resolution_notes: Optional[str] = None

class ExcelPreviewRow(BaseModel):
    row_number: int
    roll_number: str
    student_name: str
    section: str
    parent_phone: str
    attendance_status: Optional[str] = None
    marks_obtained: Optional[float] = None
    status: str # "VALID_NEW", "VALID_UPDATE", "INVALID", "DUPLICATE"
    validation_errors: List[str] = []

class ExcelPreviewResponse(BaseModel):
    filename: str
    total_rows: int
    valid_new: int
    valid_update: int
    invalid_rows: int
    duplicate_rows: int
    rows: List[ExcelPreviewRow]

class ExcelCommitRequest(BaseModel):
    rows: List[ExcelPreviewRow]
    section_name: str
    date: str

class ExcelCommitResponse(BaseModel):
    success: bool
    message: str
    committed_count: int
    marks_preserved_count: int
