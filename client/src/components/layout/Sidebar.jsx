import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  Users,
  Sparkles,
  BarChart3,
  UserCheck,
  Settings,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();

  const isAgentOrAdmin = user?.role === 'agent' || user?.role === 'admin';

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['customer', 'agent', 'admin'],
    },
    {
      name: 'Tickets',
      path: '/tickets',
      icon: Ticket,
      roles: ['customer', 'agent', 'admin'],
    },
    {
      name: 'AI Assistant',
      path: '/ai-assistant',
      icon: Sparkles,
      badge: 'Gemini',
      roles: ['customer', 'agent', 'admin'],
    },
    {
      name: 'Customers',
      path: '/customers',
      icon: Users,
      roles: ['agent', 'admin'],
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      roles: ['agent', 'admin'],
    },
    {
      name: 'Team',
      path: '/team',
      icon: UserCheck,
      roles: ['agent', 'admin'],
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      roles: ['customer', 'agent', 'admin'],
    },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(user?.role || 'customer'));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-2.5 group"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ResolveAI
                </span>
                <span className="ml-2 px-1.5 py-0.5 text-[9px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200 dark:border-indigo-900">
                  SaaS
                </span>
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {visibleNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Quick Demo Role Switcher for seamless testing */}
          <div className="px-4 py-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Quick Switch Role
                </span>
                <Zap className="w-3 h-3 text-amber-500" />
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => demoLogin('customer')}
                  className={`px-1.5 py-1 text-[10px] font-medium rounded-lg border transition-all ${
                    user?.role === 'customer'
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Customer
                </button>
                <button
                  onClick={() => demoLogin('agent')}
                  className={`px-1.5 py-1 text-[10px] font-medium rounded-lg border transition-all ${
                    user?.role === 'agent'
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Agent
                </button>
                <button
                  onClick={() => demoLogin('admin')}
                  className={`px-1.5 py-1 text-[10px] font-medium rounded-lg border transition-all ${
                    user?.role === 'admin'
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`
              }
              alt={user?.name || 'Avatar'}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.email || 'user@example.com'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
