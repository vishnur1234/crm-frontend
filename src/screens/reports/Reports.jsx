import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, FolderKanban, CheckSquare, Clock, Users } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        {label && <p className="text-slate-400 text-xs mb-1">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color || p.fill }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const { tasks, projects } = useApp();
  const { users } = useAuth();

  const projectsByStatus = [
    { name: 'Not Started', value: projects.filter(p => p.status === 'Not Started').length, fill: '#6366f1' },
    { name: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, fill: '#3b82f6' },
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length, fill: '#10b981' },
  ];

  const tasksByStatus = [
    { name: 'To Do', count: tasks.filter(t => t.status === 'To Do').length },
    { name: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Completed', count: tasks.filter(t => t.status === 'Completed').length },
  ];

  const completedPie = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, fill: '#10b981' },
    { name: 'Remaining', value: tasks.filter(t => t.status !== 'Completed').length, fill: '#334155' },
  ];

  const pendingByPriority = [
    { name: 'High', value: tasks.filter(t => t.status !== 'Completed' && t.priority === 'High').length, fill: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.status !== 'Completed' && t.priority === 'Medium').length, fill: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.status !== 'Completed' && t.priority === 'Low').length, fill: '#38bdf8' },
  ];

  const employeeTaskData = users.filter(u => u.role === 'Employee').map(u => ({
    name: u.name.split(' ')[0],
    total: tasks.filter(t => t.assignedTo === u.id).length,
    completed: tasks.filter(t => t.assignedTo === u.id && t.status === 'Completed').length,
    pending: tasks.filter(t => t.assignedTo === u.id && t.status !== 'Completed').length,
  }));

  const completionRate = tasks.length ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <div className="p-2 bg-indigo-500/20 rounded-lg"><FolderKanban className="w-5 h-5 text-indigo-400" /></div>
          <div><p className="text-xs text-slate-500">Total Projects</p><p className="text-2xl font-bold text-slate-100">{projects.length}</p></div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="p-2 bg-blue-500/20 rounded-lg"><CheckSquare className="w-5 h-5 text-blue-400" /></div>
          <div><p className="text-xs text-slate-500">Total Tasks</p><p className="text-2xl font-bold text-slate-100">{tasks.length}</p></div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="p-2 bg-emerald-500/20 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-400" /></div>
          <div><p className="text-xs text-slate-500">Completed Tasks</p><p className="text-2xl font-bold text-slate-100">{tasks.filter(t => t.status === 'Completed').length}</p></div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <div className="p-2 bg-amber-500/20 rounded-lg"><Clock className="w-5 h-5 text-amber-400" /></div>
          <div><p className="text-xs text-slate-500">Pending Tasks</p><p className="text-2xl font-bold text-slate-100">{tasks.filter(t => t.status !== 'Completed').length}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5"><FolderKanban className="w-5 h-5 text-indigo-400" /><h3 className="font-semibold text-slate-100">1. Total Projects by Status</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={projectsByStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {projectsByStatus.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5"><CheckSquare className="w-5 h-5 text-blue-400" /><h3 className="font-semibold text-slate-100">2. Total Tasks Overview</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tasksByStatus} barSize={36}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.1)' }} />
              <Bar dataKey="count" name="Tasks" radius={[6, 6, 0, 0]}>
                {tasksByStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5"><TrendingUp className="w-5 h-5 text-emerald-400" /><h3 className="font-semibold text-slate-100">3. Completed Tasks</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={completedPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
                {completedPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center -mt-2">
            <p className="text-4xl font-bold text-emerald-400">{completionRate}%</p>
            <p className="text-slate-500 text-xs">Completion Rate</p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5"><Clock className="w-5 h-5 text-amber-400" /><h3 className="font-semibold text-slate-100">4. Pending Tasks by Priority</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pendingByPriority} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}>
                {pendingByPriority.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5"><Users className="w-5 h-5 text-violet-400" /><h3 className="font-semibold text-slate-100">5. Employee Task Summary</h3></div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={employeeTaskData} barSize={28} barGap={4}>
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.1)' }} />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" name="Pending" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
