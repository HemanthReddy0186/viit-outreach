import React, { useState } from 'react';
import { 
  Inbox, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  MessageSquare, 
  Filter, 
  Edit3, 
  Save, 
  Check
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-heading font-bold text-slate-100 tracking-tight">
              Coordinator Query Inbox
            </h2>
            <Badge variant="amber">{queries.filter(q => q.status === 'PENDING').length} Action Required</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Parent inquiries captured by the AI voice assistant during attendance calls (`FR-10`).
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-xs font-medium">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1 rounded-lg transition-all ${filterStatus === 'ALL' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All ({queries.length})
          </button>
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`px-3 py-1 rounded-lg transition-all ${filterStatus === 'PENDING' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Pending ({queries.filter(q => q.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setFilterStatus('IN_PROGRESS')}
            className={`px-3 py-1 rounded-lg transition-all ${filterStatus === 'IN_PROGRESS' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            In Progress ({queries.filter(q => q.status === 'IN_PROGRESS').length})
          </button>
          <button
            onClick={() => setFilterStatus('RESOLVED')}
            className={`px-3 py-1 rounded-lg transition-all ${filterStatus === 'RESOLVED' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Resolved ({queries.filter(q => q.status === 'RESOLVED').length})
          </button>
        </div>
      </div>

      {/* Query Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQueries.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-slate-500 text-xs">
            <Inbox className="h-10 w-10 mx-auto mb-2 opacity-50" />
            No inquiries match this status filter.
          </div>
        ) : (
          filteredQueries.map((query) => {
            const isPending = query.status === 'PENDING';
            const isResolved = query.status === 'RESOLVED';

            return (
              <div
                key={query.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isPending
                    ? 'bg-slate-900/90 border-amber-500/30 shadow-lg shadow-amber-950/20'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          query.category === 'ATTENDANCE_DISPUTE' ? 'danger' :
                          query.category === 'HEALTH_LEAVE' ? 'warning' : 'indigo'
                        }
                      >
                        {query.category}
                      </Badge>
                      <span className="font-mono font-bold text-xs text-indigo-400">
                        {query.studentRoll}
                      </span>
                    </div>

                    <Badge
                      variant={
                        isResolved ? 'success' :
                        isPending ? 'warning' : 'indigo'
                      }
                      dot
                    >
                      {query.status}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 mb-1">
                    {query.studentName}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mb-3">
                    <span>Parent: <strong>{query.parentName}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">{query.parentPhone}</span>
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    "{query.summary}"
                  </div>

                  {query.resolutionNotes && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Resolution Record:
                      </span>
                      <p className="text-slate-300">{query.resolutionNotes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Logged: {query.createdAt}</span>
                  </div>

                  <button
                    onClick={() => handleOpenResolveModal(query)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-indigo-400" />
                    Update Status
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolve / Action Modal */}
      {selectedQuery && (
        <Modal
          isOpen={!!selectedQuery}
          onClose={() => setSelectedQuery(null)}
          title={`Update Parent Inquiry • ${selectedQuery.studentRoll}`}
          subtitle={`Student: ${selectedQuery.studentName} • Coordinator: ${selectedQuery.assignedCoordinator}`}
          footer={
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedQuery(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResolution}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Save className="h-3.5 w-3.5" />
                Save & Update Inbox
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Recorded Inquiry:</span>
              <p className="text-slate-200 mt-1 italic">"{selectedQuery.summary}"</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Resolution Workflow Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="PENDING">PENDING (Action Required)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Coordinator Reviewing)</option>
                <option value="RESOLVED">RESOLVED (Contacted Parent / Approved)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Coordinator Action Notes & Follow-up Details
              </label>
              <textarea
                rows={4}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Document communication with parent, verification of bus log, or medical certificate guidelines provided..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-sans"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
