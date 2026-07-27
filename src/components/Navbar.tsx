import React from 'react';
import { Bot, FileText, PlayCircle, BarChart2, History, Sparkles } from 'lucide-react';
import { InterviewRole, ExperienceLevel } from '../types';

interface NavbarProps {
  activeTab: 'setup' | 'interview' | 'report' | 'history';
  setActiveTab: (tab: 'setup' | 'interview' | 'report' | 'history') => void;
  currentRole?: InterviewRole;
  customRoleName?: string;
  experienceLevel?: ExperienceLevel;
  hasActiveInterview?: boolean;
  hasReport?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  customRoleName,
  experienceLevel,
  hasActiveInterview,
  hasReport,
}) => {
  const displayRole = currentRole === 'Custom' ? customRoleName || 'Custom Role' : currentRole;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('setup')}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">AI Interview</span>
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Intelligent Mock Interviews & Real-time Scoring</p>
          </div>
        </div>

        {/* Current Role Badge (if selected) */}
        {displayRole && (
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Target Role: <strong className="text-white">{displayRole}</strong> ({experienceLevel || 'Mid-Level'})</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-setup-btn"
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'setup'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Setup & Role</span>
          </button>

          <button
            id="nav-interview-btn"
            disabled={!hasActiveInterview}
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              !hasActiveInterview
                ? 'opacity-40 cursor-not-allowed text-slate-600'
                : activeTab === 'interview'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <PlayCircle className="h-4 w-4" />
            <span>Mock Interview</span>
            {hasActiveInterview && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            )}
          </button>

          <button
            id="nav-report-btn"
            disabled={!hasReport}
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              !hasReport
                ? 'opacity-40 cursor-not-allowed text-slate-600'
                : activeTab === 'report'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Scorecard</span>
          </button>

          <button
            id="nav-history-btn"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
