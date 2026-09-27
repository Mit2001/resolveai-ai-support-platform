import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AppNavbar } from './AppNavbar';
import { CreateTicketModal } from '../tickets/CreateTicketModal';
import { CommandSearchModal } from '../search/CommandSearchModal';
import { Menu } from 'lucide-react';

export const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Global keyboard shortcut for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all">
        {/* Top Navbar */}
        <div className="flex items-center">
          {/* Mobile hamburger trigger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <AppNavbar
              onOpenCreateTicket={() => setCreateTicketOpen(true)}
              onOpenSearch={() => setSearchModalOpen(true)}
            />
          </div>
        </div>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ openCreateTicket: () => setCreateTicketOpen(true) }} />
        </main>
      </div>

      {/* Global Modals */}
      <CreateTicketModal
        isOpen={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
      />

      <CommandSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
};
