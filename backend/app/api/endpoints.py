from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List, Optional
import io
import datetime

from backend.app.core.database import get_db
from backend.app.models.models import (
    Department, Section, Student, DailyAttendance, StudentMark, CallTask, ParentQuery
)
from backend.app.schemas.schemas import (
    DepartmentSchema, SectionSchema, StudentSchema, AttendanceRecordSchema,
    AttendanceBulkUpdate, StudentMarkSchema, CallTaskSchema, CallTriggerRequest,
    ParentQuerySchema, ParentQueryUpdate, ExcelPreviewResponse, ExcelCommitRequest,
    ExcelCommitResponse
)
from backend.app.services.excel_service import parse_and_validate_excel, commit_excel_rows
from backend.app.services.call_service import trigger_outreach_calls_for_date
from backend.app.services.report_service import generate_word_report_docx

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "VIIT Outreach Backend API", "time": datetime.datetime.now(datetime.timezone.utc).isoformat()}

# --- Departments & Sections ---
@router.get("/departments", response_model=List[DepartmentSchema])
async def get_departments(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Department).where(Department.active == True))
    return res.scalars().all()

@router.get("/sections", response_model=List[SectionSchema])
async def get_sections(department_code: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    stmt = select(Section)
    if department_code:
        stmt = stmt.join(Department).where(Department.code == department_code)
    res = await db.execute(stmt)
    return res.scalars().all()

from sqlalchemy.orm import selectinload

# --- Students ---
@router.get("/students", response_model=List[StudentSchema])
async def get_students(section: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    stmt = select(Student).options(selectinload(Student.section))
    if section:
        stmt = stmt.join(Section, Student.section_id == Section.id).where(Section.name == section)
    res = await db.execute(stmt)
    students = res.scalars().all()
    
    # Enrich with section name
    output = []
    for s in students:
        sec_name = s.section.name if s.section else "A"
        output.append(
            StudentSchema(
                id=s.id,
                roll_number=s.roll_number,
                name=s.name,
                department_id=s.department_id,
                section_id=s.section_id,
                section_name=sec_name,
                year_of_study=s.year_of_study,
                parent_name=s.parent_name,
                parent_phone=s.parent_phone,
                total_classes=s.total_classes,
                attended_classes=s.attended_classes,
                attendance_percentage=s.attendance_percentage,
                active=s.active
            )
        )
    return output

# --- Attendance ---
@router.get("/attendance", response_model=List[AttendanceRecordSchema])
async def get_attendance(
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    section: str = Query("A", description="Section letter e.g. A or B"),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(DailyAttendance, Student.name)
        .join(Student, DailyAttendance.student_id == Student.id)
        .where(
            DailyAttendance.date == date,
            DailyAttendance.section_name == section
        )
    )
    res = await db.execute(stmt)
    rows = res.all()
    
    return [
        AttendanceRecordSchema(
            id=att.id,
            student_id=att.student_id,
            roll_number=att.roll_number,
            student_name=name,
            section_name=att.section_name,
            date=att.date,
            status=att.status,
            confirmed_for_call=att.confirmed_for_call
        )
        for att, name in rows
    ]

@router.post("/attendance")
async def update_attendance(
    bulk: AttendanceBulkUpdate,
    db: AsyncSession = Depends(get_db)
):
    for item in bulk.records:
        stmt = select(DailyAttendance).where(
            DailyAttendance.student_id == item.student_id,
            DailyAttendance.date == bulk.date
        )
        res = await db.execute(stmt)
        record = res.scalar_one_or_none()
        
        if record:
            record.status = item.status
            record.section_name = bulk.section_name
        else:
            record = DailyAttendance(
                student_id=item.student_id,
                roll_number=item.roll_number,
                section_name=bulk.section_name,
                date=bulk.date,
                status=item.status,
                confirmed_for_call=False
            )
            db.add(record)
            
    await db.commit()
    return {"success": True, "updated_count": len(bulk.records)}

# --- Excel Import Studio ---
@router.post("/imports/preview", response_model=ExcelPreviewResponse)
async def preview_excel_import(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    if not (file.filename.endswith(".xlsx") or file.filename.endswith(".xls") or file.filename.endswith(".csv")):
        raise HTTPException(status_code=400, detail="Only .xlsx or .csv files are supported.")
        
    contents = await file.read()
    preview = await parse_and_validate_excel(contents, file.filename, db)
    return preview

@router.post("/imports/commit", response_model=ExcelCommitResponse)
async def commit_excel_import(
    request: ExcelCommitRequest,
    db: AsyncSession = Depends(get_db)
):
    committed, marks_preserved = await commit_excel_rows(
        request.rows,
        request.section_name,
        request.date,
        db
    )
    return ExcelCommitResponse(
        success=True,
        message=f"Committed {committed} records. Existing midterm marks safely preserved.",
        committed_count=committed,
        marks_preserved_count=marks_preserved
    )

# --- Midterm Marks ---
@router.get("/marks", response_model=List[StudentMarkSchema])
async def get_marks(
    subject: Optional[str] = None,
    section: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(StudentMark, Student.name)
        .join(Student, StudentMark.student_id == Student.id)
    )
    if subject and subject != "ALL":
        stmt = stmt.where(StudentMark.subject == subject)
    res = await db.execute(stmt)
    records = res.all()
    
    return [
        StudentMarkSchema(
            id=m.id,
            student_id=m.student_id,
            roll_number=m.roll_number,
            student_name=name,
            subject=m.subject,
            assessment_name=m.assessment_name,
            marks_obtained=m.marks_obtained,
            max_marks=m.max_marks,
            updated_at=m.updated_at
        )
        for m, name in records
    ]

# --- Voice Outreach (Prerecorded Telugu & AI) ---
@router.get("/calls", response_model=List[CallTaskSchema])
async def get_calls(
    date: Optional[str] = None,
    section: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(CallTask)
    if date:
        stmt = stmt.where(CallTask.date == date)
    if section:
        stmt = stmt.where(CallTask.section_name == section)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("/calls/trigger")
async def trigger_calls(
    req: CallTriggerRequest,
    db: AsyncSession = Depends(get_db)
):
    tasks = await trigger_outreach_calls_for_date(
        date_str=req.date,
        section_name=req.section_name,
        call_type=req.call_type or "PRERECORDED_TELUGU",
        session=db,
        specific_absentee_ids=req.absentee_ids
    )
    return {
        "success": True, 
        "message": f"Queued {len(tasks)} Telugu voice notification calls.", 
        "count": len(tasks)
    }

# --- Parent Queries (Coordinator Inbox) ---
@router.get("/queries", response_model=List[ParentQuerySchema])
async def get_queries(db: AsyncSession = Depends(get_db)):
    stmt = select(ParentQuery).order_by(ParentQuery.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.patch("/queries/{query_id}")
async def update_query_status(
    query_id: int,
    payload: ParentQueryUpdate,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ParentQuery).where(ParentQuery.id == query_id)
    res = await db.execute(stmt)
    query = res.scalar_one_or_none()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")
        
    query.status = payload.status
    if payload.resolution_notes is not None:
        query.resolution_notes = payload.resolution_notes
    if payload.status == "RESOLVED":
        query.resolved_at = datetime.datetime.utcnow()
        
    await db.commit()
    return {"success": True, "updated_status": query.status}

# --- Official Reports Export (.docx) ---
@router.get("/reports/docx")
async def download_word_report(
    date: str = Query("2026-10-22"),
    section: str = Query("A"),
    db: AsyncSession = Depends(get_db)
):
    # Fetch data
    att_res = await db.execute(select(DailyAttendance).where(DailyAttendance.date == date, DailyAttendance.section_name == section))
    attendance_records = att_res.scalars().all()
    
    st_res = await db.execute(select(Student))
    students = st_res.scalars().all()
    
    calls_res = await db.execute(select(CallTask).where(CallTask.date == date, CallTask.section_name == section))
    calls = calls_res.scalars().all()
    
    q_res = await db.execute(select(ParentQuery))
    queries = q_res.scalars().all()
    
    docx_stream = generate_word_report_docx(
        date_str=date,
        section_name=section,
        coordinator_name="Dr. K. Srinivasa Rao",
        attendance_records=attendance_records,
        students=students,
        calls=calls,
        queries=queries
    )
    
    filename = f"VIIT_Attendance_Report_Sec{section}_{date}.docx"
    return StreamingResponse(
        docx_stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
