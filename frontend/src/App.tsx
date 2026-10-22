import React, { useState } from 'react';
import { Sidebar, NavItem } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Attendance } from './pages/Attendance';
import { ExcelImport } from './pages/ExcelImport';
import { MidtermMarks } from './pages/MidtermMarks';
import { CallHistory } from './pages/CallHistory';
import { ParentQueries } from './pages/ParentQueries';
import { Reports } from './pages/Reports';

import { 
  MOCK_STUDENTS, 
  MOCK_ATTENDANCE, 
  MOCK_MARKS, 
  MOCK_CALL_TASKS, 
  MOCK_PARENT_QUERIES 
} from './mockData';

import { Student, AttendanceRecord, CallTask, ParentQuery } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavItem>('dashboard');
  const [selectedDate, setSelectedDate] = useState('2026-10-22');
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [searchQuery, setSearchQuery] = useState('');

  // Application State
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [marks, setMarks] = useState(MOCK_MARKS);
  const [callTasks, setCallTasks] = useState<CallTask[]>(MOCK_CALL_TASKS);
  const [queries, setQueries] = useState<ParentQuery[]>(MOCK_PARENT_QUERIES);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Trigger simulated voice calling workflow
  const triggerCallSimulation = () => {
    showToast('Initiating AI Voice Outreach simulation loop for Section absentees...');
    
    // Simulate updating ringing state to completed
    setTimeout(() => {
      setCallTasks(prev => 
        prev.map(c => {
          if (c.status === 'RINGING') {
            return {
              ...c,
              status: 'COMPLETED',
              recipientVerified: true,
              marksDisclosed: true,
              queryLogged: true,
              querySummary: 'Parent acknowledged absentee notice and asked about internal practical exams.',
              durationSeconds: 95,
              transcript: [
                ...c.transcript,
                { speaker: 'Parent', text: 'Hello, this is Simhachalam. Yes, Rohit informed me he had travel delay.', time: '00:08' },
                { speaker: 'AI Assistant', text: 'Thank you for verifying. Rohit is marked absent today. His attendance is 62.73%. Would you like his midterm marks?', time: '00:24' },
                { speaker: 'Parent', text: 'Yes, please let me know how he did.', time: '00:35' },
                { speaker: 'AI Assistant', text: 'In Midterm-1, Rohit scored 22/30 in DBMS and 20/30 in Operating Systems. Coordinator Dr. K.S. Rao has been notified.', time: '00:52' }
              ]
            };
          }
          return c;
        })
      );
      showToast('AI Voice Outreach cycle completed: Transcripts & inquiry logs generated!');
    }, 2000);
  };

  // Handler for absentee confirmation
  const handleConfirmAbsenteesForCall = (absenteeIds: string[]) => {
    triggerCallSimulation();
    setCurrentTab('calls');
  };

  // Update attendance records
  const handleUpdateAttendance = (newAttendance: AttendanceRecord[]) => {
    setAttendance(newAttendance);
  };

  // Update query status
  const handleUpdateQuery = (updatedQuery: ParentQuery) => {
    setQueries(prev => prev.map(q => q.id === updatedQuery.id ? updatedQuery : q));
    showToast(`Query status updated to ${updatedQuery.status}`);
  };

  // Handle commit from Excel import
  const handleCommitSuccess = () => {
    showToast('Excel records committed successfully! Marks preserved.');
    setTimeout(() => {
      setCurrentTab('students');
    }, 1000);
  };

  const pendingQueriesCount = queries.filter(q => q.status === 'PENDING').length;
  const activeCallsCount = callTasks.filter(c => c.status === 'RINGING' || c.status === 'IN_PROGRESS').length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Ambient background glow */}
      <div className="ambient-glow" />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-2xl shadow-indigo-600/50 flex items-center gap-2 animate-bounce">
          <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
          {notification}
        </div>
      )}

      {/* Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingQueriesCount={pendingQueriesCount}
        activeCallsCount={activeCallsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Topbar
          currentTab={currentTab}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedSection={selectedSection}
          onSectionChange={(sec) => setSelectedSection(sec as 'A' | 'B')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              students={students}
              attendance={attendance}
              callTasks={callTasks}
              queries={queries}
              onNavigate={setCurrentTab}
              selectedDate={selectedDate}
              selectedSection={selectedSection}
              onTriggerCallSimulation={triggerCallSimulation}
            />
          )}

          {currentTab === 'students' && (
            <Students
              students={students}
              marks={marks}
              selectedSection={selectedSection}
            />
          )}

          {currentTab === 'attendance' && (
            <Attendance
              students={students}
              attendance={attendance}
              selectedDate={selectedDate}
              selectedSection={selectedSection}
              onUpdateAttendance={handleUpdateAttendance}
              onConfirmAbsenteesForCall={handleConfirmAbsenteesForCall}
            />
          )}

          {currentTab === 'import' && (
            <ExcelImport
              onCommitSuccess={handleCommitSuccess}
            />
          )}

          {currentTab === 'marks' && (
            <MidtermMarks
              students={students}
              marks={marks}
              selectedSection={selectedSection}
            />
          )}

          {currentTab === 'calls' && (
            <CallHistory
              callTasks={callTasks}
              onTriggerSimulation={triggerCallSimulation}
            />
          )}

          {currentTab === 'queries' && (
            <ParentQueries
              queries={queries}
              onUpdateQuery={handleUpdateQuery}
            />
          )}

          {currentTab === 'reports' && (
            <Reports
              selectedDate={selectedDate}
              selectedSection={selectedSection}
              callTasks={callTasks}
              queries={queries}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
