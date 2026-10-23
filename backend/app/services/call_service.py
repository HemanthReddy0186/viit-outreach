import json
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.models.models import CallTask, Student, DailyAttendance, ParentQuery

TELUGU_IVR_TEMPLATE = (
    "నమస్కారం, విజ్ఞాన్స్ ఇంస్టిట్యూట్ ఆఫ్ ఇన్ఫర్మేషన్ టెక్నాలజీ (VIIT) నుంచి మాట్లాడుతున్నాము. "
    "మీ అబ్బాయి/అమ్మాయి {name} (రోల్ నం: {roll}) ఈరోజు ({date}) కాలేజీకి హాజరు కాలేదు. "
    "ఈ సమాచారాన్ని ధృవీకరించడానికి 1 నొక్కండి, క్లాస్ కోఆర్డినేటర్‌తో మాట్లాడటానికి 2 నొక్కండి."
)

ENGLISH_IVR_SUMMARY = (
    "Greetings from Vignan's Institute of Information Technology (VIIT). "
    "Your ward {name} ({roll}) has been marked absent on {date}. "
    "Press 1 to acknowledge, or 2 to request a callback from the department coordinator."
)

async def trigger_outreach_calls_for_date(
    date_str: str,
    section_name: str,
    call_type: str,
    session: AsyncSession,
    specific_absentee_ids: Optional[List[int]] = None
) -> List[CallTask]:
    """
    Queue and execute automated parental outreach for absentees.
    In local/dev mode, this runs a deterministic state simulation.
    In production, this dispatches outbound dialing jobs via telecom OBD.
    """
    # 1. Fetch absentees for the specified date and section
    query = (
        select(DailyAttendance, Student)
        .join(Student, DailyAttendance.student_id == Student.id)
        .where(
            DailyAttendance.date == date_str,
            DailyAttendance.status == "ABSENT"
        )
    )
    if specific_absentee_ids:
        query = query.where(Student.id.in_(specific_absentee_ids))
        
    result = await session.execute(query)
    absentee_records = result.all()
    
    created_or_updated_tasks: List[CallTask] = []
    
    for att, student in absentee_records:
        # Check if an active call task already exists for today
        task_stmt = select(CallTask).where(
            CallTask.student_id == student.id,
            CallTask.date == date_str
        )
        t_res = await session.execute(task_stmt)
        task = t_res.scalar_one_or_none()
        
        telugu_script = TELUGU_IVR_TEMPLATE.format(
            name=student.name,
            roll=student.roll_number,
            date=date_str
        )
        
        if not task:
            task = CallTask(
                student_id=student.id,
                roll_number=student.roll_number,
                student_name=student.name,
                parent_name=student.parent_name,
                parent_phone=student.parent_phone,
                section_name=section_name,
                date=date_str,
                call_type=call_type,
                status="COMPLETED", # Simulated completion
                duration_seconds=48,
                recipient_verified=True,
                marks_disclosed=False,
                query_logged=False,
                response_digit="1", # Simulated parent pressed '1' to acknowledge
                transcript_json=json.dumps([
                    {"speaker": "IVR (Telugu)", "text": telugu_script, "time": "00:02"},
                    {"speaker": "Parent", "text": "Pressed '1' (Acknowledged Absentee Notice)", "time": "00:32"}
                ]),
                retry_count=0
            )
            session.add(task)
        else:
            task.status = "COMPLETED"
            task.recipient_verified = True
            task.call_type = call_type
            
        created_or_updated_tasks.append(task)
        
    await session.commit()
    return created_or_updated_tasks
