import React, { useState, useEffect } from 'react';
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
import { Check } from 'lucide-react';

import { 
  MOCK_STUDENTS, 
  MOCK_ATTENDANCE, 
  MOCK_MARKS, 
  MOCK_CALL_TASKS, 
  MOCK_PARENT_QUERIES 
} from './mockData';

import { Student, AttendanceRecord, CallTask, ParentQuery } from './types';
import { api } from './services/api';

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
    setTimeout(() => setNotification(null), 3000);
  };

  // Sync data from backend API with seamless mock fallback
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [loadedStudents, loadedAtt, loadedMarks, loadedCalls, loadedQueries] = await Promise.all([
          api.getStudents(selectedSection),
          api.getAttendance(selectedDate, selectedSection),
          api.getMarks(undefined, selectedSection),
          api.getCalls(selectedDate, selectedSection),
          api.getQueries()
        ]);
        if (!isMounted) return;
        if (loadedStudents && loadedStudents.length > 0) setStudents(loadedStudents);
        if (loadedAtt && loadedAtt.length > 0) setAttendance(loadedAtt);
        if (loadedMarks && loadedMarks.length > 0) setMarks(loadedMarks);
        if (loadedCalls && loadedCalls.length > 0) setCallTasks(loadedCalls);
        if (loadedQueries && loadedQueries.length > 0) setQueries(loadedQueries);
      } catch {
        // Keeps mock data in offline / disconnected mode
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [selectedSection, selectedDate]);

  // Trigger automated parental voice calling (Telugu OBD / simulation)
  const triggerCallSimulation = async () => {
    showToast('Queueing Telugu Voice Outreach calls for absentees...');
    await api.triggerCalls(selectedDate, selectedSection, 'PRERECORDED_TELUGU');
    
    setTimeout(() => {
      setCallTasks(prev => 
        prev.map(c => {
          if (c.status === 'RINGING' || c.status === 'QUEUED') {
            return {
              ...c,
              status: 'COMPLETED',
              recipientVerified: true,
              marksDisclosed: false,
              queryLogged: true,
              querySummary: 'Parent acknowledged Telugu IVR absentee notification.',
              durationSeconds: 48,
              transcript: [
                ...c.transcript,
                { speaker: 'IVR (Telugu)', text: 'విజ్ఞాన్స్ ఇంస్టిట్యూట్: విద్యార్థి హాజరు కాలేదు. అంగీకరించడానికి 1 నొక్కండి.', time: '00:04' },
                { speaker: 'Parent', text: 'Pressed 1 (Acknowledged receipt)', time: '00:32' }
              ]
            };
          }
          return c;
        })
      );
      showToast('Telugu Voice Outreach completed: Notifications verified!');
    }, 1200);
  };

  const handleConfirmAbsenteesForCall = (absenteeIds: string[]) => {
    triggerCallSimulation();
    setCurrentTab('calls');
  };

  const handleUpdateAttendance = (newAttendance: AttendanceRecord[]) => {
    setAttendance(newAttendance);
    api.saveAttendance(selectedDate, selectedSection, newAttendance);
  };

  const handleUpdateQuery = (updatedQuery: ParentQuery) => {
    setQueries(prev => prev.map(q => q.id === updatedQuery.id ? updatedQuery : q));
    api.updateQuery(updatedQuery.id, updatedQuery.status, updatedQuery.resolutionNotes);
    showToast(`Query status updated to ${updatedQuery.status}`);
  };

  const handleCommitSuccess = async () => {
    showToast('Excel records committed to database! Marks preserved.');
    const updatedStudents = await api.getStudents(selectedSection);
    if (updatedStudents.length > 0) setStudents(updatedStudents);
    setTimeout(() => {
      setCurrentTab('students');
    }, 800);
  };

  const pendingQueriesCount = queries.filter(q => q.status === 'PENDING').length;
  const activeCallsCount = callTasks.filter(c => c.status === 'RINGING' || c.status === 'IN_PROGRESS').length;

  return (
    <div className="app-layout">
      {/* Toast Notice */}
      {notification && (
        <div className="toast-notice">
          <Check size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabler Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingQueriesCount={pendingQueriesCount}
        activeCallsCount={activeCallsCount}
      />

      {/* Main Content Area */}
      <div className="app-main">
        <Topbar
          currentTab={currentTab}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedSection={selectedSection}
          onSectionChange={setSelectedSection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="content-container">
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
