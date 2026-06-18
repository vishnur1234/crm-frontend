const COLOR_MAP = {
  indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  icon: 'bg-indigo-500/20 text-indigo-400',  value: 'text-indigo-400' },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  icon: 'bg-violet-500/20 text-violet-400',  value: 'text-violet-400' },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    icon: 'bg-blue-500/20 text-blue-400',      value: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'bg-emerald-500/20 text-emerald-400', value: 'text-emerald-400' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: 'bg-amber-500/20 text-amber-400',   value: 'text-amber-400' },
};

export default function StatCard({ label, value, icon: Icon, color = 'indigo', trend }) {
  const c = COLOR_MAP[color] || COLOR_MAP.indigo;
  return (
    <div className={`flex items-center gap-4 p-4 ${c.bg} border ${c.border} rounded-2xl hover:scale-[1.02] transition-transform duration-200`}>
      <div className={`p-2.5 ${c.icon} rounded-xl flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className={`text-2xl font-bold ${c.value}`}>{value}</p>
        {trend && <p className="text-xs text-slate-500 truncate mt-0.5">{trend}</p>}
      </div>
    </div>
  );
}
