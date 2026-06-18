import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckSquare, RefreshCw, Calendar, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';

const PRIORITIES = ['High', 'Medium', 'Low'];
const STATUSES = ['To Do', 'In Progress', 'Completed'];
const RECURRENCES = ['None', 'Daily', 'Weekly', 'Monthly'];

const EMPTY = {
  title: '', description: '', projectId: '', assignedTo: '',
  dueDate: '', priority: 'Medium', status: 'To Do', recurrence: 'None',
};

const formatDateForInput = (dateVal) => {
  if (!dateVal) return '';
  if (dateVal && typeof dateVal.toDate === 'function') {
    try {
      return dateVal.toDate().toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  }
  if (dateVal && typeof dateVal.seconds === 'number') {
    try {
      return new Date(dateVal.seconds * 1000).toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  }
  return typeof dateVal === 'string' ? dateVal.split('T')[0] : '';
};

const formatDate = (dateVal) => {
  if (!dateVal) return '—';
  if (dateVal && typeof dateVal.toDate === 'function') {
    try {
      return dateVal.toDate().toISOString().split('T')[0];
    } catch (e) {
      return '—';
    }
  }
  if (dateVal && typeof dateVal.seconds === 'number') {
    try {
      return new Date(dateVal.seconds * 1000).toISOString().split('T')[0];
    } catch (e) {
      return '—';
    }
  }
  return typeof dateVal === 'string' ? dateVal.split('T')[0] : String(dateVal);
};

function TaskModal({ isOpen, onClose, editData, onSave, projects, users }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (isOpen) {
      setForm(editData ? {
        ...editData,
        dueDate: formatDateForInput(editData.dueDate),
      } : EMPTY);
    }
  }, [editData, isOpen]);

  const inputCls = "w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelCls = "block text-sm font-medium text-slate-300 mb-1.5";
  const employees = users.filter(u => u.role === 'Employee');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Task' : 'New Task'} maxWidth="max-w-2xl">
      <form onSubmit={e => { e.preventDefault(); onSave(form); onClose(); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelCls}>Task Title</label>
            <input id="task-title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Description</label>
            <textarea id="task-desc" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>Project</label>
            <select id="task-project" value={form.projectId} onChange={e => setForm(p => ({ ...p, projectId: e.target.value }))} required className={inputCls}>
              <option value="">Select project…</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name || p.projectName || 'Unnamed Project'}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Assigned To</label>
            <select id="task-assignee" value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))} required className={inputCls}>
              <option value="">Select employee…</option>
              {employees.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Due Date</label>
            <input id="task-due" type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Priority</label>
            <select id="task-priority" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className={inputCls}>
              {PRIORITIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select id="task-status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={inputCls}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Recurrence</label>
            <select id="task-recurrence" value={form.recurrence} onChange={e => setForm(p => ({ ...p, recurrence: e.target.value }))} className={inputCls}>
              {RECURRENCES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors">Cancel</button>
          <button type="submit" id="task-submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors">{editData ? 'Update' : 'Create Task'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function TaskList() {
  const { tasks, projects, addTask, updateTask, deleteTask } = useApp();
  const { user, users } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name || p.projectName || 'Unnamed Project']));
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  const myTasks = isAdmin ? tasks : tasks.filter(t => t.assignedTo === user?.id);

  const filtered = myTasks.filter(t => {
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    return true;
  });

  const priorityDot = { High: 'bg-rose-500', Medium: 'bg-amber-500', Low: 'bg-sky-500' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">{isAdmin ? 'All Tasks' : 'My Tasks'}</h2>
          <p className="text-slate-400 text-sm mt-1">{myTasks.length} task{myTasks.length !== 1 ? 's' : ''} total</p>
        </div>
        {isAdmin && (
          <button
            id="add-task-btn"
            onClick={() => { setEditData(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-slate-400 text-sm">Status:</span>
          {['All', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>{s}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
          <span className="text-slate-400 text-sm">Priority:</span>
          {['All', ...PRIORITIES].map(p => (
            <button key={p} onClick={() => setFilterPriority(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterPriority === p ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No tasks match the current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {filtered.map(task => {
              const assignee = userMap[task.assignedTo];
              return (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800 cursor-pointer transition-colors group"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[task.priority] || 'bg-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-slate-200 text-sm font-medium truncate group-hover:text-indigo-300 transition-colors">{task.title}</p>
                      {task.recurrence && task.recurrence !== 'None' && (
                        <RefreshCw className="w-3 h-3 text-teal-400 flex-shrink-0" title={`Recurring: ${task.recurrence}`} />
                      )}
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{projectMap[task.projectId] || 'Unknown project'}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {assignee && (
                      <div title={assignee.name} className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                        {assignee.avatar}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />{formatDate(task.dueDate)}
                    </div>
                    <Badge label={task.priority} />
                    <Badge label={task.status} />
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button id={`edit-task-${task.id}`} onClick={() => { setEditData(task); setShowModal(true); }} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button id={`delete-task-${task.id}`} onClick={() => setDeleteTarget(task)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditData(null); }}
        editData={editData}
        onSave={data => editData ? updateTask(editData.id, data) : addTask(data)}
        projects={projects}
        users={users}
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTask(deleteTarget.id)}
        title="Delete Task"
        message={`Delete task "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
