import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Bot,
  BrainCircuit,
  Clock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Users,
  LineChart,
  HelpCircle,
  Play,
  Flame,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge, PriorityBadge, SentimentBadge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();

  const handleQuickDemo = async (role = 'agent') => {
    await demoLogin(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-36 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Powered by Google Gemini AI 1.5/2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400 font-normal">Enterprise Ready</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] sm:leading-[1.12]">
            Resolve Customer Issues{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Faster with AI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            ResolveAI helps modern support teams analyze tickets, predict sentiment, auto-generate intelligent responses, and resolve complex issues in seconds with Gemini AI-powered workflows.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="ai" icon={ArrowRight} className="w-full sm:w-auto shadow-lg shadow-indigo-500/25">
                Get Started Free
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              icon={Play}
              onClick={() => handleQuickDemo('agent')}
              className="w-full sm:w-auto bg-white dark:bg-slate-900 shadow-sm"
            >
              1-Click Live Demo
            </Button>
          </div>

          {/* Quick Credential Hint */}
          <p className="mt-3 text-xs text-slate-400">
            No credit card required. Try instant demo as Support Agent, Customer, or Admin.
          </p>

          {/* Dashboard Preview Mockup */}
          <div className="mt-16 lg:mt-24 relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-indigo-500/20 via-slate-200/40 dark:via-slate-800/40 to-transparent border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-sm">
              <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left shadow-inner">
                {/* Mock Browser Header */}
                <div className="h-10 px-4 bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono text-slate-400 ml-3">
                      https://app.resolveai.io/tickets/TCK-1024
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Copilot Active
                  </div>
                </div>

                {/* Mock Content Layout */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Ticket & Chat */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                          #TCK-1024
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Payment failing repeatedly on checkout
                        </h4>
                      </div>
                      <StatusBadge status="In Progress" />
                    </div>

                    {/* Chat Bubble Customer */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Alex Rivera (Customer)</span>
                        <span className="text-[10px] text-slate-400">2m ago</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        "Payment keeps failing whenever our finance team attempts to renew the annual enterprise tier. The Stripe 3DS popup shows a blank screen."
                      </p>
                    </div>

                    {/* Chat Bubble Agent */}
                    <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-xs ml-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-indigo-700 dark:text-indigo-300">Sarah Jenkins (Agent)</span>
                        <span className="text-[10px] text-slate-400">Just now</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-200">
                        "I've verified the Stripe gateway handshake and re-synced the payment intent token. Please try renewing once more!"
                      </p>
                    </div>
                  </div>

                  {/* Right: AI Insights Panel Mockup */}
                  <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        Gemini AI Insights
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                        96% Confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Category</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Payment</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Sentiment</span>
                        <span className="font-semibold text-amber-600">Frustrated 😤</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-xs">
                      <span className="text-[10px] font-semibold text-indigo-900 dark:text-indigo-300 block mb-1">
                        AI Generated Response Suggestion
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                        "Hi Alex, I apologize for the frustration with your annual renewal payment. I have reviewed our Stripe logs..."
                      </p>
                      <button className="mt-2 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                        ✓ 1-Click Insert to Reply Box
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Demonstrated SaaS Platform Benchmarks
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-3xl sm:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">10K+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-2">
                Tickets Processed
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-3xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">72%</p>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-2">
                Faster Resolution
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-3xl sm:text-5xl font-extrabold text-purple-600 dark:text-purple-400">94%</p>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-2">
                AI Classification Accuracy
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-3xl sm:text-5xl font-extrabold text-pink-600 dark:text-pink-400">24/7</p>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-2">
                AI Assistance & SLAs
              </p>
            </div>
          </div>
          <p className="text-center text-[11px] text-slate-400 mt-4">
            * Benchmark metrics simulated for platform performance demonstration.
          </p>
        </div>
      </section>

      {/* AI-Powered Workflow Section */}
      <section id="ai-workflow" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Intelligent Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              The AI-Powered Support Lifecycle
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4">
              See how ResolveAI converts chaotic customer inquiries into structured, high-resolution actions in seconds.
            </p>
          </div>

          {/* Step Pipeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Customer Ticket',
                desc: 'Inquiry received via portal or API with attachments.',
                icon: MessageSquare,
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
              },
              {
                step: '02',
                title: 'Gemini Analysis',
                desc: 'Deep semantic extraction of technical roots.',
                icon: BrainCircuit,
                color: 'text-purple-600 bg-purple-50 dark:bg-purple-950',
              },
              {
                step: '03',
                title: 'Priority & Sentiment',
                desc: 'Detects urgency and emotion: Frustrated, Urgent, Calm.',
                icon: Flame,
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950',
              },
              {
                step: '04',
                title: 'Smart Response',
                desc: 'Tailored multi-paragraph resolution draft generated.',
                icon: Sparkles,
                color: 'text-pink-600 bg-pink-50 dark:bg-pink-950',
              },
              {
                step: '05',
                title: 'Agent Review',
                desc: 'Support engineer reviews and edits with 1-click insert.',
                icon: Users,
                color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950',
              },
              {
                step: '06',
                title: 'Fast Resolution',
                desc: 'Ticket resolved under SLA with CSAT metrics.',
                icon: CheckCircle2,
                color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-500/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-indigo-600">
                      {item.step}
                    </span>
                    <div className={`p-2 rounded-xl ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 lg:py-28 bg-slate-100/60 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Comprehensive Feature Set
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              Everything Your Support Team Needs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card hoverEffect className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">1. AI Ticket Analysis</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically extracts categories (Technical, Payment, Account, Bug), estimates SLA urgency, and parses customer sentiment instantly upon ticket receipt.
              </p>
            </Card>

            <Card hoverEffect className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950 text-pink-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">2. Smart Response Generation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gemini AI drafts empathetic, step-by-step resolution responses tailored to the specific customer and issue context, inserted with a single click.
              </p>
            </Card>

            <Card hoverEffect className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">3. Ticket Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Full-featured ticket lifecycle with search, multifaceted filtering by status and priority, agent assignment, and SLA deadline tracking.
              </p>
            </Card>

            <Card hoverEffect className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">4. Support Analytics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Real-time Recharts dashboards visualizing ticket volume trends, category distribution, SLA compliance rates, and agent resolution metrics.
              </p>
            </Card>

            <Card hoverEffect className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">5. Customer Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Holistic 360-degree customer profiles with historic ticket logs, satisfaction scores, contact information, and account status indicators.
              </p>
            </Card>

            <Card hoverEffect className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">6. Team Collaboration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Role-based access controls (Customer, Agent, Admin), internal agent private notes, workload balance trackers, and team performance boards.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              Plans Built For Fast-Growing Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Starter</h3>
                <p className="text-xs text-slate-500 mt-1">For early-stage startups and MVPs</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">$29</span>
                  <span className="text-xs text-slate-500">/ agent / month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 500 tickets/mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Standard AI classification</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic analytics dashboard</li>
                </ul>
              </div>
              <Link to="/register" className="mt-8">
                <Button variant="outline" className="w-full">Start Free Trial</Button>
              </Link>
            </Card>

            {/* Pro - Highlighted */}
            <Card className="p-8 border-2 border-indigo-500 dark:border-indigo-500 relative flex flex-col justify-between shadow-xl bg-indigo-50/20 dark:bg-indigo-950/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Professional</h3>
                <p className="text-xs text-slate-500 mt-1">For scaling support organizations</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">$79</span>
                  <span className="text-xs text-slate-500">/ agent / month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited support tickets</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Gemini AI Response Generator</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> ResolveAI Copilot Assistant</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> SLA tracking & notifications</li>
                </ul>
              </div>
              <Link to="/register" className="mt-8">
                <Button variant="ai" className="w-full">Get Started Free</Button>
              </Link>
            </Card>

            {/* Enterprise */}
            <Card className="p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Enterprise</h3>
                <p className="text-xs text-slate-500 mt-1">Custom models and dedicated SLA</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">$199</span>
                  <span className="text-xs text-slate-500">/ agent / month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dedicated Gemini fine-tuning</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> HIPAA & SOC 2 BAA compliance</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 99.99% uptime guarantee</li>
                </ul>
              </div>
              <Link to="/register" className="mt-8">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">ResolveAI Platform</span>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 ResolveAI Technologies Inc. Production Full-Stack Portfolio Application.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#ai-workflow" className="hover:text-indigo-600">AI Workflow</a>
            <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
