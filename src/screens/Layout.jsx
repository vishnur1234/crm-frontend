import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/employee-dashboard': 'Dashboard',
  '/customers': 'Customers',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/reports': 'Reports',
  '/search': 'Search',
  '/settings': 'Settings',
};

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const title = Object.entries(pageTitles).find(([k]) => location.pathname.startsWith(k))?.[1] || 'CRM';

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar pageTitle={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
