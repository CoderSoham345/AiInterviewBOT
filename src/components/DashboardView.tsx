import React from 'react';
import {
  Award,
  Zap,
  MessageSquare,
  Code,
  Brain,
  Users,
  TrendingUp,
  PlayCircle,
  FileText,
  BarChart3,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { InterviewReport, NavigationTab } from '../types';

interface DashboardViewProps {
  history: InterviewReport[];
  setActiveTab: (tab: NavigationTab) => void;
  onSelectReport: (report: InterviewReport) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ history, setActiveTab, onSelectReport }) => {
  const latestReport = history.length > 0 ? history[0] : null;

  // Calculate averages across history
  const avgScores = React.useMemo(() => {
    if (history.length === 0) {
      return { overall: 78, confidence: 82, technical: 75, communication: 80, problemSolving: 76, behavioural: 85 };
    }
    const total = history.length;
    return {
      overall: Math.round(history.reduce((a, c) => a + c.overallScore, 0) / total),
      confidence: Math.round(history.reduce((a, c) => a + c.confidenceScore, 0) / total),
      technical: Math.round(history.reduce((a, c) => a + c.technicalScore, 0) / total),
      communication: Math.round(history.reduce((a, c) => a + c.communicationScore, 0) / total),
      problemSolving: Math.round(history.reduce((a, c) => a + c.problemSolvingScore, 0) / total),
      behavioural: Math.round(history.reduce((a, c) => a + c.behaviouralScore, 0) / total),
    };
  }, [history]);

  // Recharts history data
  const chartData = React.useMemo(() => {
    if (history.length === 0) {
      return [
        { name: 'Session 1', overall: 65, technical: 60, confidence: 70 },
        { name: 'Session 2', overall: 72, technical: 70, confidence: 75 },
        { name: 'Session 3', overall: 80, technical: 78, confidence: 82 },
        { name: 'Session 4', overall: 88, technical: 85, confidence: 88 },
      ];
    }
    return history
      .slice()
      .reverse()
      .map((item, idx) => ({
        name: `Session ${idx + 1}`,
        overall: item.overallScore,
        technical: item.technicalScore,
        confidence: item.confidenceScore,
        role: item.role,
      }));
  }, [history]);

  // Circular gauge component
  const CircularScore = ({ score, title, icon, colorClass }: { score: number; title: string; icon: React.ReactNode; colorClass: string }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">{title}</span>
          <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">{icon}</div>
        </div>

        <div className="my-3 flex items-center justify-between">
          <div className="relative flex items-center justify-center">
            <svg className="h-16 w-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${colorClass}`}
                fill="transparent"
              />
            </svg>
            <span className="absolute text-sm font-black text-white">{score}%</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Benchmark</span>
            <p className="text-xs font-semibold text-cyan-400">
              {score >= 80 ? 'Top 10%' : score >= 65 ? 'Competitive' : 'Needs Practice'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Candidate Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics, interview progress metrics, and skill breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('mock-interview')}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Launch Mock Interview</span>
          </button>
          <button
            onClick={() => setActiveTab('resume-analysis')}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
          >
            <FileText className="h-4 w-4 text-cyan-400" />
            <span>Audit Resume</span>
          </button>
        </div>
      </div>

      {/* 6 Metric Circular Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <CircularScore score={avgScores.overall} title="Overall Score" icon={<Award className="h-4 w-4 text-cyan-400" />} colorClass="text-cyan-400" />
        <CircularScore score={avgScores.confidence} title="Confidence Score" icon={<Zap className="h-4 w-4 text-amber-400" />} colorClass="text-amber-400" />
        <CircularScore score={avgScores.technical} title="Technical Score" icon={<Code className="h-4 w-4 text-blue-400" />} colorClass="text-blue-400" />
        <CircularScore score={avgScores.communication} title="Communication" icon={<MessageSquare className="h-4 w-4 text-emerald-400" />} colorClass="text-emerald-400" />
        <CircularScore score={avgScores.problemSolving} title="Problem Solving" icon={<Brain className="h-4 w-4 text-violet-400" />} colorClass="text-violet-400" />
        <CircularScore score={avgScores.behavioural} title="Behavioural Fit" icon={<Users className="h-4 w-4 text-rose-400" />} colorClass="text-rose-400" />
      </div>

      {/* Middle Row: Progress Chart + Latest Session Quick Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Score Growth Timeline</h2>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 font-mono">
              {history.length} Attempt{history.length === 1 ? '' : 's'} Recorded
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="overall" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorOverall)" name="Overall Score" />
                <Area type="monotone" dataKey="technical" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTech)" name="Technical Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Report Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300">Latest Mock Session</span>
              {latestReport && (
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  {latestReport.hiringRecommendation}
                </span>
              )}
            </div>

            {latestReport ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">{latestReport.role}</h3>
                    <p className="text-[10px] text-slate-400">{latestReport.interviewType} • {latestReport.experienceLevel}</p>
                  </div>
                  <span className="text-xl font-black text-cyan-400">{latestReport.overallScore}%</span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  "{latestReport.executiveSummary}"
                </p>

                {/* Top Weakness Highlight */}
                {latestReport.weaknesses?.[0] && (
                  <div className="flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-xs text-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Focus Area: {latestReport.weaknesses[0]}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <BarChart3 className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No mock sessions completed yet.</p>
              </div>
            )}
          </div>

          {latestReport ? (
            <button
              onClick={() => onSelectReport(latestReport)}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-cyan-300 hover:bg-slate-700 transition-colors"
            >
              <span>View Full Report</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('mock-interview')}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              <span>Take First Mock Interview</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Grid: Recent History & Skill Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong vs Weak Skills */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Skill Competency Matrix
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Proven Strengths
              </span>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {latestReport?.strengths?.slice(0, 4).map((s, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    {s}
                  </li>
                )) || (
                  <>
                    <li>• Modular Architecture</li>
                    <li>• Clear Communication</li>
                    <li>• Analytical Thinking</li>
                  </>
                )}
              </ul>
            </div>

            <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-rose-400 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> High Priority Gaps
              </span>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {latestReport?.weaknesses?.slice(0, 4).map((w, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                    {w}
                  </li>
                )) || (
                  <>
                    <li>• Edge Case Handling</li>
                    <li>• Time Complexity Bounds</li>
                    <li>• System Trade-off Depth</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Question Bank Callout */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-violet-400" />
              Practice Question Bank
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore 50+ curated interview questions spanning System Design, Frontend, RAG AI, Postgres Optimization, and STAR Behavioural techniques.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('question-bank')}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
          >
            <span>Browse Question Bank</span>
            <ArrowUpRight className="h-4 w-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
