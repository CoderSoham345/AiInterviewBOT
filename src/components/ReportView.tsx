import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, BookOpen, Download, Share2, RefreshCw, ChevronDown, ChevronUp, Sparkles, FileText, Check, Copy } from 'lucide-react';
import { InterviewReport } from '../types';
import { ScoreGauge } from './ScoreGauge';

interface ReportViewProps {
  report: InterviewReport;
  onNewInterview: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onNewInterview }) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const getHiringVerdict = (overall: number) => {
    if (overall >= 85) return { label: 'Strong Hire (Top 5%)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (overall >= 72) return { label: 'Hire (Solid Competency)', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    if (overall >= 60) return { label: 'Leaning Hire (Needs Practice)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Needs Preparation', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
  };

  const verdict = getHiringVerdict(report.overallScore);

  const handleCopyReport = () => {
    const summaryText = `AI Interview Report - ${report.role} (${report.experienceLevel})
Overall Score: ${report.overallScore}/100
Confidence: ${report.confidenceScore}/100 | Technical: ${report.technicalScore}/100 | Communication: ${report.communicationScore}/100

Executive Summary:
${report.executiveSummary}

Key Strengths:
${report.strengthsSummary.map((s) => `• ${s}`).join('\n')}

Action Plan:
${report.actionPlan.map((a) => `• [${a.topic}]: ${a.description}`).join('\n')}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview_Report_${report.role.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner & Verdict */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-5 w-5 text-cyan-400" />
              <h1 className="text-xl font-bold text-white">Interview Performance Scorecard</h1>
            </div>
            <p className="text-xs text-slate-400">
              Role: <strong className="text-white">{report.role}</strong> ({report.experienceLevel}) • Mode: {report.interviewMode || 'General'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-3.5 py-1 text-xs font-bold ${verdict.color}`}>
              Verdict: {verdict.label}
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Executive Bar Raiser Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {report.executiveSummary}
          </p>
        </div>

        {/* 4 Score Gauges Grid */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Core Metrics Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ScoreGauge score={report.overallScore} label="Overall Score" size="md" sublabel="Composite Rating" />
            <ScoreGauge score={report.confidenceScore} label="Confidence Score" size="md" sublabel="Delivery & Precision" />
            <ScoreGauge score={report.technicalScore} label="Technical Score" size="md" sublabel="Accuracy & Knowledge" />
            <ScoreGauge score={report.communicationScore} label="Communication Score" size="md" sublabel="Clarity & Flow" />
          </div>
        </div>
      </div>

      {/* Strengths & Growth Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top Strengths */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4" />
            Key Superpowers & Strengths
          </h3>
          <ul className="space-y-2 text-xs text-slate-200">
            {report.strengthsSummary.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-emerald-500/10">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Weaknesses */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4" />
            Primary Growth Areas & Gaps
          </h3>
          <ul className="space-y-2 text-xs text-slate-200">
            {report.keyWeaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-amber-500/10">
                <span className="text-amber-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tailored Action & Study Plan */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Personalized Action & Improvement Plan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {report.actionPlan.map((action, idx) => (
            <div key={idx} className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Step {idx + 1}</span>
                <h4 className="text-xs font-bold text-white mt-1 mb-1.5">{action.topic}</h4>
                <p className="text-xs text-slate-300 leading-snug">{action.description}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300 font-medium">
                💡 <strong>Exercise:</strong> {action.resourceOrExercise}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Practice Questions */}
      {report.recommendedQuestions && report.recommendedQuestions.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            Recommended Questions for Your Next Mock Session
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.recommendedQuestions.map((q, idx) => (
              <li key={idx} className="flex items-center gap-2 rounded-lg bg-slate-950 p-3 border border-slate-800">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-violet-500/20 text-violet-300 text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Question Evaluations Accordion */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
        <h3 className="text-sm font-bold text-white mb-2">Detailed Question Evaluations ({report.evaluations.length})</h3>

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

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <strong className="text-emerald-400">Strengths:</strong>
                      <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                        {evalItem.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-amber-400">Growth Areas:</strong>
                      <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                        {evalItem.areasToImprove.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-cyan-400 block mb-1">Model Answer:</span>
                    <p className="whitespace-pre-line text-slate-300 leading-relaxed">{evalItem.idealAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onNewInterview}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Start Another Practice Interview</span>
        </button>
      </div>
    </div>
  );
};
