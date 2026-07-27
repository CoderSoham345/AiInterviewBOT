import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, MicOff, Volume2, VolumeX, Clock, Sparkles, Send, HelpCircle, Loader2, Code, FileCode, CheckCircle } from 'lucide-react';
import { InterviewQuestion, AnswerEvaluation, InterviewRole, ExperienceLevel } from '../types';
import { FeedbackCard } from './FeedbackCard';

interface MockInterviewProps {
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  evaluations: AnswerEvaluation[];
  setEvaluations: React.Dispatch<React.SetStateAction<AnswerEvaluation[]>>;
  role: InterviewRole;
  customRoleName: string;
  experienceLevel: ExperienceLevel;
  resumeText?: string;
  onFinishInterview: () => void;
}

export const MockInterview: React.FC<MockInterviewProps> = ({
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  evaluations,
  setEvaluations,
  role,
  customRoleName,
  experienceLevel,
  resumeText,
  onFinishInterview,
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const currentEvaluation = evaluations.find((e) => e.questionId === currentQuestion?.id);

  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Audio Speech Synthesis state (Interviewer voice)
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Voice Speech Recognition state (Candidate mic input)
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  const displayRole = role === 'Custom' ? customRoleName || 'Custom Role' : role;

  // Question Timer
  useEffect(() => {
    setTimerSeconds(0);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestionIndex]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer((prev) => {
          // Append or merge new speech transcript smoothly
          const trimmedPrev = prev.trim();
          return trimmedPrev ? `${trimmedPrev} ${transcript}` : transcript;
        });
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Could not start speech recognition', err);
      }
    }
  };

  // Text to Speech for Intervuer Question
  const speakQuestion = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (currentQuestion) {
      window.speechSynthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Automatically reset answer state when index changes
  useEffect(() => {
    setUserAnswer('');
    setShowHint(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [currentQuestionIndex]);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;

    // Stop recording/speaking if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          questionText: currentQuestion.question,
          userAnswer: userAnswer.trim(),
          role,
          customRole: customRoleName,
          experienceLevel,
          resumeText,
        }),
      });

      const evalData = await response.json();

      if (!response.ok) {
        throw new Error(evalData.error || 'Evaluation failed');
      }

      setEvaluations((prev) => {
        const filtered = prev.filter((e) => e.questionId !== currentQuestion.id);
        return [...filtered, evalData];
      });

      setIsSubmitting(false);
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      alert(error.message || 'Error evaluating answer. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      onFinishInterview();
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const insertCodeTemplate = () => {
    const codeSnippet = `\n\`\`\`ts\n// Candidate Solution / Logic\nfunction solveProblem() {\n  // Implementation details\n}\n\`\`\`\n`;
    setUserAnswer((prev) => prev + codeSnippet);
  };

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mb-3" />
        <p className="text-sm font-medium">Preparing interview questions...</p>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Progress */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Bot className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{displayRole} Interview</span>
              <span className="rounded bg-slate-800 text-[10px] text-slate-300 px-2 py-0.5 border border-slate-700">
                {experienceLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400">Answer thoroughly to get multi-metric AI scoring & detailed feedback</p>
          </div>
        </div>

        {/* Question Counter & Timer */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800 text-xs font-mono text-cyan-300">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-white block">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-md shadow-2xl space-y-4">
        {/* Category & Concept Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300">
              {currentQuestion.category || 'Technical'}
            </span>
            {currentQuestion.conceptTested && (
              <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs text-slate-300">
                Testing: <strong className="text-white">{currentQuestion.conceptTested}</strong>
              </span>
            )}
          </div>

          {/* Speech Audio Button */}
          <button
            onClick={speakQuestion}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all border ${
              isSpeaking
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-cyan-400" />}
            <span>{isSpeaking ? 'Stop Audio' : 'Listen to Question'}</span>
          </button>
        </div>

        {/* Question Text */}
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/80 shadow-inner">
          <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Collapsible Hint */}
        {currentQuestion.contextHint && (
          <div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
              <span>{showHint ? 'Hide Interviewer Context Hint' : 'Need a hint or clarification?'}</span>
            </button>
            {showHint && (
              <div className="mt-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs text-cyan-200 animate-in fade-in">
                <strong>Interviewer Guidance:</strong> {currentQuestion.contextHint}
              </div>
            )}
          </div>
        )}

        {/* Answer Input Area (if not evaluated yet) */}
        {!currentEvaluation && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <span>Your Answer:</span>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all border ${
                      isListening
                        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-cyan-400'
                    }`}
                  >
                    {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3 text-cyan-400" />}
                    <span>{isListening ? 'Listening... (Click to stop)' : 'Voice Input (Speak Out Loud)'}</span>
                  </button>
                )}
              </label>

              <button
                type="button"
                onClick={insertCodeTemplate}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400"
              >
                <Code className="h-3 w-3" />
                <span>+ Add Code Block</span>
              </button>
            </div>

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Structure your answer clearly (STAR method or technical explanation with trade-offs)..."
              rows={7}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                Word Count: {userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0} words
              </span>

              <button
                id="submit-answer-btn"
                disabled={!userAnswer.trim() || isSubmitting}
                onClick={handleSubmitAnswer}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Evaluating Answer Quality...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Response for AI Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render FeedbackCard if evaluated */}
      {currentEvaluation && (
        <FeedbackCard
          evaluation={currentEvaluation}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onNextQuestion={handleNext}
          isLastQuestion={isLastQuestion}
        />
      )}
    </div>
  );
};
