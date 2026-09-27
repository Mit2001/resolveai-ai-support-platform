import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  Key,
  Moon,
  Sun,
  Shield,
  Bell,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [company, setCompany] = useState(user?.company || 'Acme Corp');

  const [notifySla, setNotifySla] = useState(true);
  const [notifyAiSuggestions, setNotifyAiSuggestions] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Workspace profile preferences updated.', 'Settings Saved');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, AI integration status, notifications, and visual themes.
        </p>
      </div>

      {/* Gemini AI Integration Banner */}
      <Card className="p-6 border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50/50 dark:from-indigo-950/30 via-purple-50/30 to-pink-50/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Google Gemini AI Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Dual Inference Active
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Gemini API is securely processed exclusively on the Node.js backend. The platform provides automatic semantic fallback intelligence for offline or unconfigured environments so zero downtime is guaranteed.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="font-mono text-[11px]">Backend env: GEMINI_API_KEY</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
            Models supported: Gemini 1.5 Flash, 2.0 Flash, 2.5 Flash
          </span>
        </div>
      </Card>

      {/* Profile Form */}
      <Card className="p-6">
        <CardHeader
          title="Account Profile"
          subtitle="Update your display name, corporate affiliation, and identity"
        />
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`
              }
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
            />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Profile Avatar</p>
              <p className="text-[11px] text-slate-400">Generated dynamically based on account handle</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email Address"
              value={email}
              disabled
              className="opacity-70 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Organization / Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Role Permission
              </label>
              <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                {user?.role || 'Customer'}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="ai" icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Appearance & Theme */}
      <Card className="p-6">
        <CardHeader
          title="Appearance & Theme"
          subtitle="Customize interface lighting according to your preference"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => {
              if (isDark) toggleTheme();
            }}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              !isDark
                ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Light Mode</p>
                <p className="text-[10px] text-slate-500">Crisp, clean high-contrast surfaces</p>
              </div>
            </div>
            {!isDark && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
          </div>

          <div
            onClick={() => {
              if (!isDark) toggleTheme();
            }}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              isDark
                ? 'border-indigo-500 bg-indigo-950/40'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Dark Mode</p>
                <p className="text-[10px] text-slate-500">Sleek midnight palette for low-light focus</p>
              </div>
            </div>
            {isDark && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <CardHeader
          title="Notification Preferences"
          subtitle="Configure proactive SLA breaches and AI triage alerts"
        />
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">SLA Breach Warnings</p>
              <p className="text-[10px] text-slate-500">Notify 1 hour before SLA expiration on high/critical tickets</p>
            </div>
            <input
              type="checkbox"
              checked={notifySla}
              onChange={(e) => setNotifySla(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Gemini AI Auto-Classification Alerts</p>
              <p className="text-[10px] text-slate-500">Receive notifications when Gemini flags frustrated or urgent customer tickets</p>
            </div>
            <input
              type="checkbox"
              checked={notifyAiSuggestions}
              onChange={(e) => setNotifyAiSuggestions(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>
      </Card>
    </div>
  );
};
