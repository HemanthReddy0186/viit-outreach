import React, { useState } from 'react';
import { 
  Inbox, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Save 
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ParentQuery } from '../types';

interface ParentQueriesProps {
  queries: ParentQuery[];
  onUpdateQuery: (query: ParentQuery) => void;
}

export const ParentQueries: React.FC<ParentQueriesProps> = ({
  queries,
  onUpdateQuery
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [selectedQuery, setSelectedQuery] = useState<ParentQuery | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [newStatus, setNewStatus] = useState<'PENDING' | 'IN_PROGRESS' | 'RESOLVED'>('RESOLVED');

  const filteredQueries = queries.filter(q => {
    if (filterStatus === 'ALL') return true;
    return q.status === filterStatus;
  });

  const handleOpenResolveModal = (query: ParentQuery) => {
    setSelectedQuery(query);
    setResolutionNotes(query.resolutionNotes || '');
    setNewStatus(query.status === 'RESOLVED' ? 'RESOLVED' : 'RESOLVED');
  };

  const handleSaveResolution = () => {
    if (!selectedQuery) return;
    const updated: ParentQuery = {
      ...selectedQuery,
      status: newStatus,
      resolutionNotes: resolutionNotes,
      resolvedAt: newStatus === 'RESOLVED' ? new Date().toLocaleString() : undefined
    };
    onUpdateQuery(updated);
    setSelectedQuery(null);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-pretitle">Coordinator Action Inbox</div>
          <h1 className="page-title">Parent Inquiries & Follow-up Requests</h1>
          <p className="page-description">
            Captured by the AI voice assistant during attendance calls (`FR-10`). Assigned to section coordinators.
          </p>
        </div>

        <div className="segmented-control">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`segmented-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
          >
            All ({queries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('PENDING')}
            className={`segmented-btn ${filterStatus === 'PENDING' ? 'active' : ''}`}
          >
            Pending ({queries.filter(q => q.status === 'PENDING').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('IN_PROGRESS')}
            className={`segmented-btn ${filterStatus === 'IN_PROGRESS' ? 'active' : ''}`}
          >
            In Progress ({queries.filter(q => q.status === 'IN_PROGRESS').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('RESOLVED')}
            className={`segmented-btn ${filterStatus === 'RESOLVED' ? 'active' : ''}`}
          >
            Resolved ({queries.filter(q => q.status === 'RESOLVED').length})
          </button>
        </div>
      </div>

      {/* Query Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
        {filteredQueries.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            <Inbox size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No inquiries matching this status.</p>
          </div>
        ) : (
          filteredQueries.map(query => {
            const isPending = query.status === 'PENDING';
            const isResolved = query.status === 'RESOLVED';

            return (
              <div
                key={query.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: isPending ? '1px solid #fed7aa' : '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '1.25rem',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="roll-number">{query.studentRoll}</span>
                      <Badge variant={query.category === 'ATTENDANCE_DISPUTE' ? 'danger' : 'warning'}>
                        {query.category}
                      </Badge>
                    </div>
                    <Badge variant={isResolved ? 'success' : isPending ? 'warning' : 'info'}>
                      {query.status}
                    </Badge>
                  </div>

                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{query.studentName}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.2rem 0 0.65rem 0' }}>
                    Parent: <strong>{query.parentName}</strong> • {query.parentPhone}
                  </div>

                  <div style={{
                    padding: '0.65rem 0.85rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: 6,
                    fontSize: '0.78rem',
                    color: '#334155',
                    lineHeight: 1.4,
                    border: '1px solid #f1f5f9'
                  }}>
                    "{query.summary}"
                  </div>

                  {query.resolutionNotes && (
                    <div style={{
                      marginTop: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      color: '#065f46'
                    }}>
                      <strong>Resolution Note:</strong> {query.resolutionNotes}
                    </div>
                  )}
                </div>

                <div style={{
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.72rem',
                  color: '#64748b'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> Logged: {query.createdAt}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenResolveModal(query)}
                    className="btn-tabler btn-tabler-outline btn-tabler-sm"
                  >
                    <Edit3 size={12} /> Update Status
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolution Modal */}
      {selectedQuery && (
        <Modal
          isOpen={!!selectedQuery}
          onClose={() => setSelectedQuery(null)}
          title={`Update Parent Inquiry • ${selectedQuery.studentRoll}`}
          subtitle={`Student: ${selectedQuery.studentName} • Coordinator: ${selectedQuery.assignedCoordinator}`}
          footer={
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedQuery(null)}
                className="btn-tabler btn-tabler-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveResolution}
                className="btn-tabler btn-tabler-primary"
              >
                <Save size={13} /> Save Resolution
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: 6, fontSize: '0.78rem' }}>
              <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Recorded Question:</div>
              <div style={{ fontStyle: 'italic', marginTop: '0.2rem' }}>"{selectedQuery.summary}"</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Resolution Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem' }}
              >
                <option value="PENDING">PENDING (Action Required)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Coordinator Reviewing)</option>
                <option value="RESOLVED">RESOLVED (Contacted Parent / Approved)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Coordinator Action Notes & Follow-up Details
              </label>
              <textarea
                rows={4}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Document communication with parent, verification of bus log, or medical certificate guidelines provided..."
                style={{ fontSize: '0.78rem', padding: '0.65rem' }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
