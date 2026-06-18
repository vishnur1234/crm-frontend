const BADGE_STYLES = {
  // Status
  Completed:    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  'In Progress':'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  'To Do':      'bg-slate-600/40 text-slate-400 border border-slate-600/50',
  'Not Started':'bg-slate-600/40 text-slate-400 border border-slate-600/50',
  // Priority
  High:   'bg-rose-500/15 text-rose-400 border border-rose-500/25',
  Medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  Low:    'bg-sky-500/15 text-sky-400 border border-sky-500/25',
  // Role
  Admin:    'bg-violet-500/15 text-violet-400 border border-violet-500/25',
  Employee: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25',
};

export default function Badge({ label }) {
  const cls = BADGE_STYLES[label] || 'bg-slate-600/40 text-slate-400 border border-slate-600/50';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}
