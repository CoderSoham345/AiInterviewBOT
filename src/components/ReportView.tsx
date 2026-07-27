import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Download,
  Sparkles,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { InterviewReport } from '../types';
import { ScoreGauge } from './ScoreGauge';

interface ReportViewProps {
  report: InterviewReport;
  onNewInterview: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onNewInterview }) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const getHiringBadge = (recommendation?: string, overall?: number) => {
    const rec = recommendation || (overall && overall >= 80 ? 'Strong Hire' : 'Needs Preparation');
    if (rec.includes('Strong')) return { label: 'Strong Hire (Top 5%)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (rec.includes('Hire')) return { label: 'Hire (Solid Candidate)', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    if (rec.includes('Leaning')) return { label: 'Leaning Hire', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Needs Preparation', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const badge = getHiringBadge(report.hiringRecommendation, report.overallScore);

  const handleCopyReport = () => {
    const text = `AI INTERVIEW REPORT - ${report.role} (${report.experienceLevel})
Overall Score: ${report.overallScore}/100
Technical: ${report.technicalScore}/100 | Confidence: ${report.confidenceScore}/100 | Communication: ${report.communicationScore}/100

EXECUTIVE SUMMARY:
${report.executiveSummary}

KEY STRENGTHS:
${report.strengths?.map((s) => `• ${s}`).join('\n')}

WEAKNESSES / SKILL GAPS:
${report.weaknesses?.map((w) => `• ${w}`).join('\n')}

NEXT PREPARATION PLAN:
${report.nextPrepPlan}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = `# AI Interview Performance Scorecard
**Role**: ${report.role} (${report.experienceLevel})
**Date**: ${new Date(report.timestamp).toLocaleDateString()}
**Hiring Verdict**: ${report.hiringRecommendation}

---

## 📊 Core Performance Metrics
- **Overall Score**: ${report.overallScore}/100
- **Technical Accuracy**: ${report.technicalScore}/100
- **Confidence**: ${report.confidenceScore}/100
- **Communication Flow**: ${report.communicationScore}/100
- **Problem Solving**: ${report.problemSolvingScore}/100
- **Behavioural Fit**: ${report.behaviouralScore}/100

---

## 📝 Executive Summary
${report.executiveSummary}

---

## ✅ Key Strengths
${report.strengths?.map((s) => `- ${s}`).join('\n')}

---

## ⚠️ Areas for Growth & Weaknesses
${report.weaknesses?.map((w) => `- ${w}`).join('\n')}

---

## 🗺️ 4-Phase Improvement Roadmap
${report.improvementRoadmap?.map((r) => `### ${r.phase}: ${r.title}\n${r.action}`).join('\n\n')}

---

## 🎓 Recommended Courses & Projects
${report.recommendedCourses?.map((c) => `- [${c.name}](${c.url}) by ${c.provider}`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview_Scorecard_${report.role.replace(/\s+/g, '_')}.md`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner & Hiring Recommendation */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-5 w-5 text-cyan-400" />
              <h1 className="text-xl sm:text-2xl font-black text-white">Bar Raiser Performance Scorecard</h1>
            </div>
            <p className="text-xs text-slate-400">
              Target Role: <strong className="text-white">{report.role}</strong> ({report.experienceLevel}) • Interview Type: {report.interviewType}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3.5 py-1 text-xs font-bold ${badge.color}`}>
              {badge.label}
            </span>

            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Markdown</span>
            </button>
          </div>
        </div>

        {/* Executive Bar Raiser Summary */}
        <div className="rounded-2xl bg-slate-950/80 p-5 border border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Executive Hiring Manager Feedback
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {report.executiveSummary}
          </p>
        </div>

        {/* Core Metric Gauges */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Core Multi-Metric Evaluation
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <ScoreGauge score={report.overallScore} label="Overall Score" size="sm" />
            <ScoreGauge score={report.confidenceScore} label="Confidence" size="sm" />
            <ScoreGauge score={report.technicalScore} label="Technical" size="sm" />
            <ScoreGauge score={report.communicationScore} label="Communication" size="sm" />
            <ScoreGauge score={report.problemSolvingScore} label="Problem Solving" size="sm" />
            <ScoreGauge score={report.behaviouralScore} label="Behavioural" size="sm" />
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Demonstrated Candidate Strengths
          </h3>
          <ul className="space-y-2 text-xs text-slate-200">
            {report.strengths?.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/80 p-3 rounded-xl border border-emerald-500/10">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-3">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Primary Skill Gaps & Weaknesses
          </h3>
          <ul className="space-y-2 text-xs text-slate-200">
            {report.weaknesses?.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/80 p-3 rounded-xl border border-rose-500/10">
                <span className="text-rose-400 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4-Phase Personalized Improvement Roadmap */}
      {report.improvementRoadmap && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Personalized Weekly Improvement Roadmap</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {report.improvementRoadmap.map((step, idx) => (
              <div key={idx} className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">{step.phase}</span>
                  <h4 className="text-xs font-bold text-white mt-1 mb-1.5">{step.title}</h4>
                  <p className="text-xs text-slate-300 leading-snug">{step.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Courses & Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recommended Courses */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            Recommended Courses & Mastery Modules
          </h3>
          <div className="space-y-2 text-xs">
            {report.recommendedCourses?.map((course, idx) => (
              <a
                key={idx}
                href={course.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors text-slate-200"
              >
                <div>
                  <h4 className="font-bold text-white">{course.name}</h4>
                  <span className="text-[10px] text-slate-400">Provider: {course.provider}</span>
                </div>
                <ExternalLink className="h-4 w-4 text-cyan-400 shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Practice Projects */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            Portfolio Projects to Build
          </h3>
          <div className="space-y-2 text-xs">
            {report.recommendedProjects?.map((proj, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <h4 className="font-bold text-white">{proj.title}</h4>
                <p className="text-[11px] text-slate-300 leading-snug">{proj.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.tech?.map((t, i) => (
                    <span key={i} className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-cyan-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Evaluations List */}
      {report.evaluations && report.evaluations.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">Question Answer Evaluations ({report.evaluations.length})</h3>

          {report.evaluations.map((evalItem, idx) => {
            const isOpen = expandedQuestion === idx;
            return (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                <button
                  onClick={() => setExpandedQuestion(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-xs border border-cyan-500/30">
                      Q{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-white line-clamp-1">{evalItem.questionText}</h4>
                      <span className="text-[10px] text-slate-400">Score: {evalItem.overallScore}/100</span>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="p-4 border-t border-slate-800 text-xs text-slate-300 space-y-3 bg-slate-950/90">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 block mb-1">Your Response:</span>
                      <p className="italic text-slate-200">"{evalItem.userAnswer}"</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <strong className="text-emerald-400">Praise / Good Points:</strong>
                        <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                          {evalItem.whatWasGood?.map((g, i) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong className="text-amber-400">Missing Technical Nuances:</strong>
                        <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                          {evalItem.whatWasMissing?.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] font-bold text-cyan-400 block mb-1">Benchmark Model Answer:</span>
                      <p className="whitespace-pre-line text-slate-300 leading-relaxed">{evalItem.idealAnswer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onNewInterview}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-8 py-3.5 text-xs font-bold text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Start Next Practice Session</span>
        </button>
      </div>
    </div>
  );
};
