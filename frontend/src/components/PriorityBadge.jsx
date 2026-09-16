import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const PriorityBadge = ({ priority }) => {
  const p = (priority || 'Medium').toLowerCase();

  if (p === 'high') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle className="w-3 h-3" />
        High Priority
      </span>
    );
  }

  if (p === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <AlertCircle className="w-3 h-3" />
        Medium
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      <Info className="w-3 h-3" />
      Low
    </span>
  );
};
