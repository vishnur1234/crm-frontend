import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderKanban, Calendar, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';

const STATUSES = ['Not Started', 'In Progress', 'Completed'];
const EMPTY = { name: '', customerId: '', description: '', startDate: '', endDate: '', status: 'Not Started', members: [] };

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

function ProjectModal({ isOpen, onClose, editData, onSave, customers, users }) {
  const [form, setForm] = useState(EMPTY);
  const inputCls = "w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelCls = "block text-sm font-medium text-slate-300 mb-1.5";
  const employees = users.filter(u => u.role === 'Employee');

  useEffect(() => {
    if (isOpen) {
      setForm(editData ? {
        ...editData,
        name: editData.name || editData.projectName || '',
        startDate: formatDateForInput(editData.startDate),
        endDate: formatDateForInput(editData.endDate),
      } : EMPTY);
    }
  }, [editData, isOpen]);

  const toggleMember = (id) => {
    setForm(p => ({
      ...p,
      members: (p.members || []).includes(id) ? (p.members || []).filter(m => m !== id) : [...(p.members || []), id],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Project' : 'New Project'} maxWidth="max-w-2xl">
      <form onSubmit={e => { e.preventDefault(); onSave(form); onClose(); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelCls}>Project Name</label>
            <input id="proj-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Customer</label>
            <select id="proj-customer" value={form.customerId} onChange={e => setForm(p => ({ ...p, customerId: e.target.value }))} required className={inputCls}>
              <option value="">Select customer…</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Description</label>
            <textarea id="proj-desc" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>Start Date</label>
            <input id="proj-start" type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>End Date</label>
            <input id="proj-end" type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Status</label>
            <select id="proj-status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={inputCls}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Team Members</label>
            <div className="flex flex-wrap gap-2">
              {employees.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggleMember(u.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    (form.members || []).includes(u.id)
                      ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-700/50 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">{u.avatar}</span>
                  {u.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors">Cancel</button>
          <button type="submit" id="proj-submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors">{editData ? 'Update' : 'Create Project'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function ProjectList() {
  const { projects, customers, addProject, updateProject, deleteProject } = useApp();
  const { users } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const customerMap = Object.fromEntries(customers.map(c => [c.id, c.name]));
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  const filtered = filterStatus === 'All' ? projects : projects.filter(p => p.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Projects</h2>
          <p className="text-slate-400 text-sm mt-1">{projects.length} total project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          id="add-project-btn"
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500">
            <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No projects found.</p>
          </div>
        )}
        {filtered.map(p => {
          const memberUsers = (p.members || []).map(id => userMap[id]).filter(Boolean);
          return (
            <div key={p.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-slate-100 font-semibold">{p.name || p.projectName || 'Unnamed Project'}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{customerMap[p.customerId] || 'Unknown customer'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={p.status} />
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button id={`edit-proj-${p.id}`} onClick={() => { setEditData(p); setShowModal(true); }} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button id={`delete-proj-${p.id}`} onClick={() => setDeleteTarget(p)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
              {p.description && <p className="text-slate-400 text-xs mb-3 line-clamp-2">{p.description}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(p.startDate)} → {formatDate(p.endDate)}</span>
                </div>
                {memberUsers.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <div className="flex -space-x-1">
                      {memberUsers.slice(0, 4).map(u => (
                        <div key={u.id} title={u.name} className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold border border-slate-800">{u.avatar[0]}</div>
                      ))}
                      {memberUsers.length > 4 && <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs border border-slate-800">+{memberUsers.length - 4}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ProjectModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditData(null); }}
        editData={editData}
        onSave={data => editData ? updateProject(editData.id, data) : addProject(data)}
        customers={customers}
        users={users}
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteProject(deleteTarget.id)}
        title="Delete Project"
        message={`Remove project "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
