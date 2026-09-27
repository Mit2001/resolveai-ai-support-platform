import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Paperclip,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Copy,
  RefreshCw,
  Check,
  Bot,
  Flame,
  ShieldCheck,
  HelpCircle,
  FileText,
  Lock,
} from 'lucide-react';
import { ticketsApi, messagesApi, aiApi, teamApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge, PriorityBadge, CategoryBadge, SentimentBadge } from '../components/ui/Badge';
import { CardSkeleton } from '../components/ui/Skeleton';

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const replyTextareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Conversation & Reply state
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  // Gemini AI Panel State
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);
  const [selectedTone, setSelectedTone] = useState('empathetic');
  const [copied, setCopied] = useState(false);

  const fetchTicketAndMessages = async () => {
    try {
      setLoading(true);
      const [ticketRes, messagesRes, teamRes] = await Promise.all([
        ticketsApi.getTicketById(id),
        messagesApi.getMessages(id),
        user?.role !== 'customer' ? teamApi.getTeam() : Promise.resolve({ data: { data: [] } }),
      ]);

      const t = ticketRes.data.data;
      setTicket(t);
      setMessages(messagesRes.data.data || []);
      setAgents(teamRes.data.data || []);

      // If ticket already has AI fields
      if (t.aiSummary || t.aiSuggestedResponse) {
        setAiInsight({
          category: t.category,
          priority: t.priority,
          sentiment: t.sentiment || 'Neutral',
          urgency: t.urgency || 'Medium',
          summary: t.aiSummary,
          suggestedResponse: t.aiSuggestedResponse,
          confidenceScore: 0.95,
          actionItems: [
            'Verify logs for transaction timestamps',
            'Perform customer identity checkpoint validation',
            'Follow up within standard SLA timeline',
          ],
        });
      }
    } catch (err) {
      console.error('Failed to load ticket:', err);
      toast.error(
        err.response?.data?.message || 'Ticket not found or access denied.',
        'Error Loading Ticket'
      );
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketAndMessages();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Status Change
  const handleStatusChange = async (newStatus) => {
    try {
      const res = await ticketsApi.updateTicket(ticket._id, { status: newStatus });
      setTicket(res.data.data);
      toast.success(`Status updated to ${newStatus}`, 'Ticket Updated');
    } catch (err) {
      toast.error('Failed to update status', 'Update Error');
    }
  };

  // Handle Priority Change
  const handlePriorityChange = async (newPriority) => {
    try {
      const res = await ticketsApi.updateTicket(ticket._id, { priority: newPriority });
      setTicket(res.data.data);
      toast.success(`Priority set to ${newPriority}`, 'Priority Updated');
    } catch (err) {
      toast.error('Failed to update priority', 'Update Error');
    }
  };

  // Handle Assigned Agent Change
  const handleAgentChange = async (agentId) => {
    try {
      const res = await ticketsApi.updateTicket(ticket._id, {
        assignedAgent: agentId || null,
      });
      setTicket(res.data.data);
      toast.success('Assigned agent updated', 'Assignment Updated');
    } catch (err) {
      toast.error('Failed to reassign ticket', 'Error');
    }
  };

  // Send Reply / Note
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await messagesApi.sendMessage(ticket._id, {
        message: replyText.trim(),
        isInternalNote,
      });

      setMessages((prev) => [...prev, res.data.data]);
      setReplyText('');
      setIsInternalNote(false);
      toast.success(
        isInternalNote ? 'Internal note added' : 'Customer reply sent successfully!',
        'Message Dispatched'
      );

      // Refresh ticket state for status change
      const updatedTicketRes = await ticketsApi.getTicketById(id);
      setTicket(updatedTicketRes.data.data);
    } catch (err) {
      toast.error('Failed to send message.', 'Error');
    } finally {
      setSendingReply(false);
    }
  };

  // Trigger Gemini AI Ticket Analysis
  const handleAnalyzeTicket = async () => {
    setAnalyzing(true);
    try {
      const res = await aiApi.analyzeTicket({
        ticketId: ticket._id,
        subject: ticket.subject,
        description: ticket.description,
        conversationHistory: messages.map((m) => ({
          senderName: m.sender?.name,
          message: m.message,
        })),
      });

      setAiInsight(res.data.data);
      toast.success('Gemini AI analyzed ticket successfully!', 'AI Intelligence Ready');

      // Update local ticket state
      const updatedTicket = await ticketsApi.getTicketById(id);
      setTicket(updatedTicket.data.data);
    } catch (err) {
      toast.error(
        'AI service is temporarily unavailable. You can continue handling the ticket manually.',
        'AI Unavailable'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // Trigger Gemini AI Response Generation with Tone
  const handleGenerateResponse = async () => {
    setGeneratingResponse(true);
    try {
      const res = await aiApi.generateResponse({
        subject: ticket.subject,
        description: ticket.description,
        conversationHistory: messages.map((m) => ({
          senderName: m.sender?.name,
          message: m.message,
        })),
        customerName: ticket.customer?.name || 'Customer',
        tone: selectedTone,
        category: ticket.category,
        priority: ticket.priority,
      });

      setAiInsight((prev) => ({
        ...prev,
        suggestedResponse: res.data.data.suggestedResponse,
      }));

      toast.success('Response drafted by Gemini AI!', 'Response Generated');
    } catch (err) {
      toast.error('Failed to generate response.', 'AI Error');
    } finally {
      setGeneratingResponse(false);
    }
  };

  // Use Response: Inserts AI generated draft into textarea
  const handleUseResponse = () => {
    if (aiInsight?.suggestedResponse) {
      setReplyText(aiInsight.suggestedResponse);
      setIsInternalNote(false);
      toast.info('AI Response inserted into reply box. Review and send.', 'Draft Loaded');
      
      // Scroll to textarea and focus
      setTimeout(() => {
        if (replyTextareaRef.current) {
          replyTextareaRef.current.focus();
          replyTextareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Copy AI response to clipboard
  const handleCopyResponse = () => {
    if (aiInsight?.suggestedResponse) {
      navigator.clipboard.writeText(aiInsight.suggestedResponse);
      setCopied(true);
      toast.success('Copied to clipboard!', 'Clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || !ticket) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 skeleton-shimmer rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/tickets"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-900">
                {ticket.ticketNumber}
              </span>
              <CategoryBadge category={ticket.category} />
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              {ticket.subject}
            </h1>
          </div>
        </div>

        {/* Status and Priority Modifiers (for Agents & Admins) */}
        {user?.role !== 'customer' && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Selector */}
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Open">Status: Open</option>
              <option value="In Progress">Status: In Progress</option>
              <option value="Pending">Status: Pending</option>
              <option value="Resolved">Status: Resolved</option>
              <option value="Closed">Status: Closed</option>
            </select>

            {/* Priority Selector */}
            <select
              value={ticket.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Low">Priority: Low</option>
              <option value="Medium">Priority: Medium</option>
              <option value="High">Priority: High</option>
              <option value="Critical">Priority: Critical</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Grid Layout: Left (Details & Conversation) + Right (Gemini AI Insights) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Ticket Content + Chat Thread */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Profile & Ticket Metadata Card */}
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={
                    ticket.customer?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      ticket.customer?.name || 'Customer'
                    )}`
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {ticket.customer?.name || 'Customer'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {ticket.customer?.email} • {ticket.customer?.company || 'Acme Corp'}
                  </p>
                </div>
              </div>

              {/* Assigned Agent info */}
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Assigned Agent
                </span>
                {user?.role !== 'customer' ? (
                  <select
                    value={ticket.assignedAgent?._id || ticket.assignedAgent || ''}
                    onChange={(e) => handleAgentChange(e.target.value)}
                    className="mt-0.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2 py-1 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((ag) => (
                      <option key={ag._id} value={ag._id}>
                        {ag.name} ({ag.role})
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {ticket.assignedAgent?.name || 'Assigned to Support Squad'}
                  </span>
                )}
              </div>
            </div>

            {/* Original Problem Description */}
            <div className="mt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Original Ticket Inquiry
              </span>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {ticket.description}
              </div>
            </div>
          </Card>

          {/* Chronological Chat Conversation Thread */}
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Conversation History ({messages.length} messages)
              </h3>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Created {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Messages Stream */}
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No replies yet. Send a message below to start resolving this ticket.
                </div>
              ) : (
                messages.map((msg) => {
                  const isAgent = msg.sender?.role !== 'customer';
                  const isCurrentUser = msg.sender?._id?.toString() === user?._id?.toString();

                  return (
                    <div
                      key={msg._id}
                      className={`flex gap-3 ${
                        isInternalNote
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-2xl border border-amber-200/50'
                          : ''
                      } ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <img
                        src={
                          msg.sender?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                            msg.sender?.name || 'User'
                          )}`
                        }
                        alt="Avatar"
                        className="w-8 h-8 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                      />

                      {/* Bubble */}
                      <div className={`max-w-md ${isCurrentUser ? 'items-end text-right' : 'items-start text-left'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {msg.sender?.name || 'Participant'}
                          </span>
                          {msg.isInternalNote && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded">
                              🔒 Internal Note
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                            msg.isInternalNote
                              ? 'bg-amber-100/60 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                              : isCurrentUser
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : isAgent
                              ? 'bg-purple-50 dark:bg-purple-950/40 text-slate-800 dark:text-slate-200 border border-purple-200 dark:border-purple-900 rounded-tl-none'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Box at Bottom */}
            <form onSubmit={handleSendMessage} className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isInternalNote ? 'Adding Internal Note (Staff only)' : 'Reply to Customer'}
                </span>

                {user?.role !== 'customer' && (
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <Lock className="w-3 h-3 text-amber-500" />
                    Internal Note
                  </label>
                )}
              </div>

              <textarea
                ref={replyTextareaRef}
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  isInternalNote
                    ? 'Write a private note for other support agents...'
                    : 'Type your response to the customer here (or click "Use Response" from AI Insights)...'
                }
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toast.info('File upload simulator attached (demo attachment).', 'File Attached')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Attach File
                </button>

                <Button
                  type="submit"
                  variant={isInternalNote ? 'secondary' : 'ai'}
                  size="md"
                  isLoading={sendingReply}
                  icon={Send}
                >
                  {isInternalNote ? 'Save Internal Note' : 'Send Reply'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* RIGHT COLUMN: GEMINI AI INSIGHTS PANEL */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-indigo-200/80 dark:border-indigo-800/60 bg-gradient-to-b from-indigo-50/30 dark:from-indigo-950/20 via-white dark:via-slate-900 to-white dark:to-slate-900 shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Gemini AI Insights
                  </h3>
                  <p className="text-[10px] text-slate-500">Autonomous Ticket Intelligence</p>
                </div>
              </div>

              <Button
                size="sm"
                variant="ai"
                onClick={handleAnalyzeTicket}
                isLoading={analyzing}
                icon={Sparkles}
              >
                Analyze Ticket
              </Button>
            </div>

            {/* AI Insights Content */}
            {!aiInsight ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 mx-auto flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Ticket has not been analyzed yet
                </h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Click "Analyze Ticket" above to run Google Gemini classification on subject, description, and history.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {/* Visual Category & Sentiment Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Detected Category
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {aiInsight.category || ticket.category}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Customer Sentiment
                    </span>
                    <SentimentBadge sentiment={aiInsight.sentiment || 'Neutral'} />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Urgency Level
                    </span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {aiInsight.urgency || 'High'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      AI Confidence
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.round((aiInsight.confidenceScore || 0.95) * 100)}% Match
                    </span>
                  </div>
                </div>

                {/* AI Executive Summary Card */}
                {aiInsight.summary && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs">
                    <span className="text-[10px] font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      Executive Issue Summary
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {aiInsight.summary}
                    </p>
                  </div>
                )}

                {/* AI Suggested Response Box */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      AI Suggested Response Draft
                    </span>

                    <div className="flex items-center gap-1">
                      <select
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value)}
                        className="text-[10px] font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none"
                      >
                        <option value="empathetic">Empathetic</option>
                        <option value="technical">Technical</option>
                        <option value="concise">Concise</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {aiInsight.suggestedResponse || 'Click Generate Response to draft resolution text.'}
                  </div>

                  {/* Primary "Use Response" CTA & Auxiliary Tools */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="ai"
                      onClick={handleUseResponse}
                      icon={Check}
                      className="text-xs font-semibold shadow-sm"
                    >
                      Use Response
                    </Button>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleGenerateResponse}
                        isLoading={generatingResponse}
                        icon={RefreshCw}
                        title="Regenerate with selected tone"
                      >
                        Regenerate
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopyResponse}
                        icon={copied ? Check : Copy}
                        title="Copy text"
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Recommended Next Actions */}
                {aiInsight.actionItems && aiInsight.actionItems.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Recommended Next Actions
                    </span>
                    <ul className="space-y-1.5">
                      {aiInsight.actionItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
