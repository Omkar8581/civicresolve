import React from 'react';
import { Clock, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const s = (status || 'Pending').toLowerCase();
  
  if (s === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Resolved
      </span>
    );
  }
  
  if (s === 'in progress' || s === 'under review' || s === 'assigned') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <Clock className="w-3.5 h-3.5" />
      Pending
    </span>
  );
};
