import { NavLink, useNavigate } from 'react-router-dom';
import {
  Zap, LayoutDashboard, Users, FolderKanban, CheckSquare,
  BarChart2, Search, Settings, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Dashboard',  Icon: LayoutDashboard, adminOnly: false },
  { to: '/customers',  label: 'Customers',  Icon: Users,           adminOnly: true  },
  { to: '/projects',   label: 'Projects',   Icon: FolderKanban,    adminOnly: true  },
  { to: '/tasks',      label: 'Tasks',      Icon: CheckSquare,     adminOnly: false },
  { to: '/reports',    label: 'Reports',    Icon: BarChart2,       adminOnly: true  },
  { to: '/search',     label: 'Search',     Icon: Search,          adminOnly: false },
  { to: '/settings',   label: 'Settings',   Icon: Settings,        adminOnly: false },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';

  const visibleItems = NAV_ITEMS.filter(item => !item.adminOnly || isAdmin).map(item => {
    if (item.label === 'Dashboard') {
      return { ...item, to: isAdmin ? '/dashboard' : '/employee-dashboard' };
    }
    return item;
  });

  return (
    <aside
      className={`flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} flex-shrink-0`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-slate-100 font-bold text-sm tracking-wide">Nexus CRM</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {visibleItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-slate-800 p-3 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-slate-200 text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-slate-500 text-xs truncate">{user?.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-3 border-t border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
