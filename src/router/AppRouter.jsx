import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../screens/Layout';
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import CustomerList from '../screens/customers/CustomerList';
import ProjectList from '../screens/projects/ProjectList';
import TaskList from '../screens/tasks/TaskList';
import TaskDetail from '../screens/tasks/TaskDetail';
import Reports from '../screens/reports/Reports';
import SearchPage from '../screens/search/Search';
import Settings from '../screens/settings/Settings';

function ProtectedRoute({ children, adminOnly = false, employeeOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'Admin') return <Navigate to="/employee-dashboard" replace />;
  if (employeeOnly && user.role === 'Admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function RootRedirect() {
  const { user } = useAuth();
  if (user?.role === 'Admin') return <Navigate to="/dashboard" replace />;
  return <Navigate to="/employee-dashboard" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<RootRedirect />} />
        <Route path="dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="employee-dashboard" element={<ProtectedRoute employeeOnly><Dashboard /></ProtectedRoute>} />
        <Route path="customers" element={<ProtectedRoute adminOnly><CustomerList /></ProtectedRoute>} />
        <Route path="projects" element={<ProtectedRoute adminOnly><ProjectList /></ProtectedRoute>} />
        <Route path="tasks" element={<TaskList />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route path="reports" element={<ProtectedRoute adminOnly><Reports /></ProtectedRoute>} />
        <Route path="search" element={<SearchPage />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
