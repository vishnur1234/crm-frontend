import { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Mail, Phone, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';

const EMPTY = { name: '', contactPerson: '', email: '', phone: '', company: '', notes: '' };

function CustomerModal({ isOpen, onClose, editData, onSave }) {
  const [form, setForm] = useState(editData || EMPTY);
  const inputCls = "w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelCls = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Customer' : 'Add Customer'}>
      <form onSubmit={e => { e.preventDefault(); onSave(form); onClose(); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelCls}>Customer / Company Name</label>
            <input id="cust-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Contact Person</label>
            <input id="cust-contact" value={form.contactPerson} onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Company</label>
            <input id="cust-company" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input id="cust-email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input id="cust-phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Notes</label>
            <textarea id="cust-notes" rows={3} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className={`${inputCls} resize-none`} />
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors">Cancel</button>
          <button type="submit" id="cust-submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors">{editData ? 'Update' : 'Add Customer'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function CustomerList() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.contactPerson || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Customers</h2>
          <p className="text-slate-400 text-sm mt-1">{customers.length} total client{customers.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          id="add-customer-btn"
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="relative">
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          id="customer-search"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customers…"
          className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No customers found.</p>
          </div>
        )}
        {filtered.map(c => (
          <div key={c.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold flex-shrink-0">
                  {(c.name || '?')[0]}
                </div>
                <div>
                  <p className="text-slate-100 font-semibold text-sm">{c.name}</p>
                  <p className="text-slate-500 text-xs">{c.company}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  id={`edit-cust-${c.id}`}
                  onClick={() => { setEditData(c); setShowModal(true); }}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`delete-cust-${c.id}`}
                  onClick={() => setDeleteTarget(c)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-slate-600" />{c.contactPerson || '—'}</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-600" />{c.email || '—'}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-600" />{c.phone || '—'}</div>
              {c.notes && (
                <div className="flex items-start gap-2 pt-2 border-t border-slate-700/50 mt-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-500 line-clamp-2">{c.notes}</p>
                </div>
              )}
            </div>
            <p className="text-slate-600 text-xs mt-3 pt-3 border-t border-slate-700/50">Added {c.createdAt}</p>
          </div>
        ))}
      </div>

      <CustomerModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditData(null); }}
        editData={editData}
        onSave={data => editData ? updateCustomer(editData.id, data) : addCustomer(data)}
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteCustomer(deleteTarget.id)}
        title="Delete Customer"
        message={`Remove "${deleteTarget?.name}" and all associated data?`}
      />
    </div>
  );
}
