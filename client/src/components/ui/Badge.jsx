import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    Open: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50',
    'In Progress': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50',
    Closed: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700',
  };

  const dots = {
    Open: 'bg-blue-500 animate-pulse',
    'In Progress': 'bg-purple-500',
    Pending: 'bg-amber-500',
    Resolved: 'bg-emerald-500',
    Closed: 'bg-slate-400',
  };

  const style = styles[status] || styles.Open;
  const dot = dots[status] || dots.Open;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const styles = {
    Critical: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50',
    High: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50',
  };

  const style = styles[priority] || styles.Medium;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${style}`}>
      {priority}
    </span>
  );
};

export const CategoryBadge = ({ category }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      {category}
    </span>
  );
};

export const SentimentBadge = ({ sentiment }) => {
  const configs = {
    Positive: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400', icon: '😊' },
    Neutral: { color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400', icon: '😐' },
    Frustrated: { color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400', icon: '😤' },
    Angry: { color: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400', icon: '😡' },
    Urgent: { color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-400', icon: '🚨' },
    Confused: { color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400', icon: '🤔' },
  };

  const config = configs[sentiment] || configs.Neutral;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <span>{config.icon}</span>
      <span>{sentiment}</span>
    </span>
  );
};
