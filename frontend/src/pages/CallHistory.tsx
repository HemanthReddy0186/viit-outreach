import React, { useState } from 'react';
import { 
  Clock, 
  Play 
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
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-pretitle">Automated Communication</div>
          <h1 className="page-title">Voice Outreach</h1>
          <p className="page-description">
            Parent attendance call records, verification status, and transcripts.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={onTriggerSimulation}
            className="btn-tabler btn-tabler-primary btn-tabler-sm"
          >
            <Play size={13} /> Simulate Calls
          </button>
        </div>
      </div>

      {/* Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Left Column: Call Sessions */}
        <div>
          <div className="segmented-control" style={{ width: '100%', marginBottom: '0.85rem' }}>
            <button
              type="button"
              onClick={() => setFilterStatus('ALL')}
              className={`segmented-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
              style={{ flex: 1 }}
            >
              All ({callTasks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('COMPLETED')}
              className={`segmented-btn ${filterStatus === 'COMPLETED' ? 'active' : ''}`}
              style={{ flex: 1 }}
            >
              Completed ({callTasks.filter(c => c.status === 'COMPLETED').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('NO_ANSWER')}
              className={`segmented-btn ${filterStatus === 'NO_ANSWER' ? 'active' : ''}`}
              style={{ flex: 1 }}
            >
              No Answer ({callTasks.filter(c => c.status === 'NO_ANSWER').length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredCalls.map(call => {
              const isSelected = activeCall?.id === call.id;

              return (
                <div
                  key={call.id}
                  onClick={() => setSelectedCallId(call.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: isSelected ? '#f0fdfa' : '#ffffff',
                    border: isSelected ? '1px solid #0f766e' : '1px solid #e2e8f0',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span className="roll-number">{call.studentRoll}</span>
                    <Badge variant={call.status === 'COMPLETED' ? 'success' : call.status === 'RINGING' ? 'info' : 'warning'}>
                      {call.status}
                    </Badge>
                  </div>

                  <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{call.studentName}</strong>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                    <span>{call.parentName}</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{call.parentPhone}</span>
                  </div>

                  <div style={{
                    marginTop: '0.5rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem',
                    color: '#64748b'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {call.durationSeconds}s
                    </span>
                    {call.queryLogged && (
                      <span style={{ color: '#b45309', fontWeight: 600 }}>Inquiry Logged</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Transcript Viewer */}
        <div>
          {activeCall ? (
            <Card
              title={
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    Call Transcript
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    {activeCall.studentName} ({activeCall.studentRoll})
                  </div>
                </div>
              }
              subtitle={`Parent: ${activeCall.parentName} • ${activeCall.parentPhone}`}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Status Indicators */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <div style={{ padding: '0.65rem', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 6 }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Recipient</div>
                    <strong style={{ fontSize: '0.78rem', color: activeCall.recipientVerified ? '#0f766e' : '#64748b' }}>
                      {activeCall.recipientVerified ? 'Verified' : 'Unverified'}
                    </strong>
                  </div>

                  <div style={{ padding: '0.65rem', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 6 }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Midterm Marks</div>
                    <strong style={{ fontSize: '0.78rem', color: activeCall.marksDisclosed ? '#0f766e' : '#64748b' }}>
                      {activeCall.marksDisclosed ? 'Shared' : 'Not Shared'}
                    </strong>
                  </div>

                  <div style={{ padding: '0.65rem', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 6 }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Inquiry</div>
                    <strong style={{ fontSize: '0.78rem', color: activeCall.queryLogged ? '#b45309' : '#64748b' }}>
                      {activeCall.queryLogged ? 'Recorded' : 'None'}
                    </strong>
                  </div>
                </div>

                {/* Logged Query Alert */}
                {activeCall.queryLogged && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 6,
                    fontSize: '0.78rem'
                  }}>
                    <strong style={{ color: '#92400e' }}>Parent Inquiry:</strong>
                    <div style={{ color: '#475569', marginTop: '0.2rem' }}>
                      "{activeCall.querySummary}"
                    </div>
                  </div>
                )}

                {/* Speech Transcript */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>
                    Conversation
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {activeCall.transcript.map((line, idx) => {
                      const isAI = line.speaker === 'AI Assistant';

                      return (
                        <div
                          key={idx}
                          style={{
                            alignSelf: isAI ? 'flex-start' : 'flex-end',
                            maxWidth: '85%',
                            backgroundColor: isAI ? '#f8fafc' : '#f0fdfa',
                            border: isAI ? '1px solid #e2e8f0' : '1px solid #ccfbf1',
                            borderRadius: 6,
                            padding: '0.65rem 0.85rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginBottom: '0.2rem' }}>
                            <strong style={{ color: isAI ? '#0f766e' : '#0369a1' }}>{line.speaker}</strong>
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{line.time}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#1e293b', lineHeight: 1.4 }}>
                            {line.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                Select a call from the list to view its transcript.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
