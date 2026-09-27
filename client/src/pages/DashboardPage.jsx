import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Ticket,
  AlertCircle,
  Clock,
  CheckCircle2,
  Flame,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Plus,
  Filter,
  BarChart2,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, ticketsApi } from '../services/api';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [analytics, setAnalytics] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, ticketsRes] = await Promise.all([
          analyticsApi.getDashboard(),
          ticketsApi.getTickets({ limit: 6, sort: '-createdAt' }),
        ]);

        setAnalytics(analyticsRes.data.data);
        setRecentTickets(ticketsRes.data.data || []);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
  const PRIORITY_COLORS = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#f59e0b',
    Low: '#10b981',
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 skeleton-shimmer rounded-xl" />
          <div className="h-4 w-96 skeleton-shimmer rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 skeleton-shimmer rounded-2xl" />
          <div className="h-80 skeleton-shimmer rounded-2xl" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Tickets',
      value: analytics?.kpi?.totalTickets || 0,
      icon: Ticket,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900',
      change: '+14% this week',
    },
    {
      title: 'Open Tickets',
      value: analytics?.kpi?.openTickets || 0,
      icon: AlertCircle,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
      change: 'Active in queue',
    },
    {
      title: 'Pending Tickets',
      value: analytics?.kpi?.pendingTickets || 0,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
      change: 'Awaiting customer',
    },
    {
      title: 'Resolved Tickets',
      value: analytics?.kpi?.resolvedTickets || 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
      change: `${analytics?.kpi?.resolutionRate || '85%'} resolution rate`,
    },
    {
      title: 'Urgent / Critical',
      value: analytics?.kpi?.urgentTickets || 0,
      icon: Flame,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900',
      change: 'Requires fast SLA',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening with your support operations today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/ai-assistant')}
            icon={Sparkles}
          >
            Ask AI Copilot
          </Button>
          <Button
            variant="ai"
            size="sm"
            onClick={outletContext?.openCreateTicket}
            icon={Plus}
          >
            New Ticket
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx} hoverEffect className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-xl border ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {kpi.value}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                {kpi.change}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket Volume & AI Assisted Over Time */}
        <Card className="lg:col-span-8 p-6">
          <CardHeader
            title="Ticket Volume & AI Auto-Assistance"
            subtitle="Daily incoming volume vs resolutions vs AI suggestions"
            action={
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                AI Accuracy: 94.6%
              </span>
            }
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.timelineData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCreated)" name="Tickets Created" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority & Category Breakdown */}
        <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
          <CardHeader
            title="Tickets by Category"
            subtitle="Distribution across support topics"
          />
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.categoryData || []} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={10} hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={80} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {(analytics?.categoryData || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Primary driver: Technical & Payments</span>
            <button onClick={() => navigate('/analytics')} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View SLA Details →
            </button>
          </div>
        </Card>
      </div>

      {/* Recent Tickets Table */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Recent Support Tickets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live queue updates with Gemini AI classifications
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/tickets')}
            icon={ArrowUpRight}
          >
            View All Tickets
          </Button>
        </div>

        {recentTickets.length === 0 ? (
          <EmptyState
            title="No tickets yet"
            description="Create your first support ticket to see AI analysis in action."
            actionText="Create Ticket"
            onAction={outletContext?.openCreateTicket}
          />
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-6">Ticket ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Subject</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Priority</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Assigned Agent</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {recentTickets.map((ticket) => (
                  <tr
                    key={ticket._id || ticket.ticketNumber}
                    onClick={() => navigate(`/tickets/${ticket._id || ticket.ticketNumber}`)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {ticket.ticketNumber}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            ticket.customer?.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                              ticket.customer?.name || 'Customer'
                            )}`
                          }
                          alt="avatar"
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                          {ticket.customer?.name || 'Customer'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 max-w-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                      {ticket.subject}
                    </td>
                    <td className="py-3.5 px-6">
                      <CategoryBadge category={ticket.category} />
                    </td>
                    <td className="py-3.5 px-6">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 dark:text-slate-400">
                      {ticket.assignedAgent ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{ticket.assignedAgent.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/${ticket._id || ticket.ticketNumber}`);
                        }}
                      >
                        Inspect →
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
