import React from 'react';
import { Layout, Cpu, BarChart3, Code2, Wrench, Sparkles, Layers, ShieldCheck, Play, UserCheck } from 'lucide-react';
import { InterviewRole, ExperienceLevel, InterviewMode } from '../types';
import { PRESET_ROLES } from '../data/rolesData';

interface RoleSelectorProps {
  role: InterviewRole;
  setRole: (role: InterviewRole) => void;
  customRoleName: string;
  setCustomRoleName: (name: string) => void;
  experienceLevel: ExperienceLevel;
  setExperienceLevel: (level: ExperienceLevel) => void;
  interviewMode: InterviewMode;
  setInterviewMode: (mode: InterviewMode) => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
  onStartInterview: () => void;
  isGenerating: boolean;
  hasResume: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  role,
  setRole,
  customRoleName,
  setCustomRoleName,
  experienceLevel,
  setExperienceLevel,
  interviewMode,
  setInterviewMode,
  questionCount,
  setQuestionCount,
  onStartInterview,
  isGenerating,
  hasResume,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="h-5 w-5" />;
      case 'Cpu':
        return <Cpu className="h-5 w-5" />;
      case 'BarChart3':
        return <BarChart3 className="h-5 w-5" />;
      case 'Code2':
        return <Code2 className="h-5 w-5" />;
      default:
        return <Wrench className="h-5 w-5" />;
    }
  };

  const experienceOptions: ExperienceLevel[] = [
    'Junior (0-2 yrs)',
    'Mid-Level (3-5 yrs)',
    'Senior (5+ yrs)',
    'Staff / Lead',
  ];

  const modeOptions: InterviewMode[] = [
    'Mixed',
    'Technical Deep-Dive',
    'Behavioral (STAR)',
    'System Design',
  ];

  return (
    <div className="space-y-6">
      {/* Target Role Selector Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            1. Select Interview Target Role
          </label>
          <span className="text-xs text-slate-400">Choose a preset or type custom</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_ROLES.map((preset) => {
            const isSelected = role === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => setRole(preset.id)}
                className={`group relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${preset.color} text-white shadow-md`}
                    >
                      {getIcon(preset.iconName)}
                    </div>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-slate-950">
                        <UserCheck className="h-3 w-3 font-bold" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-snug">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1">
                  {preset.techStack.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-[10px] bg-slate-950/80 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Role Option */}
        <div className="mt-3">
          <button
            onClick={() => setRole('Custom')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-xs font-medium ${
              role === 'Custom'
                ? 'border-cyan-500 bg-cyan-950/20 text-white'
                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-cyan-400" />
              <span>Or specify a Custom Engineering Role / Specialization...</span>
            </div>
            <span className="text-[11px] text-cyan-400 underline">Custom Title</span>
          </button>

          {role === 'Custom' && (
            <div className="mt-2.5">
              <input
                type="text"
                value={customRoleName}
                onChange={(e) => setCustomRoleName(e.target.value)}
                placeholder="e.g., DevOps Architect, Fullstack Next.js Engineer, Mobile iOS Specialist..."
                className="w-full rounded-xl border border-cyan-500/60 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Experience Level & Interview Focus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Experience Level */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <label className="text-xs font-bold text-white block mb-2.5 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            2. Experience Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {experienceOptions.map((level) => (
              <button
                key={level}
                onClick={() => setExperienceLevel(level)}
                className={`py-2 px-2.5 text-xs font-medium rounded-lg border transition-all ${
                  experienceLevel === level
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 font-semibold shadow-sm'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Interview Focus Mode */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <label className="text-xs font-bold text-white block mb-2.5 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            3. Interview Focus & Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {modeOptions.map((mode) => (
              <button
                key={mode}
                onClick={() => setInterviewMode(mode)}
                className={`py-2 px-2.5 text-xs font-medium rounded-lg border transition-all ${
                  interviewMode === mode
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 font-semibold shadow-sm'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Session Length & Start Action */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-300 whitespace-nowrap">Session Questions:</span>
          <div className="flex gap-1.5">
            {[3, 5, 7].map((num) => (
              <button
                key={num}
                onClick={() => setQuestionCount(num)}
                className={`h-8 w-10 rounded-lg text-xs font-bold transition-all ${
                  questionCount === num
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {num} Qs
              </button>
            ))}
          </div>
          {hasResume && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Sparkles className="h-3 w-3" /> Resume-Tailored
            </span>
          )}
        </div>

        <button
          id="start-mock-interview-btn"
          disabled={isGenerating || (role === 'Custom' && !customRoleName.trim())}
          onClick={onStartInterview}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Generating Custom Interview Session...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              <span>Start Mock Interview</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
