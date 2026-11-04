import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FilePlus2, History, User, LogOut, Users, Database, Wand2,
  Cpu, BarChart3, Clock, ScrollText, Settings, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { config } from '../config.js';

const applicantLinks = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/apply', label: 'New Application', icon: FilePlus2 },
  { to: '/app/history', label: 'History', icon: History },
  { to: '/app/profile', label: 'Profile', icon: User },
];

const adminLinks = [
  { to: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/applications', label: 'Applications', icon: Users },
  { to: '/admin/datasets', label: 'Datasets', icon: Database },
  { to: '/admin/preprocessing', label: 'Preprocessing', icon: Wand2 },
  { to: '/admin/training', label: 'Model Training', icon: Cpu },
  { to: '/admin/comparison', label: 'Model Comparison', icon: BarChart3 },
  { to: '/admin/retention', label: 'Data Retention', icon: Clock },
  { to: '/admin/audit', label: 'Audit Logs', icon: ScrollText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

// Sidebar + top bar shared by both portals.
export default function Layout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = role === 'admin' ? adminLinks : applicantLinks;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><ShieldCheck size={22} /> <span className="label">{config.APP_NAME}</span></div>
        <nav>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}>
              <l.icon size={18} /> <span className="label">{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="side-link logout" onClick={handleLogout}>
          <LogOut size={18} /> <span className="label">Logout</span>
        </button>
      </aside>
      <div className="main">
        <div className="demo-banner">
          Demo only: login, data and predictions on this site are simulated. Nothing is a real lending decision.
        </div>
        <header className="topbar">
          <strong>{role === 'admin' ? 'Admin Portal' : 'Applicant Portal'}</strong>
          <span className="muted">{user?.name} ({user?.email})</span>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
