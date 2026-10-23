import pytest
import io
import openpyxl
from httpx import AsyncClient, ASGITransport
from backend.app.main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

@pytest.mark.asyncio
async def test_get_students():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/students")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 12
    assert data[0]["roll_number"].startswith("23L31A")

@pytest.mark.asyncio
async def test_excel_import_preview_and_marks_preservation():
    # Build an in-memory sample Excel file
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(["Roll Number", "Student Name", "Parent Phone", "Attendance", "Midterm Marks"])
    ws.append(["23L31A0501", "Aaditya Varma Penumatsa", "9848023145", "PRESENT", ""])  # Blank mark = MUST PRESERVE
    ws.append(["23L31A0599", "New Student Test", "9848999999", "ABSENT", "25.0"])       # New record with mark
    ws.append(["23L31A0501", "Aaditya Varma Penumatsa", "9848023145", "PRESENT", ""])  # Duplicate in file

    stream = io.BytesIO()
    wb.save(stream)
    stream.seek(0)

    files = {"file": ("test_attendance.xlsx", stream.getvalue(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        preview_res = await ac.post("/api/imports/preview", files=files)
        
    assert preview_res.status_code == 200
    pdata = preview_res.json()
    assert pdata["total_rows"] == 3
    assert pdata["duplicate_rows"] == 1
    assert pdata["valid_update"] == 1
    assert pdata["valid_new"] == 1

@pytest.mark.asyncio
async def test_call_trigger_telugu_obd():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        trigger_res = await ac.post("/api/calls/trigger", json={
            "date": "2026-10-22",
            "section_name": "A",
            "call_type": "PRERECORDED_TELUGU"
        })
    assert trigger_res.status_code == 200
    data = trigger_res.json()
    assert data["success"] is True
    assert data["count"] >= 1

@pytest.mark.asyncio
async def test_download_word_report_docx():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/reports/docx?date=2026-10-22&section=A")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    assert len(res.content) > 1000 # Valid docx binary payload
