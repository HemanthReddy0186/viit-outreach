import io
import re
import openpyxl
from typing import List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.models.models import Student, DailyAttendance, StudentMark, ImportLog
from backend.app.schemas.schemas import ExcelPreviewRow, ExcelPreviewResponse

ROLL_REGEX = re.compile(r'^[0-9]{2}[A-Za-z0-9]{8,10}$') # e.g. 23L31A0501
PHONE_REGEX = re.compile(r'^\+?[0-9]{10,13}$')

def clean_phone(raw: Any) -> str:
    if raw is None:
        return ""
    # Strip spaces, dashes, brackets
    digits = re.sub(r'[^0-9+]', '', str(raw))
    if len(digits) == 10 and not digits.startswith('+'):
        return f"+91 {digits[:5]} {digits[5:]}"
    elif len(digits) == 12 and digits.startswith('91'):
        return f"+91 {digits[2:7]} {digits[7:]}"
    elif digits.startswith('+91') and len(digits) == 13:
        return f"+91 {digits[3:8]} {digits[8:]}"
    return str(raw).strip()

def normalize_status(val: Any) -> str:
    if val is None:
        return "PRESENT"
    s = str(val).strip().upper()
    if s in ['A', 'ABSENT', '0', 'NO']:
        return "ABSENT"
    return "PRESENT"

async def parse_and_validate_excel(
    file_bytes: bytes, 
    filename: str, 
    session: AsyncSession
) -> ExcelPreviewResponse:
    # Load workbook from bytes
    wb = openpyxl.load_workbook(io.BytesIO(file_bytes), data_only=True)
    sheet = wb.active
    
    # Read rows
    rows_data = list(sheet.iter_rows(values_only=True))
    if not rows_data:
        return ExcelPreviewResponse(
            filename=filename,
            total_rows=0,
            valid_new=0,
            valid_update=0,
            invalid_rows=0,
            duplicate_rows=0,
            rows=[]
        )
        
    # Find header row
    header_idx = 0
    headers = [str(cell).strip().lower() if cell is not None else "" for cell in rows_data[header_idx]]
    
    # Look for matching column indices
    col_map = {
        "roll": -1,
        "name": -1,
        "phone": -1,
        "section": -1,
        "status": -1,
        "marks": -1
    }
    
    for i, h in enumerate(headers):
        if any(term in h for term in ["roll", "htno", "hall ticket", "reg"]):
            col_map["roll"] = i
        elif any(term in h for term in ["student", "name", "candidate"]):
            col_map["name"] = i
        elif any(term in h for term in ["phone", "mobile", "contact", "parent"]):
            col_map["phone"] = i
        elif any(term in h for term in ["sec", "section"]):
            col_map["section"] = i
        elif any(term in h for term in ["att", "status", "present", "absent"]):
            col_map["status"] = i
        elif any(term in h for term in ["mark", "score", "mid"]):
            col_map["marks"] = i

    # Fallback to positional defaults if headers missing
    if col_map["roll"] == -1: col_map["roll"] = 0
    if col_map["name"] == -1 and len(headers) > 1: col_map["name"] = 1
    if col_map["phone"] == -1 and len(headers) > 2: col_map["phone"] = 2
    if col_map["status"] == -1 and len(headers) > 3: col_map["status"] = 3
    if col_map["marks"] == -1 and len(headers) > 4: col_map["marks"] = 4

    # Query existing students for duplicate / update detection
    existing_students_stmt = select(Student.roll_number)
    res = await session.execute(existing_students_stmt)
    existing_rolls = set(res.scalars().all())

    parsed_rows: List[ExcelPreviewRow] = []
    seen_in_file = set()
    
    valid_new = 0
    valid_update = 0
    invalid_rows = 0
    duplicate_rows = 0

    for r_idx, row in enumerate(rows_data[1:], start=2):
        if not any(row):  # skip blank rows
            continue
            
        raw_roll = row[col_map["roll"]] if col_map["roll"] < len(row) else None
        raw_name = row[col_map["name"]] if col_map["name"] < len(row) and col_map["name"] != -1 else ""
        raw_phone = row[col_map["phone"]] if col_map["phone"] < len(row) and col_map["phone"] != -1 else ""
        raw_sec = row[col_map["section"]] if col_map["section"] < len(row) and col_map["section"] != -1 else "A"
        raw_status = row[col_map["status"]] if col_map["status"] < len(row) and col_map["status"] != -1 else "PRESENT"
        raw_marks = row[col_map["marks"]] if col_map["marks"] < len(row) and col_map["marks"] != -1 else None

        roll_str = str(raw_roll).strip().upper() if raw_roll else ""
        name_str = str(raw_name).strip() if raw_name else f"Student {roll_str}"
        sec_str = str(raw_sec).strip().upper() if raw_sec else "A"
        phone_str = clean_phone(raw_phone)
        status_str = normalize_status(raw_status)
        
        parsed_marks = None
        if raw_marks is not None and str(raw_marks).strip() != "":
            try:
                parsed_marks = float(raw_marks)
            except ValueError:
                parsed_marks = None

        errors = []
        if not roll_str or len(roll_str) < 5:
            errors.append("Missing or invalid roll number")
        
        # Phone validation: check clean digits length
        digits_only = re.sub(r'[^0-9]', '', phone_str)
        if len(digits_only) < 10:
            errors.append("Invalid parent phone (must have at least 10 digits)")
            
        # Duplicate detection within same file
        if roll_str in seen_in_file:
            row_status = "DUPLICATE"
            errors.append("Duplicate roll number within same file")
            duplicate_rows += 1
        elif errors:
            row_status = "INVALID"
            invalid_rows += 1
        elif roll_str in existing_rolls:
            row_status = "VALID_UPDATE"
            valid_update += 1
            seen_in_file.add(roll_str)
        else:
            row_status = "VALID_NEW"
            valid_new += 1
            seen_in_file.add(roll_str)

        parsed_rows.append(
            ExcelPreviewRow(
                row_number=r_idx,
                roll_number=roll_str,
                student_name=name_str,
                section=sec_str,
                parent_phone=phone_str,
                attendance_status=status_str,
                marks_obtained=parsed_marks,
                status=row_status,
                validation_errors=errors
            )
        )

    return ExcelPreviewResponse(
        filename=filename,
        total_rows=len(parsed_rows),
        valid_new=valid_new,
        valid_update=valid_update,
        invalid_rows=invalid_rows,
        duplicate_rows=duplicate_rows,
        rows=parsed_rows
    )

async def commit_excel_rows(
    rows: List[ExcelPreviewRow], 
    section_name: str, 
    date_str: str, 
    session: AsyncSession
) -> Tuple[int, int]:
    committed_count = 0
    marks_preserved_count = 0

    for row in rows:
        if row.status not in ["VALID_NEW", "VALID_UPDATE"]:
            continue
            
        # 1. Upsert Student master record
        stmt = select(Student).where(Student.roll_number == row.roll_number)
        res = await session.execute(stmt)
        student = res.scalar_one_or_none()
        
        if not student:
            student = Student(
                roll_number=row.roll_number,
                name=row.student_name,
                parent_name=f"Parent of {row.student_name}",
                parent_phone=row.parent_phone,
                total_classes=1,
                attended_classes=1 if row.attendance_status == "PRESENT" else 0,
                attendance_percentage=100.0 if row.attendance_status == "PRESENT" else 0.0,
                active=True
            )
            session.add(student)
            await session.flush()
        else:
            # Update phone or name if provided
            if row.parent_phone:
                student.parent_phone = row.parent_phone
            if row.student_name and not student.name:
                student.name = row.student_name
                
        # 2. Upsert Daily Attendance record for date
        att_stmt = select(DailyAttendance).where(
            DailyAttendance.student_id == student.id,
            DailyAttendance.date == date_str
        )
        att_res = await session.execute(att_stmt)
        att_record = att_res.scalar_one_or_none()
        
        if att_record:
            att_record.status = row.attendance_status or "PRESENT"
            att_record.section_name = section_name
        else:
            att_record = DailyAttendance(
                student_id=student.id,
                roll_number=student.roll_number,
                section_name=section_name,
                date=date_str,
                status=row.attendance_status or "PRESENT",
                confirmed_for_call=False
            )
            session.add(att_record)

        # 3. Midterm Marks Preservation Guarantee (FR-05)
        # If marks_obtained is None / empty, DO NOT touch existing student marks!
        if row.marks_obtained is not None:
            # Upsert mark
            mark_stmt = select(StudentMark).where(
                StudentMark.student_id == student.id,
                StudentMark.assessment_name == "Midterm-1"
            )
            mark_res = await session.execute(mark_stmt)
            existing_mark = mark_res.scalar_one_or_none()
            if existing_mark:
                existing_mark.marks_obtained = row.marks_obtained
            else:
                new_mark = StudentMark(
                    student_id=student.id,
                    roll_number=student.roll_number,
                    subject="Core Subjects",
                    assessment_name="Midterm-1",
                    marks_obtained=row.marks_obtained,
                    max_marks=30.0
                )
                session.add(new_mark)
        else:
            # Blank cell in spreadsheet: mark preserved, never erased!
            marks_preserved_count += 1

        committed_count += 1

    await session.commit()
    return committed_count, marks_preserved_count
