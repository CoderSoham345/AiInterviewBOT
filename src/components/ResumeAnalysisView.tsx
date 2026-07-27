import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bot,
  Award,
  ShieldCheck,
  Zap,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { ResumeData, NavigationTab } from '../types';

interface ResumeAnalysisViewProps {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const ResumeAnalysisView: React.FC<ResumeAnalysisViewProps> = ({
  resumeData,
  setResumeData,
  setActiveTab,
}) => {
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // File Upload Handler
  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || '';

        const res = await fetch('/api/resume/full-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64,
            fileName: file.name,
            mimeType: file.type,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to analyze resume');

        setResumeData(data);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(err.message || 'Error processing file.');
      setIsAnalyzing(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!pastedText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/resume/full-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: pastedText,
          fileName: 'Pasted_Resume.txt',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze text');

      setResumeData(data);
      setIsAnalyzing(false);
    } catch (err: any) {
      alert(err.message || 'Error parsing text.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">AI Resume Analysis & Skill Audit</h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload your resume (PDF/DOCX/TXT) for deep AI skill extraction, weakness identification, and ATS score generation.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            dragActive
              ? 'border-cyan-400 bg-cyan-500/10'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/30">
            <Upload className="h-6 w-6" />
          </div>

          <h3 className="text-sm font-bold text-white mb-1">Drag & Drop Resume File</h3>
          <p className="text-xs text-slate-400 mb-4">Supports PDF, DOCX, TXT (Max 10MB)</p>

          <label className="cursor-pointer rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors">
            Browse File
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
          </label>
        </div>

        {/* Paste Raw Text Option */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            Or Paste Resume Content
          </h3>
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your resume work experience, projects, and skills text here..."
            className="w-full flex-1 min-h-[120px] rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none resize-none font-mono"
          />
          <button
            onClick={handleTextSubmit}
            disabled={!pastedText.trim() || isAnalyzing}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 py-2.5 text-xs font-bold text-cyan-300 hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {isAnalyzing ? 'Auditing Resume...' : 'Analyze Pasted Text'}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/80 rounded-2xl border border-slate-800 text-center space-y-3">
          <Bot className="h-8 w-8 text-cyan-400 animate-bounce" />
          <h3 className="text-sm font-bold text-white">Gemini 3.6 Flash Auditing Resume...</h3>
          <p className="text-xs text-slate-400">Extracting technical stack, experience timeline, and skill gaps.</p>
        </div>
      )}

      {/* Audit Analysis Results Display */}
      {resumeData && !isAnalyzing && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <span className="text-xs text-slate-400">Resume Quality Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-cyan-400">{resumeData.resumeScore || 85}%</span>
                <span className="text-[10px] text-emerald-400 font-bold">Good</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <span className="text-xs text-slate-400">ATS Readability</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-400">{resumeData.atsScore || 78}%</span>
                <span className="text-[10px] text-slate-400">Formatted</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <span className="text-xs text-slate-400">Experience Years</span>
              <span className="block text-2xl font-black text-white">{resumeData.experienceYears || '3+ Years'}</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
              <span className="text-xs text-slate-400">Top Skills Found</span>
              <span className="block text-2xl font-black text-violet-400">{resumeData.topSkills?.length || 0}</span>
            </div>
          </div>

          {/* Detailed Skill Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths & Extracted Skills */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Key Competencies & Strengths
              </h3>

              <div className="flex flex-wrap gap-2">
                {resumeData.topSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 text-xs font-semibold text-cyan-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {resumeData.strengths && resumeData.strengths.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-300">Resume Strengths:</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {resumeData.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Missing Skills & Recommended Improvements */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Missing Skills & Recommendations
              </h3>

              {resumeData.missingSkills && resumeData.missingSkills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400">Missing Industry Keywords:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.missingSkills.map((ms, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[11px] font-bold text-rose-300"
                      >
                        + {ms}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.recommendedImprovements && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-300">Actionable Enhancements:</span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {resumeData.recommendedImprovements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900 p-5">
            <div>
              <h4 className="text-sm font-bold text-white">Resume Audited Successfully!</h4>
              <p className="text-xs text-slate-300">
                You can now run a targeted ATS Check against a job description or launch a mock interview.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('ats-checker')}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                Run ATS Job Match
              </button>
              <button
                onClick={() => setActiveTab('mock-interview')}
                className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
              >
                Start Interview with Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
