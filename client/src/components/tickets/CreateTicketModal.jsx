import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { ticketsApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Send } from 'lucide-react';

export const CreateTicketModal = ({ isOpen, onClose, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'Technical',
    priority: 'Medium',
    autoAnalyze: true,
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const categoryOptions = [
    { value: 'Technical', label: 'Technical' },
    { value: 'Payment', label: 'Payment' },
    { value: 'Billing', label: 'Billing' },
    { value: 'Account', label: 'Account' },
    { value: 'Bug', label: 'Bug' },
    { value: 'Feature Request', label: 'Feature Request' },
    { value: 'Other', label: 'Other' },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low - Minor issue or inquiry' },
    { value: 'Medium', label: 'Medium - Standard service request' },
    { value: 'High', label: 'High - Disrupting normal operation' },
    { value: 'Critical', label: 'Critical - System outage / blocker' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error('Please fill in both subject and description.', 'Validation Error');
      return;
    }

    setLoading(true);
    try {
      const res = await ticketsApi.createTicket(formData);
      const newTicket = res.data.data;
      toast.success(`Ticket ${newTicket.ticketNumber} created successfully!`, 'Ticket Submitted');
      
      setFormData({
        subject: '',
        description: '',
        category: 'Technical',
        priority: 'Medium',
        autoAnalyze: true,
      });

      onClose();

      if (onTicketCreated) {
        onTicketCreated(newTicket);
      }

      // Redirect to ticket details
      navigate(`/tickets/${newTicket._id || newTicket.ticketNumber}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to submit ticket. Please try again.',
        'Creation Failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Support Ticket"
      subtitle="Submit an issue for resolution. Gemini AI will automatically categorize and prioritize."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Subject"
          placeholder="e.g. Cannot process annual renewal on Stripe checkout"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <Select
            label="Priority Level"
            options={priorityOptions}
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          />
        </div>

        <Textarea
          label="Detailed Description"
          placeholder="Please describe the steps to reproduce, affected users, error messages or symptoms..."
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        {/* AI Pre-Analysis Checkbox */}
        <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
          <input
            id="autoAnalyze"
            type="checkbox"
            checked={formData.autoAnalyze}
            onChange={(e) => setFormData({ ...formData, autoAnalyze: e.target.checked })}
            className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
          />
          <label htmlFor="autoAnalyze" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <span className="font-semibold flex items-center gap-1 text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Enable Gemini AI Ticket Pre-Analysis
            </span>
            Automatically classify sentiment, generate preliminary summary, and prepare an agent response draft upon submission.
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="ai" isLoading={loading} icon={Send}>
            Submit Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
};
