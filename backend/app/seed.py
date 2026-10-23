import asyncio
import datetime
from sqlalchemy import select
from backend.app.core.database import AsyncSessionLocal, init_db
from backend.app.models.models import (
    Department, Section, Student, DailyAttendance, StudentMark, CallTask, ParentQuery
)

async def seed_data():
    await init_db()
    async with AsyncSessionLocal() as session:
        # Check if already seeded
        res = await session.execute(select(Department))
        if res.scalars().first():
            print("Database already contains data, skipping seed.")
            return

        print("Seeding VIIT departments and sections...")
        cse = Department(code="CSE", name="Department of Computer Science and Engineering")
        ece = Department(code="ECE", name="Department of Electronics and Communication Engineering")
        it = Department(code="IT", name="Department of Information Technology")
        session.add_all([cse, ece, it])
        await session.flush()

        sec_a = Section(
            department_id=cse.id, 
            name="A", 
            year_of_study=2, 
            semester=1,
            coordinator_name="Dr. K. Srinivasa Rao",
            coordinator_phone="+91 98480 11223",
            coordinator_email="ksrao@vignan.ac.in"
        )
        sec_b = Section(
            department_id=cse.id, 
            name="B", 
            year_of_study=2, 
            semester=1,
            coordinator_name="Mrs. P. Lakshmi",
            coordinator_phone="+91 98480 22334",
            coordinator_email="plakshmi@vignan.ac.in"
        )
        session.add_all([sec_a, sec_b])
        await session.flush()

        students_data = [
            ("23L31A0501", "Aaditya Varma Penumatsa", "P. Satyanarayana Varma", "+91 98480 23145", 110, 94, 85.45, sec_a.id),
            ("23L31A0502", "Bandaru Harsha Vardhan", "B. Venkateswara Rao", "+91 98481 44521", 110, 72, 65.45, sec_a.id),
            ("23L31A0503", "Chodisetty Sai Pranathi", "Ch. Ramana Murthy", "+91 98482 78912", 110, 102, 92.73, sec_a.id),
            ("23L31A0504", "Duvvada Tarun Kumar", "D. Someswara Rao", "+91 98483 33214", 110, 68, 61.82, sec_a.id),
            ("23L31A0505", "Gadiraju Meghana", "G. Vijaya Bhaskar Raju", "+91 98484 55678", 110, 98, 89.09, sec_a.id),
            ("23L31A0506", "Gudivada Rakesh", "G. Srinivasa Rao", "+91 98485 11987", 110, 79, 71.82, sec_a.id),
            ("23L31A0507", "Kakarla Divya Teja", "K. Nageswara Rao", "+91 98486 99876", 110, 88, 80.00, sec_a.id),
            ("23L31A0508", "Maddila Rohit Naidu", "M. Simhachalam Naidu", "+91 98487 66543", 110, 69, 62.73, sec_a.id),
            ("23L31A0509", "Nallamothu Hemanth", "N. Prasad Rao", "+91 98488 44321", 110, 105, 95.45, sec_a.id),
            ("23L31A0510", "Paila Sravani", "P. Jagannadha Rao", "+91 98489 12345", 110, 74, 67.27, sec_a.id),
            ("23L31A0511", "Surisetti Bhanu Prakash", "S. Appa Rao", "+91 98490 87654", 110, 90, 81.82, sec_a.id),
            ("23L31A0512", "Vemula Sai Kumar", "V. Narayana Murthy", "+91 98491 54321", 110, 66, 60.00, sec_a.id)
        ]

        created_students = []
        for roll, name, pname, pphone, tot, att, pct, sec_id in students_data:
            st = Student(
                roll_number=roll,
                name=name,
                department_id=cse.id,
                section_id=sec_id,
                year_of_study=2,
                parent_name=pname,
                parent_phone=pphone,
                total_classes=tot,
                attended_classes=att,
                attendance_percentage=pct,
                active=True
            )
            session.add(st)
            created_students.append(st)
            
        await session.flush()

        # Seed attendance records for 2026-10-22
        today_date = "2026-10-22"
        absentees_rolls = {"23L31A0504", "23L31A0508", "23L31A0512", "23L31A0502"}
        
        for st in created_students:
            is_absent = st.roll_number in absentees_rolls
            att = DailyAttendance(
                student_id=st.id,
                roll_number=st.roll_number,
                section_name="A",
                date=today_date,
                status="ABSENT" if is_absent else "PRESENT",
                confirmed_for_call=is_absent
            )
            session.add(att)

        # Seed midterm marks
        marks_data = [
            (created_students[0], "DBMS", 28.0),
            (created_students[0], "Operating Systems", 26.5),
            (created_students[1], "DBMS", 18.0),
            (created_students[3], "DBMS", 16.5),
            (created_students[3], "Operating Systems", 15.0),
            (created_students[7], "DBMS", 22.0),
            (created_students[7], "Operating Systems", 20.0),
            (created_students[11], "DBMS", 14.0),
            (created_students[11], "Python Programming", 15.5),
        ]
        for st, subj, score in marks_data:
            mark = StudentMark(
                student_id=st.id,
                roll_number=st.roll_number,
                subject=subj,
                assessment_name="Midterm-1",
                marks_obtained=score,
                max_marks=30.0
            )
            session.add(mark)

        # Seed call task
        call = CallTask(
            student_id=created_students[7].id,
            roll_number="23L31A0508",
            student_name="Maddila Rohit Naidu",
            parent_name="M. Simhachalam Naidu",
            parent_phone="+91 98487 66543",
            section_name="A",
            date=today_date,
            call_type="PRERECORDED_TELUGU",
            status="COMPLETED",
            duration_seconds=52,
            recipient_verified=True,
            marks_disclosed=False,
            query_logged=True,
            query_summary="Parent acknowledged absentee notice and asked about internal practical exam dates.",
            response_digit="2",
            retry_count=0
        )
        session.add(call)

        # Seed parent query
        query = ParentQuery(
            student_id=created_students[7].id,
            student_roll="23L31A0508",
            student_name="Maddila Rohit Naidu",
            parent_name="M. Simhachalam Naidu",
            parent_phone="+91 98487 66543",
            category="ACADEMIC_CONCERN",
            summary="Parent inquired about internal practical exam schedule and requested coordinator callback.",
            status="PENDING",
            assigned_coordinator="Dr. K. Srinivasa Rao"
        )
        session.add(query)

        await session.commit()
        print("Database successfully seeded with VIIT academic records!")

if __name__ == "__main__":
    asyncio.run(seed_data())
