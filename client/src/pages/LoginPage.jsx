import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, UserCheck, Shield, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      // Error handled by Toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    try {
      await demoLogin(role);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // toast handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Background gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/15 blur-[100px] rounded-full pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            ResolveAI
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Sign in to your account
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          AI-Powered Support & Ticket Management Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl backdrop-blur-xl">
          {/* Quick 1-Click Demo Logins */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
            <span className="text-[11px] font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider block mb-2">
              ⚡ 1-Click Demo Accounts:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('agent')}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 text-left transition-all hover:scale-102"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Agent</span>
                </div>
                <span className="text-[9px] text-slate-400 block mt-0.5">Support Lead</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 text-left transition-all hover:scale-102"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>Customer</span>
                </div>
                <span className="text-[9px] text-slate-400 block mt-0.5">Client User</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 text-left transition-all hover:scale-102"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>Admin</span>
                </div>
                <span className="text-[9px] text-slate-400 block mt-0.5">Executive</span>
              </button>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 text-[10px] font-medium">
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="ai"
              size="lg"
              isLoading={loading}
              icon={ArrowRight}
              className="w-full mt-2"
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* Register footer link */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
