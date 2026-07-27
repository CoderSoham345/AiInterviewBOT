import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, Sparkles, Award } from 'lucide-react';
import { AnswerEvaluation } from '../types';
import { ScoreGauge } from './ScoreGauge';

interface FeedbackCardProps {
  evaluation: AnswerEvaluation;
  questionNumber: number;
  totalQuestions: number;
  onNextQuestion?: () => void;
  isLastQuestion?: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  evaluation,
  questionNumber,
  totalQuestions,
  onNextQuestion,
  isLastQuestion,
}) => {
  const [showIdealAnswer, setShowIdealAnswer] = useState(true);

  const strengthsList = evaluation.whatWasGood || [];
  const missingList = evaluation.whatWasMissing || [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-xs border border-cyan-500/30">
            Q{questionNumber}
          </div>
          <span className="text-xs font-semibold text-slate-300">Instant AI Answer Evaluation</span>
        </div>
        <span className="text-xs font-semibold text-slate-400">Question {questionNumber} of {totalQuestions}</span>
      </div>

      {/* Question & Answer Summary */}
      <div className="space-y-2 rounded-xl bg-slate-950 p-3.5 border border-slate-800/80">
        <p className="text-xs font-semibold text-slate-400">Question:</p>
        <p className="text-sm font-medium text-white">{evaluation.questionText}</p>
        <div className="mt-2 pt-2 border-t border-slate-800/60">
          <p className="text-[11px] font-semibold text-slate-500">Your Response:</p>
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-3 italic">"{evaluation.userAnswer}"</p>
        </div>
      </div>

      {/* 4 Score Gauges Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Award className="h-4 w-4 text-cyan-400" />
          Candidate Performance Breakdown
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <ScoreGauge score={evaluation.confidenceScore} label="Confidence" size="sm" />
          <ScoreGauge score={evaluation.technicalScore} label="Technical" size="sm" />
          <ScoreGauge score={evaluation.communicationScore} label="Communication" size="sm" />
          <ScoreGauge score={evaluation.overallScore} label="Overall Question" size="sm" />
        </div>
      </div>

      {/* Strengths & Improvements Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>What Was Good</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {strengthsList.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span>What Was Missing</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {missingList.map((gap, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Improvement Tip */}
      {evaluation.suggestedImprovement && (
        <div className="flex items-start gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3.5 text-xs text-cyan-200">
          <Lightbulb className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
          <div>
            <span className="font-bold block text-cyan-300 mb-0.5">Suggested Improvement:</span>
            <p className="leading-relaxed">{evaluation.suggestedImprovement}</p>
          </div>
        </div>
      )}

      {/* Ideal Model Answer Accordion */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <button
          onClick={() => setShowIdealAnswer(!showIdealAnswer)}
          className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-200 hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span>Benchmark Model Answer</span>
          </div>
          {showIdealAnswer ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {showIdealAnswer && (
          <div className="p-4 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 leading-relaxed bg-slate-950/90 whitespace-pre-line">
            {evaluation.idealAnswer}
          </div>
        )}
      </div>

      {/* Next Action Button */}
      {onNextQuestion && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onNextQuestion}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-2.5 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            <span>{isLastQuestion ? 'Complete Interview & View Final Scorecard' : 'Proceed to Next Question'}</span>
            <ChevronUp className="h-4 w-4 rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
};
