import React, { useState } from 'react';
import { 
  PhoneCall, 
  PhoneForwarded, 
  PhoneOff, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Play, 
  Sparkles,
  MessageSquare,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CallTask } from '../types';

interface CallHistoryProps {
  callTasks: CallTask[];
  onTriggerSimulation: () => void;
}

export const CallHistory: React.FC<CallHistoryProps> = ({
  callTasks,
  onTriggerSimulation
}) => {
  const [selectedCallId, setSelectedCallId] = useState<string>(callTasks[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredCalls = callTasks.filter(c => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  const activeCall = callTasks.find(c => c.id === selectedCallId) || callTasks[0];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-heading font-bold text-slate-100 tracking-tight">
              AI Voice Outreach & Dialogue Monitor
            </h2>
            <Badge variant="indigo" dot>Simulated Mode</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Idempotent call orchestration (`FR-07`). Strict identity verification before academic disclosure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTriggerSimulation}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Run Outreach Simulation Loop
          </button>
        </div>
      </div>

      {/* Simulation Compliance Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span><strong>Telephony Guard:</strong> No live carrier or Twilio/Exotel outbound trunks connected in Phase 1. Zero telecom charges.</span>
        </div>
        <span className="font-mono text-[11px] text-indigo-400">Deterministic Dialogue Logic</span>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Call List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`flex-1 py-1 text-center rounded-lg transition-all ${filterStatus === 'ALL' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All ({callTasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`flex-1 py-1 text-center rounded-lg transition-all ${filterStatus === 'COMPLETED' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Completed ({callTasks.filter(c => c.status === 'COMPLETED').length})
            </button>
            <button
              onClick={() => setFilterStatus('NO_ANSWER')}
              className={`flex-1 py-1 text-center rounded-lg transition-all ${filterStatus === 'NO_ANSWER' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              No Answer ({callTasks.filter(c => c.status === 'NO_ANSWER').length})
            </button>
          </div>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredCalls.map((call) => {
              const isSelected = activeCall?.id === call.id;

              return (
                <div
                  key={call.id}
                  onClick={() => setSelectedCallId(call.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-950/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-xs text-indigo-400">
                      {call.studentRoll}
                    </span>
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
                  </div>

                  <h4 className="text-sm font-semibold text-slate-100">
                    {call.studentName}
                  </h4>

                  <div className="mt-1 text-xs text-slate-400 flex items-center justify-between">
                    <span>{call.parentName}</span>
                    <span className="font-mono text-[11px] text-slate-400">{call.parentPhone}</span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {call.durationSeconds}s
                    </span>
                    {call.queryLogged && (
                      <span className="text-amber-400 flex items-center gap-1 font-sans font-medium">
                        <MessageSquare className="h-3 w-3" /> Query Captured
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Call Transcript & Inspector (7 cols) */}
        <div className="lg:col-span-7">
          {activeCall ? (
            <Card
              title={
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-bold text-slate-100">
                      Call Session: {activeCall.studentName} ({activeCall.studentRoll})
                    </h3>
                    <p className="text-xs text-slate-400 font-normal">
                      Parent: {activeCall.parentName} • {activeCall.parentPhone}
                    </p>
                  </div>
                </div>
              }
              subtitle={`Simulated Session Log • ${activeCall.timestamp} • Duration: ${activeCall.durationSeconds}s`}
            >
              <div className="space-y-4">
                {/* Safeguard Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <UserCheck className={`h-4 w-4 ${activeCall.recipientVerified ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div className="text-xs leading-tight">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Recipient Identity</span>
                      <p className={`font-semibold ${activeCall.recipientVerified ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {activeCall.recipientVerified ? 'Verified Guardian' : 'Unverified'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <ShieldCheck className={`h-4 w-4 ${activeCall.marksDisclosed ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div className="text-xs leading-tight">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Midterm Marks</span>
                      <p className={`font-semibold ${activeCall.marksDisclosed ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {activeCall.marksDisclosed ? 'Consent Disclosed' : 'Not Disclosed'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <MessageSquare className={`h-4 w-4 ${activeCall.queryLogged ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div className="text-xs leading-tight">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Parent Query</span>
                      <p className={`font-semibold ${activeCall.queryLogged ? 'text-amber-400' : 'text-slate-400'}`}>
                        {activeCall.queryLogged ? 'Captured' : 'None'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Query Summary Highlight if logged */}
                {activeCall.queryLogged && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                    <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Recorded Parent Inquiry for Coordinator:
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      "{activeCall.querySummary}"
                    </p>
                  </div>
                )}

                {/* Speech Transcript Stream */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3 max-h-[400px] overflow-y-auto">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
                    <span>Conversation Transcript Log</span>
                    <span className="font-mono text-emerald-400 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Audio Processed
                    </span>
                  </div>

                  {activeCall.transcript.map((line, idx) => {
                    const isAI = line.speaker === 'AI Assistant';

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-slate-400">
                          <span className={isAI ? 'text-indigo-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {line.speaker}
                          </span>
                          <span>•</span>
                          <span>{line.time}</span>
                        </div>
                        <div
                          className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                            isAI
                              ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                              : 'bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-600/20'
                          }`}
                        >
                          {line.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="py-12 text-center text-slate-500 text-xs">
                Select a call session from the left to view transcripts.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
