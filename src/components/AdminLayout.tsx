import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Menu, X, Printer, MessageSquare, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin', roles: ['admin', 'staff'] },
    { name: 'Site Editor', icon: Settings, path: '/admin/site-editor', roles: ['admin'] },
    { name: 'Pages', icon: FileText, path: '/admin/pages', roles: ['admin'] },
    { name: 'Journal', icon: FileText, path: '/admin/posts', roles: ['admin', 'staff'] },
    { name: 'Brochures', icon: Printer, path: '/admin/brochures', roles: ['admin', 'staff'] },
    { name: 'Leads', icon: MessageSquare, path: '/admin/leads', roles: ['admin', 'staff'] },
    { name: 'Settings', icon: Settings, path: '/admin/settings', roles: ['admin'] },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const filteredNavItems = navItems.filter(item => !item.roles || (role && item.roles.includes(role)));

  return (
    <div className="flex h-screen bg-[#fdfdfd] font-sans text-neutral-900 admin-root">
      {/* Sidebar */}
      <aside 
        className={`bg-[#0a0a0a] text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col border-r border-neutral-800`}
      >
        <div className="p-6 flex items-center justify-between border-b border-neutral-800">
          {isSidebarOpen && <span className="text-xl font-bold italic serif tracking-tight text-white">Admin Panel</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-neutral-800 rounded transition-colors text-white">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="px-4 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-3 p-2 bg-neutral-900/50 rounded-lg">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              <UserIcon size={16} />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-white truncate">{user?.email}</span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">{role}</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-4">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className={`flex items-center gap-4 p-3 rounded transition-all duration-200 group ${
                      isActive 
                        ? 'bg-neutral-800 text-white shadow-inner' 
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    <item.icon 
                      size={20} 
                      className={`transition-colors ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`} 
                    />
                    {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                    {isActive && isSidebarOpen && (
                      <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-3 text-neutral-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-all group"
          >
            <LogOut size={20} className="group-hover:text-red-400" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 bg-[#fdfdfd]">
        <div className="max-w-6xl mx-auto text-neutral-900">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
