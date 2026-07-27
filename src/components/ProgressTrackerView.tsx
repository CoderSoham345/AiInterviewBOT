import React from 'react';
import {
  TrendingUp,
  Award,
  Zap,
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  ArrowUpRight,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { InterviewReport, NavigationTab } from '../types';

interface ProgressTrackerViewProps {
  history: InterviewReport[];
  setActiveTab: (tab: NavigationTab) => void;
  onSelectReport: (report: InterviewReport) => void;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({
  history,
  setActiveTab,
  onSelectReport,
}) => {
  const totalInterviews = history.length;

  const avgOverall = totalInterviews > 0
    ? Math.round(history.reduce((a, c) => a + c.overallScore, 0) / totalInterviews)
    : 0;

  const bestPerformance = totalInterviews > 0
    ? Math.max(...history.map((h) => h.overallScore))
    : 0;

  const trendData = React.useMemo(() => {
    return history
      .slice()
      .reverse()
      .map((item, idx) => ({
        name: `Session ${idx + 1}`,
        date: new Date(item.timestamp).toLocaleDateString(),
        overall: item.overallScore,
        technical: item.technicalScore,
        confidence: item.confidenceScore,
        role: item.role,
      }));
  }, [history]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Interview Performance & Skill Trajectory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your score growth, identify persistent weakness trends, and monitor mock attempt logs.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('mock-interview')}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/20"
        >
          <PlayCircle className="h-4 w-4" />
          <span>New Mock Session</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Mock Sessions</span>
          <span className="block text-3xl font-black text-white">{totalInterviews}</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Average Overall Score</span>
          <span className="block text-3xl font-black text-cyan-400">{avgOverall}%</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Best Performance</span>
          <span className="block text-3xl font-black text-emerald-400">{bestPerformance}%</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Hiring Probability</span>
          <span className="block text-2xl font-black text-violet-400">
            {avgOverall >= 80 ? 'High (85%+)' : avgOverall >= 65 ? 'Moderate' : 'Developing'}
          </span>
        </div>
      </div>

      {/* Trajectory Area Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Score Trajectory Over Time</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Overall vs Technical Score</span>
        </div>

        {totalInterviews > 0 ? (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOverallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTechGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="overall" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorOverallGrad)" name="Overall Score" />
                <Area type="monotone" dataKey="technical" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTechGrad)" name="Technical Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 text-xs">
            Complete your first mock interview to populate your progress timeline.
          </div>
        )}
      </div>

      {/* Attempt History Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="h-4 w-4 text-cyan-400" />
          Mock Session History Logs
        </h2>

        {totalInterviews > 0 ? (
          <div className="space-y-3">
            {history.map((rep) => (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep)}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{rep.role}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-cyan-300 font-mono">
                      {rep.interviewType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {new Date(rep.timestamp).toLocaleDateString()} • {rep.experienceLevel} • {rep.evaluations?.length || 0} Questions
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-black text-cyan-400">{rep.overallScore}%</span>
                    <span className="block text-[10px] text-slate-400">{rep.hiringRecommendation}</span>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">No historical logs available.</p>
        )}
      </div>
    </div>
  );
};
