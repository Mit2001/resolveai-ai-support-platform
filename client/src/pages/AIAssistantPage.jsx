import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  HelpCircle,
  TrendingUp,
  Flame,
  CreditCard,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { aiApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const AIAssistantPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋 I am your **ResolveAI Copilot** powered by Google Gemini.\n\nI can help you:\n- 📊 Summarize the current queue & critical issues\n- 🔍 Inspect specific tickets by number (e.g. #TCK-1024)\n- ✍️ Draft empathetic customer response templates\n- ⚡ Explain technical root causes and SLA deadlines\n\nHow can I assist your support team right now?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const suggestionPrompts = [
    { text: "Summarize today's critical tickets.", icon: Flame },
    { text: 'Which tickets need immediate attention?', icon: TrendingUp },
    { text: 'Give me a response for an angry customer.', icon: Sparkles },
    { text: 'Summarize ticket #TCK-1024.', icon: HelpCircle },
    { text: 'How many payment-related tickets are open?', icon: CreditCard },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await aiApi.chatAssistant({
        message: query.trim(),
        history: historyPayload,
      });

      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.data.data.reply,
        modelUsed: res.data.data.modelUsed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      toast.error('AI assistant service is currently unavailable.', 'Error');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'AI service is temporarily unavailable. You can continue handling tickets manually.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!', 'Clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: `Conversation cleared. How can I help you today, ${user?.name || 'Support Agent'}?`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in flex flex-col h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              ResolveAI Assistant
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-3 h-3 text-purple-500" />
              Gemini Flash
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your dedicated AI support copilot for triage, queue summaries, and drafted resolutions.
          </p>
        </div>

        <Button size="sm" variant="ghost" icon={Trash2} onClick={clearChat}>
          Clear Chat
        </Button>
      </div>

      {/* Main Chat Card Container */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden shadow-md">
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>

                {/* Footer details */}
                <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[10px] opacity-70">
                  <span>
                    {m.role === 'assistant' ? m.modelUsed || 'ResolveAI Engine' : 'You'} •{' '}
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {m.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="hover:opacity-100 flex items-center gap-1 cursor-pointer transition-opacity"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedId === m.id ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3.5 items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>Gemini AI is analyzing workspace records...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {suggestionPrompts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s.text)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shrink-0 cursor-pointer"
            >
              <s.icon className="w-3 h-3 text-indigo-500" />
              <span>{s.text}</span>
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask anything about support queues, ticket summaries, or drafting responses..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              variant="ai"
              size="md"
              disabled={!input.trim() || loading}
              icon={Send}
            >
              Ask Copilot
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
