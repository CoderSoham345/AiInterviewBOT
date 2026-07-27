import React from 'react';
import { History, Calendar, Trash2, Award, ChevronRight, FileText, Bot } from 'lucide-react';
import { InterviewReport } from '../types';

interface HistoryViewProps {
  history: InterviewReport[];
  onSelectReport: (report: InterviewReport) => void;
  onClearHistory: () => void;
  onDeleteReport: (id: string) => void;
  onNewInterview: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectReport,
  onClearHistory,
  onDeleteReport,
  onNewInterview,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 65) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center backdrop-blur-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-cyan-400 mb-4 shadow-inner">
          <History className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Practice History Yet</h3>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          Complete mock interviews to track your score progression over time and revisit detailed feedback.
        </p>
        <button
          onClick={onNewInterview}
          className="mt-5 flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Bot className="h-4 w-4" />
          <span>Start First Mock Interview</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="h-5 w-5 text-cyan-400" />
            Interview History & Score Logs
          </h2>
          <p className="text-xs text-slate-400">Review past mock interviews and monitor score growth over time</p>
        </div>

        <button
          onClick={onClearHistory}
          className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear All History</span>
        </button>
      </div>

      <div className="space-y-3">
        {history.map((rep) => {
          const scoreClass = getScoreColor(rep.overallScore);
          return (
            <div
              key={rep.id}
              onClick={() => onSelectReport(rep)}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-all hover:border-cyan-500/50 hover:bg-slate-900 cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border ${scoreClass}`}>
                  <span className="text-base font-black leading-none">{rep.overallScore}</span>
                  <span className="text-[9px] uppercase font-bold opacity-80 mt-0.5">Score</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {rep.role}
                    </h3>
                    <span className="rounded bg-slate-800 text-[10px] text-slate-300 px-2 py-0.5 border border-slate-700">
                      {rep.experienceLevel}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      {formatDate(rep.timestamp)}
                    </span>
                    <span>•</span>
                    <span>{rep.questionsCount} Questions</span>
                    {rep.resumeFileName && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400 truncate max-w-[150px]">
                          <FileText className="h-3 w-3 text-cyan-400" />
                          {rep.resumeFileName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteReport(rep.id);
                  }}
                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                  title="Delete Session"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>View Report</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
