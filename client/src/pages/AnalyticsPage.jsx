import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Smile,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { analyticsApi } from '../services/api';
import { Card, CardHeader } from '../components/ui/Card';
import { CardSkeleton } from '../components/ui/Skeleton';

export const AnalyticsPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [dashRes, detailRes] = await Promise.all([
          analyticsApi.getDashboard(),
          analyticsApi.getTicketsAnalytics(),
        ]);
        setDashboardData(dashRes.data.data);
        setDetailedData(detailRes.data.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 skeleton-shimmer rounded-2xl" />
          <div className="h-80 skeleton-shimmer rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Support Analytics & SLA Metrics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Deep telemetry on ticket throughput, SLA compliance, customer sentiment, and agent efficiency.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500">SLA Compliance</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {detailedData?.slaCompliance || '96.2%'}
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500">First Contact Resolution</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {detailedData?.firstContactResolution || '74.5%'}
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Avg First Response Time</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {detailedData?.averageFirstResponseTime || '12m 40s'}
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950 text-pink-600 flex items-center justify-center">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500">CSAT Happiness Score</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              98.4%
            </p>
          </div>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket Volume & Resolutions */}
        <Card className="lg:col-span-8 p-6">
          <CardHeader
            title="Weekly Ticket Inflow vs Resolutions"
            subtitle="7-day moving throughput comparison"
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData?.timelineData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="areaResolved" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#areaCreated)" name="Incoming Tickets" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#areaResolved)" name="Resolved Tickets" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sentiment Distribution Pie Chart */}
        <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
          <CardHeader
            title="Customer Sentiment Analysis"
            subtitle="Gemini AI emotional classification"
          />
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={detailedData?.sentimentData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {(detailedData?.sentimentData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
            {(detailedData?.sentimentData || []).map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {s.name}: {s.count}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Hourly Volume Distribution */}
        <Card className="lg:col-span-6 p-6">
          <CardHeader
            title="Ticket Volume by Time of Day (UTC)"
            subtitle="Peak customer arrival distribution"
          />
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detailedData?.hourlyHeatmap || []}>
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                <Bar dataKey="volume" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Ticket Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Agent Performance Leaderboard */}
        <Card className="lg:col-span-6 p-6">
          <CardHeader
            title="Agent Performance & Resolution Speed"
            subtitle="Current team throughput and customer CSAT"
          />
          <div className="space-y-4">
            {(detailedData?.agentPerformance || []).map((agent, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{agent.name}</h4>
                    <p className="text-[10px] text-slate-400">Avg Response: {agent.avgResponseMins} mins</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {agent.resolvedTickets} / {agent.assignedTickets}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Resolved</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                    {agent.csat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
