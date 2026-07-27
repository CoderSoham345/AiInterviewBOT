import React from 'react';
import {
  Sparkles,
  Bot,
  PlayCircle,
  FileText,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  MessageSquare,
  HelpCircle,
  Briefcase,
  Code,
  Layers,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface LandingPageProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Senior Frontend Engineer @ TechCorp',
      comment:
        'The real-time confidence and technical score breakdown helped me pinpoint exact communication flaws. Passed my System Design interview on the first try!',
      avatar: 'SJ',
    },
    {
      name: 'Alex Rivera',
      role: 'AI / ML Engineer',
      comment:
        'Parsing my resume and generating tailored questions on RAG architectures and vector databases was uncannily accurate. Essential tool for job seekers.',
      avatar: 'AR',
    },
    {
      name: 'Priya Sharma',
      role: 'Data Analyst Graduate',
      comment:
        'The ATS checker helped me add missing SQL and BigQuery keywords. I went from zero recruiter callbacks to 4 interview invites in 2 weeks!',
      avatar: 'PS',
    },
  ];

  const features = [
    {
      icon: <Bot className="h-6 w-6 text-cyan-400" />,
      title: 'AI Mock Interviews',
      description:
        'Simulate realistic technical, HR, system design, and coding interviews with speech synthesis and voice recognition.',
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-violet-400" />,
      title: '6-Metric Performance Scoring',
      description:
        'Get quantitative ratings on Confidence, Technical Accuracy, Communication, Problem Solving, Behavioural fit, and Overall performance.',
    },
    {
      icon: <FileText className="h-6 w-6 text-emerald-400" />,
      title: 'Deep Resume Analysis',
      description:
        'Extract key skills, project highlights, missing competencies, and generate an instant resume quality score.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-amber-400" />,
      title: 'Job Description ATS Checker',
      description:
        'Compare your resume against any target job description to reveal keyword gaps and ATS compatibility percentage.',
    },
    {
      icon: <Zap className="h-6 w-6 text-cyan-400" />,
      title: 'Instant Answer Feedback',
      description:
        'After every response, view what was good, what was missing, the benchmark model answer, and suggested learning resources.',
    },
    {
      icon: <Layers className="h-6 w-6 text-blue-400" />,
      title: 'Personalized Improvement Roadmap',
      description:
        'Receive a week-by-week learning action plan, recommended courses, and hands-on projects tailored to your weak areas.',
    },
  ];

  const faqs = [
    {
      q: 'How does AI Interview Coach generate questions?',
      a: 'It uses Gemini 3.6 Flash to analyze your target role, experience level, interview mode, and uploaded resume text to synthesize realistic, scenario-based questions.',
    },
    {
      q: 'Can I practice with voice audio instead of typing?',
      a: 'Yes! The app supports both Web Speech synthesis (listen to the interviewer speak) and Web Speech recognition (speak your answer out loud via microphone).',
    },
    {
      q: 'How does the ATS Checker work?',
      a: 'You paste any Job Description alongside your resume text. The AI scans for missing technical keywords, formatting compatibility, and experience alignment.',
    },
    {
      q: 'Are my interview reports saved?',
      a: 'All mock session scorecards and feedback reports are stored locally in your browser storage so you can monitor your score growth over time.',
    },
  ];

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-sm">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>Next-Gen AI Mock Interview Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Practice Realistic Interviews.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-400 bg-clip-text text-transparent">
              Land Your Dream Job.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Practice realistic technical and HR interviews, receive instant AI feedback on confidence and technical depth, improve weak skills, and land top software roles.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="hero-start-interview-btn"
              onClick={() => setActiveTab('mock-interview')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <PlayCircle className="h-5 w-5 fill-white" />
              <span>Start Mock Interview</span>
            </button>

            <button
              id="hero-upload-resume-btn"
              onClick={() => setActiveTab('resume-analysis')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-8 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-md"
            >
              <FileText className="h-5 w-5 text-cyan-400" />
              <span>Upload Resume & Audit</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <span className="text-xl sm:text-2xl font-black text-white">15+</span>
              <span className="block text-[11px] text-slate-400 font-medium">Interview Role Modes</span>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <span className="text-xl sm:text-2xl font-black text-cyan-400">6</span>
              <span className="block text-[11px] text-slate-400 font-medium">Core Score Metrics</span>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">100%</span>
              <span className="block text-[11px] text-slate-400 font-medium">Personalized Feedback</span>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <span className="text-xl sm:text-2xl font-black text-violet-400">ATS</span>
              <span className="block text-[11px] text-slate-400 font-medium">Keyword Gap Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Everything You Need to Ace Tech Interviews</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Comprehensive SaaS suite designed for engineers, data analysts, and tech professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Loved by Engineers & Job Seekers</h2>
          <p className="text-xs text-slate-400 mt-1">Here is what candidates say after practicing with AI Coach.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">"{item.comment}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/40">
                  {item.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <p className="text-[10px] text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
          <HelpCircle className="h-5 w-5 text-cyan-400" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-white">{faq.q}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-violet-950/60 p-8 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">Ready for Your Next Technical Round?</h2>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Start a 10-minute mock interview session right now and get your instant Bar Raiser scorecard.
        </p>
        <button
          onClick={() => setActiveTab('mock-interview')}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
        >
          <span>Launch AI Interview Room</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
