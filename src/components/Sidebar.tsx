import React from 'react';
import {
  LayoutDashboard,
  PlayCircle,
  FileSearch,
  CheckSquare,
  BookOpen,
  BarChart3,
  TrendingUp,
  Settings,
  Bot,
  Sparkles,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  historyCount,
}) => {
  const menuItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'landing', label: 'Home / Overview', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'mock-interview', label: 'Mock Interview', icon: <PlayCircle className="h-4 w-4" />, badge: 'AI Live' },
    { id: 'resume-analysis', label: 'Resume Analysis', icon: <FileSearch className="h-4 w-4" /> },
    { id: 'ats-checker', label: 'ATS Checker', icon: <CheckSquare className="h-4 w-4" /> },
    { id: 'question-bank', label: 'Question Bank', icon: <BookOpen className="h-4 w-4" />, badge: '50+' },
    { id: 'interview-reports', label: 'Interview Reports', icon: <BarChart3 className="h-4 w-4" />, badge: historyCount ? `${historyCount}` : undefined },
    { id: 'progress-tracker', label: 'Progress Tracker', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur-md">
        <div
          onClick={() => setActiveTab('landing')}
          className="flex cursor-pointer items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="text-base font-bold text-white">AI Interview Coach</span>
            <span className="block text-[10px] text-cyan-400 font-mono">PRO SAAS EDITION</span>
          </div>
        </div>

        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white"
        >
          {isOpenMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Overlay Backdrop for Mobile */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
        ></div>
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/80 bg-slate-950/95 p-4 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div
          onClick={() => {
            setActiveTab('landing');
            setIsOpenMobile(false);
          }}
          className="mb-6 flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 shadow-inner hover:border-cyan-500/40 transition-colors"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Bot className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-white">AI Coach</span>
              <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Smart Mock Interview SaaS</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpenMobile(false);
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Pro Upgrade Banner */}
        <div className="mt-auto rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 to-slate-900 p-3.5 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="font-bold text-white">Gemini 3.6 Flash Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Real-time multi-score feedback & resume ATS evaluation enabled.
          </p>
        </div>
      </aside>
    </>
  );
};
