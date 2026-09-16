import React from 'react';
import { Clock, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const s = (status || 'Pending').toLowerCase();

  // Resolved -> Green (#16A34A)
  if (s === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Resolved
      </span>
    );
  }

  // In Progress -> Professional Blue (#1E3A8A)
  if (s === 'in progress' || s === 'under review' || s === 'assigned') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-700" style={{ animationDuration: '3s' }} />
        {status}
      </span>
    );
  }

  // Rejected -> Red (#DC2626)
  if (s === 'rejected' || s === 'cancelled' || s === 'declined') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        {status}
      </span>
    );
  }

  // Pending -> Orange/Amber (#F59E0B)
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
      <Clock className="w-3.5 h-3.5 text-amber-600" />
      Pending
    </span>
  );
};

export default StatusBadge;
