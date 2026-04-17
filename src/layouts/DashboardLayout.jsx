import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard, FileText, Users, Activity,
  LogOut, User, BookOpen, Menu, X, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const navItems = [
  { to: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard, roles: ['user', 'viewer', 'owner'] },
  { to: '/forms',     label: 'Forms',       icon: FileText,        roles: ['user', 'viewer', 'owner'] },
  { to: '/viewers',   label: 'Viewers',     icon: Users,           roles: ['user', 'owner'] },
  { to: '/activity',  label: 'Activity',    icon: Activity,        roles: ['user', 'owner'] },
];

function SidebarContent({ user, onClose, handleLogout }) {
  const filtered = navItems.filter(n => n.roles.includes(user?.role));

  return (
    <aside className="flex flex-col h-full w-64 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)' }}>

      {/* subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }} />

      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.2), transparent 70%)' }} />

      {/* Logo */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
            <BookOpen size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none tracking-tight">Family Book</p>
            <p className="text-indigo-300 text-[10px] mt-0.5 opacity-70">Personal Vault</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white md:hidden transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 px-3 space-y-0.5 overflow-y-auto pb-2">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-indigo-400 opacity-60">
          Menu
        </p>
        {filtered.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              isActive
                ? 'text-white shadow-sm'
                : 'text-indigo-200/70 hover:text-white'
            )}
            style={({ isActive }) => isActive
              ? { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }
              : {}
            }
            onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseLeave={e => { if (!e.currentTarget.style.background.includes('0.15')) e.currentTarget.style.background = ''; }}
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="relative z-10 px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <NavLink to="/profile" onClick={onClose}
          className={({ isActive }) => clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5',
            isActive ? 'text-white' : 'text-indigo-200/70 hover:text-white'
          )}
          style={({ isActive }) => isActive ? { background: 'rgba(255,255,255,0.15)' } : {}}
        >
          <User size={17} />
          <span className="flex-1">Profile</span>
        </NavLink>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          style={{ color: 'rgba(252,165,165,0.75)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fca5a5'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(252,165,165,0.75)'; e.currentTarget.style.background = ''; }}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutConfirm(false);
  };

  const routeLabel = {
    '/dashboard': 'Dashboard',
    '/forms':     'Forms',
    '/viewers':   'Viewers',
    '/activity':  'Activity',
    '/profile':   'Profile',
  }[location.pathname] || '';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f4f6fb' }}>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0 shadow-xl">
        <SidebarContent user={user} handleLogout={handleLogout} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 shadow-2xl">
            <SidebarContent user={user} onClose={() => setSidebarOpen(false)} handleLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 px-5 flex items-center justify-between flex-shrink-0"
          style={{ boxShadow: '0 1px 0 0 rgb(0 0 0 / .04)' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            {routeLabel && (
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-gray-400 hidden sm:inline text-xs">Family Book</span>
                <ChevronRight size={13} className="text-gray-300 hidden sm:inline" />
                <span className="font-semibold text-gray-800">{routeLabel}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize mt-0.5">{user?.role}</p>
            </div>
            <div className="w-8 h-8 rounded-xl text-white flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will need to login again to access your account."
        confirmText="Logout"
        loadingText="Logging out..."
      />
    </div>
  );
}
