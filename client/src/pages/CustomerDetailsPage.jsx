import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Building,
  Calendar,
  Ticket,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { customersApi } from '../services/api';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton';

export const CustomerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const res = await customersApi.getCustomerById(id);
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load customer profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 skeleton-shimmer rounded-lg" />
        <CardSkeleton />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  const { customer, stats, tickets } = data;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <Link
          to="/customers"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Customer Profile: {customer.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete 360-degree support account history
          </p>
        </div>
      </div>

      {/* Customer Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer Identity Card */}
        <Card className="lg:col-span-5 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={
                customer.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customer.name)}`
              }
              alt="Avatar"
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {customer.name}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5" />
                {customer.company || 'Acme Corp'}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {customer.email}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined:
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                {new Date(customer.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-medium">Total Tickets</span>
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
              {stats.totalTickets}
            </span>
          </Card>
          <Card className="p-4 text-center flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-medium">Open Queue</span>
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
              {stats.openTickets}
            </span>
          </Card>
          <Card className="p-4 text-center flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-medium">Resolved</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.resolvedTickets}
            </span>
          </Card>
          <Card className="p-4 text-center flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-medium">CSAT Rating</span>
            <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
              {stats.satisfactionScore}
            </span>
          </Card>
        </div>
      </div>

      {/* Ticket History */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Support Ticket History ({tickets.length})
          </h3>
        </div>

        {tickets.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No support tickets on record for this customer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Ticket ID</th>
                  <th className="py-3.5 px-6">Subject</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Priority</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {tickets.map((t) => (
                  <tr
                    key={t._id || t.ticketNumber}
                    onClick={() => navigate(`/tickets/${t._id || t.ticketNumber}`)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {t.ticketNumber}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100 max-w-sm truncate">
                      {t.subject}
                    </td>
                    <td className="py-4 px-6">
                      <CategoryBadge category={t.category} />
                    </td>
                    <td className="py-4 px-6">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/${t._id || t.ticketNumber}`);
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
