import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';

export default function TopBar({ pageTitle }) {
  const { user, company } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex-shrink-0">
      <div>
        <h1 className="text-lg font-bold text-slate-100">{pageTitle}</h1>
        {company?.name && (
          <p className="text-xs text-slate-500 mt-0.5">{company.name}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-xl transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/20">
            {user?.avatar}
          </div>
          <div className="hidden sm:block">
            <p className="text-slate-200 text-sm font-medium leading-tight">{user?.name}</p>
            <p className="text-slate-500 text-xs leading-tight">{user?.department}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
