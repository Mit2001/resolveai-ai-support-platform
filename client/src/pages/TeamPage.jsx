import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Mail, Shield, User, CheckCircle2, UserX } from 'lucide-react';
import { teamApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { TableSkeleton } from '../components/ui/Skeleton';

export const TeamPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'agent',
    password: 'password123',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await teamApi.getTeam();
      setTeam(res.data.data || []);
    } catch (err) {
      console.error('Failed to load team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please enter name and email.', 'Validation Error');
      return;
    }

    setSubmitting(true);
    try {
      await teamApi.addTeamMember(formData);
      toast.success(`${formData.name} added to the support team!`, 'Member Added');
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', role: 'agent', password: 'password123' });
      fetchTeam();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (member) => {
    const newStatus = member.status === 'active' ? 'disabled' : 'active';
    try {
      await teamApi.updateTeamMember(member._id, { status: newStatus });
      toast.success(`Updated ${member.name} status to ${newStatus}`, 'Updated');
      fetchTeam();
    } catch (err) {
      toast.error('Failed to update status', 'Error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Support Team Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage support agents, roles, and ticket load balancing.
          </p>
        </div>

        {user?.role === 'admin' && (
          <Button
            variant="ai"
            size="md"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Team Member
          </Button>
        )}
      </div>

      {/* Team Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Agent</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Assigned Tickets</th>
                  <th className="py-3.5 px-6">Resolved Tickets</th>
                  <th className="py-3.5 px-6">Status</th>
                  {user?.role === 'admin' && <th className="py-3.5 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {team.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            member.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                              member.name
                            )}`
                          }
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{member.name}</p>
                          <p className="text-[11px] text-slate-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          member.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                        }`}
                      >
                        {member.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {member.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
                      {member.assignedTickets}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {member.resolvedTickets} resolved
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          member.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {member.status || 'active'}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="py-4 px-6 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusToggle(member)}
                        >
                          {member.status === 'active' ? 'Disable' : 'Activate'}
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Support Team Member"
        subtitle="Invite a new agent or administrator to the ResolveAI workspace."
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rachel Adams"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="rachel@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Select
            label="Role Permission"
            options={[
              { value: 'agent', label: 'Support Agent (Triage, Gemini AI replies)' },
              { value: 'admin', label: 'Administrator (Full workspace & team access)' },
            ]}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="ai" isLoading={submitting} icon={Plus}>
              Add Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
