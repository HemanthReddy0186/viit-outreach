import React from 'react';
import { 
  Users, 
  UserX, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Upload, 
  Calendar,
  Sparkles,
  ChevronRight,
  Clock,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Student, AttendanceRecord, CallTask, ParentQuery } from '../types';

interface DashboardProps {
  students: Student[];
  attendance: AttendanceRecord[];
  callTasks: CallTask[];
  queries: ParentQuery[];
  onNavigate: (tab: any) => void;
  selectedDate: string;
  selectedSection: string;
  onTriggerCallSimulation: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  attendance,
  callTasks,
  queries,
  onNavigate,
  selectedDate,
  selectedSection,
  onTriggerCallSimulation
}) => {
  // Calculations
  const sectionStudents = students.filter(s => s.section === selectedSection);
  const totalStudents = sectionStudents.length;

  const todayAbsentees = attendance.filter(
    a => a.section === selectedSection && a.date === selectedDate && a.status === 'ABSENT'
  );
  const absenteeCount = todayAbsentees.length;
  const presentCount = totalStudents - absenteeCount;
  const todayAttendanceRate = totalStudents > 0 
    ? ((presentCount / totalStudents) * 100).toFixed(1) 
    : '0.0';

  const criticalAttendanceCount = sectionStudents.filter(s => s.attendancePercentage < 65).length;
  const warningAttendanceCount = sectionStudents.filter(s => s.attendancePercentage >= 65 && s.attendancePercentage < 75).length;
  const safeAttendanceCount = sectionStudents.filter(s => s.attendancePercentage >= 75).length;

  const pendingQueries = queries.filter(q => q.status === 'PENDING');
  const activeCalls = callTasks.filter(c => c.status === 'RINGING' || c.status === 'IN_PROGRESS' || c.status === 'QUEUED');

  return (
    <div className="space-y-6">
      {/* Institutional Alert & Simulation Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-purple-950/50 p-5 border border-indigo-500/25 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500 text-white">
                VIIT CSE • SECTION {selectedSection}
              </span>
              <span className="text-xs text-indigo-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                Phase 1 Prototype System
              </span>
            </div>
            <h2 className="text-xl font-heading font-bold text-white tracking-tight">
              Attendance Follow-up & Parent Voice Outreach Center
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Official faculty portal for daily attendance review, Excel data sync with marks preservation, and automated parental outreach with verified recipient authentication.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('attendance')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5" />
              Mark Today's Roster
            </button>
            <button
              onClick={() => onNavigate('import')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Excel Sync
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Attendance Rate"
          value={`${todayAttendanceRate}%`}
          subtitle={`${presentCount} present of ${totalStudents} enrolled`}
          icon={CheckCircle2}
          trend={{ value: `${absenteeCount} absent today`, positive: absenteeCount === 0 }}
          accentColor="emerald"
        />

        <StatCard
          title="Absentees Requiring Call"
          value={absenteeCount}
          subtitle={`Section ${selectedSection} on ${selectedDate}`}
          icon={UserX}
          trend={{ value: `${activeCalls.length} in queue`, positive: false }}
          accentColor="rose"
        />

        <StatCard
          title="Parent Voice Calls"
          value={callTasks.length}
          subtitle={`${callTasks.filter(c => c.status === 'COMPLETED').length} verified & completed`}
          icon={PhoneCall}
          accentColor="indigo"
        />

        <StatCard
          title="Pending Parent Queries"
          value={pendingQueries.length}
          subtitle={`${queries.length} total logged by AI`}
          icon={AlertTriangle}
          trend={{ value: 'Requires Action', positive: false }}
          accentColor="amber"
        />
      </div>

      {/* Middle Grid: Today's Absentees & Attendance Health Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Absentee Confirmation & Call Action */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title={`Today's Absentees Roster (${selectedDate})`}
            subtitle="Coordinators must review and confirm absentees before triggering parent calls"
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={onTriggerCallSimulation}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  Simulate Parent Calls
                </button>
                <button
                  onClick={() => onNavigate('attendance')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  Full Roster <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            }
          >
            {todayAbsentees.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="font-medium text-slate-200">Full Attendance Recorded!</p>
                <p className="text-xs text-slate-400 mt-1">No absentees reported for Section {selectedSection} on {selectedDate}.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-semibold">Roll Number</th>
                      <th className="pb-3 font-semibold">Student Name</th>
                      <th className="pb-3 font-semibold">Overall %</th>
                      <th className="pb-3 font-semibold">Parent Contact</th>
                      <th className="pb-3 font-semibold">Outreach Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {todayAbsentees.map((record) => {
                      const student = students.find(s => s.id === record.studentId);
                      const call = callTasks.find(c => c.studentRoll === record.studentRoll);

                      return (
                        <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 font-mono font-bold text-slate-200">
                            {record.studentRoll}
                          </td>
                          <td className="py-3 font-medium text-slate-100">
                            {record.studentName}
                          </td>
                          <td className="py-3 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              (student?.attendancePercentage || 0) < 65
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                : (student?.attendancePercentage || 0) < 75
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {student?.attendancePercentage}%
                            </span>
                          </td>
                          <td className="py-3 text-slate-400">
                            <div className="text-slate-200 font-medium">{student?.parentName}</div>
                            <div className="font-mono text-[11px] text-slate-400">{student?.parentPhone}</div>
                          </td>
                          <td className="py-3">
                            {call ? (
                              <Badge
                                variant={
                                  call.status === 'COMPLETED' ? 'success' :
                                  call.status === 'RINGING' ? 'indigo' :
                                  call.status === 'NO_ANSWER' ? 'warning' : 'neutral'
                                }
                                dot
                              >
                                {call.status}
                              </Badge>
                            ) : (
                              <Badge variant="danger" dot>
                                PENDING CALL
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Live AI Voice Call Feed */}
          <Card
            title="Recent AI Voice Call Transcripts (Simulated)"
            subtitle="Demonstrating student identity verification, attendance disclosure, and marks inquiry"
            action={
              <button
                onClick={() => onNavigate('calls')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                View Call History <ChevronRight className="h-3.5 w-3.5" />
              </button>
            }
          >
            <div className="space-y-3">
              {callTasks.slice(0, 2).map((call) => (
                <div key={call.id} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200 text-xs">
                        {call.studentRoll}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-medium text-slate-300">
                        {call.studentName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {call.timestamp}
                      </span>
                      <Badge variant={call.status === 'COMPLETED' ? 'success' : 'warning'}>
                        {call.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Snippet from transcript */}
                  <div className="text-xs space-y-1.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/50">
                    <div className="text-indigo-300 font-mono text-[11px]">
                      <span className="font-bold text-indigo-400">AI Assistant:</span> {call.transcript[0]?.text}
                    </div>
                    {call.transcript[1] && (
                      <div className="text-slate-300 font-mono text-[11px]">
                        <span className="font-bold text-emerald-400">Parent:</span> {call.transcript[1]?.text}
                      </div>
                    )}
                  </div>

                  {call.queryLogged && (
                    <div className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Query Logged:</strong> {call.querySummary}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Attendance Risk Distribution & Coordinator Quick Actions */}
        <div className="space-y-6">
          {/* Statutory Attendance Threshold Breakdown */}
          <Card
            title="Section Attendance Health"
            subtitle="University threshold rule: Min 75% required for exams"
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Safe Standing (≥ 75%)
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    {safeAttendanceCount} Students ({((safeAttendanceCount / totalStudents) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${(safeAttendanceCount / totalStudents) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Condonation Zone (65% - 74%)
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    {warningAttendanceCount} Students ({((warningAttendanceCount / totalStudents) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${(warningAttendanceCount / totalStudents) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    Detention Risk (&lt; 65%)
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    {criticalAttendanceCount} Students ({((criticalAttendanceCount / totalStudents) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full" 
                    style={{ width: `${(criticalAttendanceCount / totalStudents) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Institutional Policy:</strong> Students falling below 65% trigger mandatory parental calls and coordinator counselling notifications.
            </div>
          </Card>

          {/* Pending Coordinator Inbox Quick Preview */}
          <Card
            title="Coordinator Action Queue"
            subtitle={`${pendingQueries.length} parent queries require review`}
            action={
              <button
                onClick={() => onNavigate('queries')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Go to Inbox
              </button>
            }
          >
            <div className="space-y-3">
              {pendingQueries.map(q => (
                <div 
                  key={q.id}
                  onClick={() => onNavigate('queries')}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="warning">{q.category}</Badge>
                    <span className="font-mono text-[11px] text-slate-400">{q.createdAt.split(' ')[1]} {q.createdAt.split(' ')[2]}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {q.studentRoll} • {q.studentName}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {q.summary}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
