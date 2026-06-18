import { useState } from 'react';
import { Users, Lock, Building2, Plus, Edit2, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';

const TABS = ['Company Information', 'Change Password', 'User Management'];

function UserModal({ isOpen, onClose, editData, onSave }) {
  const empty = { name: '', email: '', password: '', role: 'Employee', department: '' };
  const [form, setForm] = useState(editData || empty);
  const inputCls = "w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit User' : 'Add User'}>
      <form onSubmit={e => { e.preventDefault(); onSave(form); onClose(); }} className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label><input id="user-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inputCls} /></div>
        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label><input id="user-email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className={inputCls} /></div>
        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label><input id="user-password" type="text" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required={!editData} placeholder={editData ? 'Leave blank to keep current' : ''} className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Role</label><select id="user-role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className={inputCls}><option>Admin</option><option>Employee</option></select></div>
          <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Department</label><input id="user-dept" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className={inputCls} /></div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors">Cancel</button>
          <button type="submit" id="user-form-submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors">{editData ? 'Update' : 'Add User'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function Settings() {
  const { user, users, company, changePassword, addUser, updateUser, deleteUser, updateCompany } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [activeTab, setActiveTab] = useState(isAdmin ? 'Company Information' : 'Change Password');
  const [pwForm, setPwForm] = useState({ current: '', newPass: '', confirm: '' });
  const [pwShow, setPwShow] = useState({ current: false, newPass: false, confirm: false });
  const [pwMsg, setPwMsg] = useState(null);
  const [companyForm, setCompanyForm] = useState(company);
  const [companySaved, setCompanySaved] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (pwForm.newPass !== pwForm.confirm) { setPwMsg({ type: 'error', text: 'New passwords do not match.' }); return; }
    if (pwForm.newPass.length < 6) { setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return; }
    const result = changePassword(pwForm.current, pwForm.newPass);
    if (result.success) { setPwMsg({ type: 'success', text: 'Password changed successfully!' }); setPwForm({ current: '', newPass: '', confirm: '' }); }
    else setPwMsg({ type: 'error', text: result.error });
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    updateCompany(companyForm);
    setCompanySaved(true);
    setTimeout(() => setCompanySaved(false), 2500);
  };

  const inputCls = "w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelCls = "block text-sm font-medium text-slate-300 mb-1.5";
  const visibleTabs = isAdmin ? TABS : ['Change Password'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex bg-slate-800 border border-slate-700 rounded-2xl p-1 gap-1 flex-wrap">
        {visibleTabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
            {tab === 'Company Information' && <Building2 className="w-4 h-4" />}
            {tab === 'Change Password' && <Lock className="w-4 h-4" />}
            {tab === 'User Management' && <Users className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Company Information' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-100 mb-5 flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-400" /> Company Information</h3>
          <form onSubmit={handleSaveCompany} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className={labelCls}>Company Name</label><input id="company-name" value={companyForm.name} onChange={e => setCompanyForm(p => ({ ...p, name: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Email</label><input id="company-email" type="email" value={companyForm.email} onChange={e => setCompanyForm(p => ({ ...p, email: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Phone</label><input id="company-phone" value={companyForm.phone} onChange={e => setCompanyForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Website</label><input id="company-website" value={companyForm.website} onChange={e => setCompanyForm(p => ({ ...p, website: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Industry</label><input id="company-industry" value={companyForm.industry} onChange={e => setCompanyForm(p => ({ ...p, industry: e.target.value }))} className={inputCls} /></div>
              <div className="col-span-2"><label className={labelCls}>Address</label><input id="company-address" value={companyForm.address} onChange={e => setCompanyForm(p => ({ ...p, address: e.target.value }))} className={inputCls} /></div>
            </div>
            <button type="submit" id="save-company-btn" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors">
              <Save className="w-4 h-4" />{companySaved ? 'Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'Change Password' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-100 mb-5 flex items-center gap-2"><Lock className="w-5 h-5 text-indigo-400" /> Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            {[{ id: 'pw-current', key: 'current', label: 'Current Password' }, { id: 'pw-new', key: 'newPass', label: 'New Password' }, { id: 'pw-confirm', key: 'confirm', label: 'Confirm New Password' }].map(({ id, key, label }) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <div className="relative">
                  <input id={id} type={pwShow[key] ? 'text' : 'password'} value={pwForm[key]} onChange={e => { setPwForm(p => ({ ...p, [key]: e.target.value })); setPwMsg(null); }} required className={`${inputCls} pr-10`} />
                  <button type="button" onClick={() => setPwShow(p => ({ ...p, [key]: !p[key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {pwShow[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            {pwMsg && <div className={`px-4 py-3 rounded-xl text-sm border ${pwMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>{pwMsg.text}</div>}
            <button type="submit" id="change-password-btn" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors">
              <Lock className="w-4 h-4" /> Update Password
            </button>
          </form>
        </div>
      )}

      {activeTab === 'User Management' && isAdmin && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-400" /> User Management</h3>
            <button id="add-user-btn" onClick={() => { setEditUser(null); setShowUserModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{u.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="text-slate-200 font-medium text-sm">{u.name}</p>{u.id === user.id && <span className="text-xs text-slate-500">(you)</span>}</div>
                  <p className="text-slate-500 text-xs">{u.email} · {u.department}</p>
                </div>
                <Badge label={u.role} />
                <div className="flex gap-1">
                  <button id={`edit-user-${u.id}`} onClick={() => { setEditUser(u); setShowUserModal(true); }} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                  {u.id !== user.id && <button id={`delete-user-${u.id}`} onClick={() => setDeleteTarget(u)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <UserModal isOpen={showUserModal} onClose={() => { setShowUserModal(false); setEditUser(null); }} editData={editUser} onSave={data => editUser ? updateUser(editUser.id, data) : addUser(data)} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteUser(deleteTarget.id)} title="Delete User" message={`Remove "${deleteTarget?.name}" from the system?`} />
    </div>
  );
}
