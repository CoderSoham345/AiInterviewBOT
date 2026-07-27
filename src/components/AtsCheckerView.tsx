import React, { useState } from 'react';
import {
  CheckSquare,
  FileText,
  Briefcase,
  Sparkles,
  Bot,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { ResumeData, AtsCheckResult } from '../types';

interface AtsCheckerViewProps {
  resumeData: ResumeData | null;
}

export const AtsCheckerView: React.FC<AtsCheckerViewProps> = ({ resumeData }) => {
  const [resumeText, setResumeText] = useState(resumeData?.text || '');
  const [jobDescription, setJobDescription] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsCheckResult | null>(null);

  const handleRunAtsCheck = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert('Please provide both resume text and target job description.');
      return;
    }

    setIsScanning(true);
    try {
      const res = await fetch('/api/ats/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to scan ATS match');

      setAtsResult(data);
      setIsScanning(false);
    } catch (err: any) {
      alert(err.message || 'Error executing ATS scanner.');
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">ATS Resume & Job Match Checker</h1>
        <p className="text-xs text-slate-400 mt-1">
          Scan your candidate resume against any target Job Description to discover keyword gaps, formatting issues, and compatibility scores.
        </p>
      </div>

      {/* Two Panel Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Candidate Resume */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              Candidate Resume Text
            </h3>
            {resumeData && (
              <span className="text-[10px] text-cyan-400 font-mono">Loaded from uploaded file</span>
            )}
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste candidate resume work history, technical skills, and project experience here..."
            className="w-full flex-1 min-h-[180px] rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none resize-none font-mono"
          />
        </div>

        {/* Panel 2: Target Job Description */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 flex flex-col">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-violet-400" />
            Target Job Description (JD)
          </h3>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job description duties, required technical skills, and candidate requirements here..."
            className="w-full flex-1 min-h-[180px] rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none resize-none font-mono"
          />
        </div>
      </div>

      {/* Scan Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRunAtsCheck}
          disabled={!resumeText.trim() || !jobDescription.trim() || isScanning}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 text-xs font-bold text-white shadow-xl shadow-cyan-500/20 hover:brightness-110 disabled:opacity-50 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isScanning ? 'Running ATS Comparative Audit...' : 'Scan ATS Match & Keyword Gaps'}</span>
        </button>
      </div>

      {/* Loading State */}
      {isScanning && (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/80 rounded-2xl border border-slate-800 text-center space-y-3">
          <Bot className="h-8 w-8 text-cyan-400 animate-bounce" />
          <h3 className="text-sm font-bold text-white">Auditing Resume against Job Requirements...</h3>
          <p className="text-xs text-slate-400">Comparing required technical skills, ATS parser constraints, and formatting rules.</p>
        </div>
      )}

      {/* ATS Results View */}
      {atsResult && !isScanning && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Score Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/50 to-slate-900 p-5 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Overall ATS Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-cyan-400">{atsResult.atsScore}%</span>
                <span className="text-xs font-bold text-cyan-300">
                  {atsResult.atsScore >= 80 ? 'High Match' : atsResult.atsScore >= 60 ? 'Moderate Match' : 'Low Match'}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Formatting Score</span>
              <span className="block text-2xl font-black text-white">{atsResult.formattingScore}%</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Experience Alignment</span>
              <span className="block text-2xl font-black text-emerald-400">{atsResult.experienceMatchScore}%</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Education Match</span>
              <span className="block text-2xl font-black text-violet-400">{atsResult.educationMatchScore}%</span>
            </div>
          </div>

          {/* Keyword Match Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Matched Keywords */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Matched Technical Keywords ({atsResult.matchedKeywords.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {atsResult.matchedKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-300"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <h3 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4" />
                Missing Critical Keywords ({atsResult.missingKeywords.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {atsResult.missingKeywords.map((mkw, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 text-xs font-semibold text-rose-300"
                  >
                    + {mkw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations & Formatting Notes */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Targeted Optimization Recommendations
            </h3>

            <div className="space-y-2">
              {atsResult.improvedResumeRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
