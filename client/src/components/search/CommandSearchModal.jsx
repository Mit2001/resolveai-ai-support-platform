import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Ticket, Users, Sparkles, X, ArrowRight } from 'lucide-react';
import { ticketsApi } from '../../services/api';
import { StatusBadge, PriorityBadge } from '../ui/Badge';

export const CommandSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await ticketsApi.getTickets({ search: query, limit: 5 });
        setResults(res.data.data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, customer, or ask AI copilot..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {loading && (
            <div className="p-6 text-center text-xs text-slate-400">
              Searching tickets across knowledge base...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-1">
              <span className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Matching Tickets ({results.length})
              </span>
              {results.map((ticket) => (
                <div
                  key={ticket._id || ticket.ticketNumber}
                  onClick={() => {
                    onClose();
                    navigate(`/tickets/${ticket._id || ticket.ticketNumber}`);
                  }}
                  className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 shrink-0">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {ticket.ticketNumber}
                        </span>
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                          {ticket.subject}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        Customer: {ticket.customer?.name || 'Customer'} • {ticket.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={ticket.status} />
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && query.trim() !== '' && results.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching tickets found for "{query}".
            </div>
          )}

          {!query.trim() && (
            <div className="p-4">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Shortcuts
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/ai-assistant');
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3 text-left hover:border-indigo-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Ask AI Copilot</p>
                    <p className="text-[10px] text-slate-500">Query queue insights & summaries</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/tickets');
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3 text-left hover:border-indigo-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Browse All Tickets</p>
                    <p className="text-[10px] text-slate-500">Filter by SLA, priority, or category</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
