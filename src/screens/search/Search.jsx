import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, FolderKanban, CheckSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../Badge';

export default function SearchPage() {
  const { customers, projects, tasks } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const matchedCustomers = q ? customers.filter(c =>
    (c.name || '').toLowerCase().includes(q) || (c.company || '').toLowerCase().includes(q) || (c.contactPerson || '').toLowerCase().includes(q)
  ) : [];

  const matchedProjects = q ? projects.filter(p =>
    (p.name || p.projectName || '').toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
  ) : [];

  const matchedTasks = q ? tasks.filter(t =>
    t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
  ) : [];

  const total = matchedCustomers.length + matchedProjects.length + matchedTasks.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          id="global-search"
          autoFocus
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search customers, projects, tasks…"
          className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-100 text-base placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-sm">Clear</button>
        )}
      </div>

      {query && <p className="text-slate-500 text-sm">{total} result{total !== 1 ? 's' : ''} for "<span className="text-slate-300">{query}</span>"</p>}

      {!query && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">Start typing to search across all records</p>
          <p className="text-slate-600 text-sm mt-1">Customers, Projects, Tasks</p>
        </div>
      )}

      {matchedCustomers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-indigo-400" /><h3 className="text-sm font-semibold text-slate-300">Customers ({matchedCustomers.length})</h3></div>
          <div className="space-y-2">
            {matchedCustomers.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 hover:bg-slate-800 transition-all cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-sm flex-shrink-0">{(c.name || '?')[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 font-medium text-sm group-hover:text-indigo-300 transition-colors">{c.name}</p>
                  <p className="text-slate-500 text-xs">{c.company} · {c.contactPerson}</p>
                </div>
                <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-lg">Customer</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {matchedProjects.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3"><FolderKanban className="w-4 h-4 text-violet-400" /><h3 className="text-sm font-semibold text-slate-300">Projects ({matchedProjects.length})</h3></div>
          <div className="space-y-2">
            {matchedProjects.map(p => (
              <div key={p.id} onClick={() => navigate('/projects')} className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 hover:bg-slate-800 transition-all cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30 border border-violet-500/20 flex items-center justify-center text-violet-300 flex-shrink-0"><FolderKanban className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 font-medium text-sm group-hover:text-indigo-300 transition-colors">{p.name || p.projectName || 'Unnamed Project'}</p>
                  <p className="text-slate-500 text-xs truncate">{p.description}</p>
                </div>
                <Badge label={p.status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {matchedTasks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3"><CheckSquare className="w-4 h-4 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-300">Tasks ({matchedTasks.length})</h3></div>
          <div className="space-y-2">
            {matchedTasks.map(t => (
              <div key={t.id} onClick={() => navigate(`/tasks/${t.id}`)} className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 hover:bg-slate-800 transition-all cursor-pointer group">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${t.priority === 'High' ? 'bg-rose-500' : t.priority === 'Medium' ? 'bg-amber-500' : 'bg-sky-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 font-medium text-sm group-hover:text-indigo-300 transition-colors">{t.title}</p>
                  <p className="text-slate-500 text-xs truncate">{t.description}</p>
                </div>
                <div className="flex gap-2"><Badge label={t.priority} /><Badge label={t.status} /></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {query && total === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No results found for "<span className="text-slate-300">{query}</span>"</p>
          <p className="text-slate-600 text-sm mt-1">Try a different keyword</p>
        </div>
      )}
    </div>
  );
}
