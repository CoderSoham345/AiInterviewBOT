import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  Mic,
  Sliders,
  Database,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { ExperienceLevel, InterviewType, UserSettings } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
  onClearHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings, onClearHistory }) => {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const rolesList: InterviewType[] = [
    'Frontend',
    'Backend',
    'Full Stack',
    'AI Interview',
    'Machine Learning',
    'Data Science',
    'System Design',
    'HR Interview',
    'Coding Interview',
    'Behavioural Interview',
    'DevOps',
    'Cloud',
    'Cyber Security',
    'Embedded Systems',
  ];

  const levelsList: ExperienceLevel[] = ['Intern', 'Fresher', 'Junior', 'Mid-Level', 'Senior'];

  const handleSave = () => {
    try {
      localStorage.setItem('interview_coach_settings', JSON.stringify(settings));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-cyan-400" />
          Application Settings & Defaults
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize your default mock session settings, voice feedback preferences, and browser data storage.
        </p>
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* Default Target Role */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-400" />
            Default Target Role Mode
          </h3>
          <select
            value={settings.defaultRole}
            onChange={(e) => setSettings({ ...settings, defaultRole: e.target.value as InterviewType })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            {rolesList.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Default Experience Level */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h3 className="text-xs font-bold text-white">Default Candidate Experience Level</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {levelsList.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSettings({ ...settings, defaultLevel: lvl })}
                className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                  settings.defaultLevel === lvl
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Preferences */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-violet-400" />
            Speech & Audio Controls
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-cyan-400" />
                <div>
                  <span className="text-xs font-bold text-white block">AI Voice Interviewer (TTS)</span>
                  <span className="text-[10px] text-slate-400">
                    Automatically read interview questions aloud using Web Speech API
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableVoiceInterviewer}
                onChange={(e) => setSettings({ ...settings, enableVoiceInterviewer: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <Mic className="h-4 w-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Speech-to-Text Voice Input</span>
                  <span className="text-[10px] text-slate-400">
                    Enable candidate microphone recording to speak answers directly
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableVoiceInput}
                onChange={(e) => setSettings({ ...settings, enableVoiceInput: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
            </label>
          </div>
        </div>

        {/* Data Reset */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 space-y-3">
          <h3 className="text-xs font-bold text-rose-400 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Management
          </h3>
          <p className="text-xs text-slate-400">
            Clear all saved interview attempt logs and scorecards stored in your browser storage.
          </p>

          <button
            onClick={onClearHistory}
            className="flex items-center gap-2 rounded-xl bg-rose-500/20 border border-rose-500/40 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Local History</span>
          </button>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>

          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-400 animate-in fade-in">
              Preferences Saved Successfully!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
