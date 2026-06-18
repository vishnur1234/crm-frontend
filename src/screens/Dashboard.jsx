import { useNavigate } from 'react-router-dom';
import { Users, FolderKanban, CheckSquare, TrendingUp, Clock, CheckCircle2, Plus, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import Badge from './Badge';

export default function Dashboard() {
  const { user } = useAuth();
  const { customers, projects, tasks } = useApp();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'Admin';
  const myTasks = isAdmin ? tasks : tasks.filter(t => t.assignedTo === user?.id || t.assignedTo === user?.name);
  const completedTasks = myTasks.filter(t => t.status === 'Completed');
  const pendingTasks = myTasks.filter(t => t.status !== 'Completed');
  const inProgressTasks = myTasks.filter(t => t.status === 'In Progress');
  const recentTasks = [...myTasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const projectsInProgress = projects.filter(p => p.status === 'In Progress').length;
  const completionRate = myTasks.length ? Math.round((completedTasks.length / myTasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-400 text-sm mt-1">Here's what's happening today.</p>
        </div>
        {isAdmin && (
          <button onClick={() => navigate('/tasks')} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4" /> New Task
          </button>
        )}
      </div>

      <div className={`grid gap-4 ${isAdmin ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {isAdmin && (
          <>
            <StatCard label="Total Customers" value={customers.length} icon={Users} color="indigo" trend="Active client accounts" />
            <StatCard label="Total Projects" value={projects.length} icon={FolderKanban} color="violet" trend={`${projectsInProgress} in progress`} />
          </>
        )}
        <StatCard label={isAdmin ? 'Total Tasks' : 'My Tasks'} value={myTasks.length} icon={CheckSquare} color="blue" trend="All assigned tasks" />
        <StatCard label="Completed" value={completedTasks.length} icon={CheckCircle2} color="emerald" trend={`${completionRate}% completion rate`} />
        <StatCard label="Pending" value={pendingTasks.length} icon={Clock} color="amber" trend={`${inProgressTasks.length} in progress`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-100">{isAdmin ? 'Recent Tasks' : 'My Tasks'}</h3>
            <button onClick={() => navigate('/tasks')} className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">No tasks found.</p>
            ) : recentTasks.map(task => (
              <div key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-xl hover:bg-slate-900 cursor-pointer transition-colors group">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-sky-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium truncate group-hover:text-indigo-300 transition-colors">{task.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">Due {task.dueDate}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {task.recurrence && task.recurrence !== 'None' && <RefreshCw className="w-3 h-3 text-teal-400" title={`Recurring: ${task.recurrence}`} />}
                  <Badge label={task.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-100 mb-4">{isAdmin ? 'Project Status' : 'Task Breakdown'}</h3>
          {isAdmin ? (
            <div className="space-y-3">
              {[
                { label: 'Completed', count: projects.filter(p => p.status === 'Completed').length, color: 'bg-emerald-500', total: projects.length },
                { label: 'In Progress', count: projects.filter(p => p.status === 'In Progress').length, color: 'bg-blue-500', total: projects.length },
                { label: 'Not Started', count: projects.filter(p => p.status === 'Not Started').length, color: 'bg-slate-500', total: projects.length },
              ].map(({ label, count, color, total }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-400">{label}</span><span className="text-slate-200 font-medium">{count}</span></div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
              <button onClick={() => navigate('/projects')} className="mt-4 w-full text-center text-indigo-400 text-sm hover:text-indigo-300 transition-colors flex items-center justify-center gap-1">
                Manage Projects <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Completed', count: completedTasks.length, color: 'bg-emerald-500', total: myTasks.length },
                { label: 'In Progress', count: inProgressTasks.length, color: 'bg-blue-500', total: myTasks.length },
                { label: 'To Do', count: myTasks.filter(t => t.status === 'To Do').length, color: 'bg-amber-500', total: myTasks.length },
              ].map(({ label, count, color, total }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-400">{label}</span><span className="text-slate-200 font-medium">{count}</span></div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400 text-sm">Completion Rate</span>
              <span className="ml-auto text-emerald-400 font-bold">{completionRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
