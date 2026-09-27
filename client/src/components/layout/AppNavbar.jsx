import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Plus, Sparkles, User, LogOut, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const AppNavbar = ({ onOpenCreateTicket, onOpenSearch }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Gemini AI Analysis Ready',
      desc: 'Ticket #TCK-1024 classified as Payment (High Urgency)',
      time: '2m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'New Customer Response',
      desc: 'Sarah Connor updated ticket #TCK-1025',
      time: '18m ago',
      unread: true,
    },
    {
      id: 3,
      title: 'SLA Warning Alert',
      desc: 'TCK-1002 is within 45 mins of SLA deadline',
      time: '1h ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      {/* Search Input Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div
          onClick={onOpenSearch}
          className="relative w-full flex items-center bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-3.5 py-1.5 text-xs text-slate-400 cursor-pointer hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-colors"
        >
          <Search className="w-3.5 h-3.5 mr-2.5 text-slate-400 shrink-0" />
          <span className="truncate">Search tickets, customers, or ask AI copilot...</span>
          <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Tools & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Create Ticket CTA */}
        {onOpenCreateTicket && (
          <Button
            size="sm"
            variant="ai"
            icon={Plus}
            onClick={onOpenCreateTicket}
            className="hidden sm:inline-flex"
          >
            New Ticket
          </Button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Notifications
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer">
                  Mark all as read
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      n.unread ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`
              }
              alt={user?.name || 'Avatar'}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 capitalize mt-0.5 leading-none">
                {user?.role || 'Customer'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                  Role: {user?.role?.toUpperCase()}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
