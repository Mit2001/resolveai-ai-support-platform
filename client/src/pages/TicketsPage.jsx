import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { ticketsApi } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge, PriorityBadge, CategoryBadge, SentimentBadge } from '../components/ui/Badge';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

export const TicketsPage = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        priority: priorityFilter !== 'All' ? priorityFilter : undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
      };

      const res = await ticketsApi.getTickets(params);
      setTickets(res.data.data || []);
      setPagination(res.data.pagination || { total: res.data.data?.length, totalPages: 1 });
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, statusFilter, priorityFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  };

  const statuses = ['All', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const categories = ['All', 'Technical', 'Payment', 'Billing', 'Account', 'Bug', 'Feature Request'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Ticket Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, triage, prioritize, and manage customer tickets with Gemini AI.
          </p>
        </div>

        <Button
          variant="ai"
          size="md"
          onClick={outletContext?.openCreateTicket}
          icon={Plus}
        >
          Create Ticket
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ticket ID, subject, customer name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            icon={RefreshCw}
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setPriorityFilter('All');
              setCategoryFilter('All');
              setPage(1);
            }}
          >
            Reset
          </Button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Priority dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-500">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Category dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-500">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={8} />
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No tickets match your filters"
              description="Try adjusting your search criteria or create a new support ticket."
              actionText="Create Ticket"
              onAction={outletContext?.openCreateTicket}
            />
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Ticket</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Subject & AI Summary</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Priority</th>
                    <th className="py-3.5 px-6">Sentiment</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Assigned To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket._id || ticket.ticketNumber}
                      onClick={() => navigate(`/tickets/${ticket._id || ticket.ticketNumber}`)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-4 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {ticket.ticketNumber}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              ticket.customer?.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                                ticket.customer?.name || 'Customer'
                              )}`
                            }
                            alt="avatar"
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                              {ticket.customer?.name || 'Customer'}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                              {ticket.customer?.company || 'Client'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-sm">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                          {ticket.subject}
                        </p>
                        {ticket.aiSummary ? (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
                            {ticket.aiSummary}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {ticket.description}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <CategoryBadge category={ticket.category} />
                      </td>
                      <td className="py-4 px-6">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="py-4 px-6">
                        <SentimentBadge sentiment={ticket.sentiment || 'Neutral'} />
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                        {ticket.assignedAgent ? (
                          <div className="flex items-center gap-1.5">
                            <img
                              src={
                                ticket.assignedAgent?.avatar ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                                  ticket.assignedAgent?.name
                                )}`
                              }
                              alt="Agent"
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {ticket.assignedAgent.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing page <strong className="text-slate-900 dark:text-slate-100">{pagination.page || 1}</strong> of{' '}
                <strong className="text-slate-900 dark:text-slate-100">{pagination.totalPages || 1}</strong> ({pagination.total || 0} total tickets)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={ChevronLeft}
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={ChevronRight}
                  disabled={page >= (pagination.totalPages || 1)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
