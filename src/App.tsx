import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ResumeUploader } from './components/ResumeUploader';
import { RoleSelector } from './components/RoleSelector';
import { MockInterview } from './components/MockInterview';
import { ReportView } from './components/ReportView';
import { HistoryView } from './components/HistoryView';
import { ResumeData, InterviewRole, ExperienceLevel, InterviewMode, InterviewQuestion, AnswerEvaluation, InterviewReport } from './types';
import { Sparkles, Bot, ShieldCheck, Award, Zap, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'setup' | 'interview' | 'report' | 'history'>('setup');

  // Candidate Setup State
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [role, setRole] = useState<InterviewRole>('Frontend');
  const [customRoleName, setCustomRoleName] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Mid-Level (3-5 yrs)');
  const [interviewMode, setInterviewMode] = useState<InterviewMode>('Mixed');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Active Interview Session State
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [evaluations, setEvaluations] = useState<AnswerEvaluation[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isCompilingReport, setIsCompilingReport] = useState(false);

  // Active Report & Local History State
  const [activeReport, setActiveReport] = useState<InterviewReport | null>(null);
  const [history, setHistory] = useState<InterviewReport[]>([]);

  // Load saved history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('interview_coach_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load interview history', e);
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: InterviewReport[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('interview_coach_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save interview history', e);
    }
  };

  // Handler: Start New Mock Interview
  const handleStartInterview = async () => {
    setIsGeneratingQuestions(true);
    try {
      const response = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          customRole: customRoleName,
          experienceLevel,
          interviewMode,
          resumeText: resumeData?.text || '',
          count: questionCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate interview questions');
      }

      setQuestions(data.questions || []);
      setCurrentQuestionIndex(0);
      setEvaluations([]);
      setIsGeneratingQuestions(false);
      setActiveTab('interview');
    } catch (error: any) {
      console.error('Error starting interview:', error);
      alert(error.message || 'Error generating questions. Please try again.');
      setIsGeneratingQuestions(false);
    }
  };

  // Handler: Finish Interview & Generate Comprehensive Report
  const handleFinishInterview = async () => {
    if (evaluations.length === 0) {
      alert('Please answer at least one question to generate a report.');
      return;
    }

    setIsCompilingReport(true);

    try {
      const response = await fetch('/api/interview/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          customRole: customRoleName,
          experienceLevel,
          interviewMode,
          evaluations,
          resumeFileName: resumeData?.fileName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate final report');
      }

      const compiledReport: InterviewReport = data.report;
      setActiveReport(compiledReport);

      // Add to history
      const updatedHistory = [compiledReport, ...history];
      saveHistory(updatedHistory);

      setIsCompilingReport(false);
      setActiveTab('report');
    } catch (error: any) {
      console.error('Error finishing interview:', error);
      alert(error.message || 'Error compiling scorecard report.');
      setIsCompilingReport(false);
    }
  };

  const handleSelectHistoryReport = (rep: InterviewReport) => {
    setActiveReport(rep);
    setActiveTab('report');
  };

  const handleDeleteHistoryReport = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all interview history?')) {
      saveHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 antialiased">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={role}
        customRoleName={customRoleName}
        experienceLevel={experienceLevel}
        hasActiveInterview={questions.length > 0}
        hasReport={activeReport !== null}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Loading overlay during report compilation */}
        {isCompilingReport && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4 animate-bounce">
              <Bot className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Compiling Bar Raiser Scorecard...</h2>
            <p className="text-xs text-slate-400 mt-1">Aggregating confidence, technical, and communication metrics...</p>
          </div>
        )}

        {/* TAB 1: SETUP & ROLE SELECTOR */}
        {activeTab === 'setup' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
              <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Powered by Gemini 3.6 Flash Intelligence</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  Master Your Technical Interviews with Real-time AI Coaching
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Upload your resume, select your target role (Frontend, AI Engineer, Data Analyst, Software Engineer), and practice realistic mock interview questions with instant multi-metric feedback & scorecards.
                </p>

                {/* Feature Pills */}
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-300">
                  <span className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-2.5 py-1 border border-slate-800">
                    <CheckCircle className="h-3.5 w-3.5 text-cyan-400" /> Resume Analysis
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-2.5 py-1 border border-slate-800">
                    <CheckCircle className="h-3.5 w-3.5 text-cyan-400" /> Multi-Score Metrics
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-2.5 py-1 border border-slate-800">
                    <CheckCircle className="h-3.5 w-3.5 text-cyan-400" /> Voice & Text Input
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-2.5 py-1 border border-slate-800">
                    <CheckCircle className="h-3.5 w-3.5 text-cyan-400" /> Personalized Action Plan
                  </span>
                </div>
              </div>
            </div>

            {/* Resume Upload Section */}
            <ResumeUploader resumeData={resumeData} setResumeData={setResumeData} />

            {/* Role & Settings Selector */}
            <RoleSelector
              role={role}
              setRole={setRole}
              customRoleName={customRoleName}
              setCustomRoleName={setCustomRoleName}
              experienceLevel={experienceLevel}
              setExperienceLevel={setExperienceLevel}
              interviewMode={interviewMode}
              setInterviewMode={setInterviewMode}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              onStartInterview={handleStartInterview}
              isGenerating={isGeneratingQuestions}
              hasResume={Boolean(resumeData)}
            />
          </div>
        )}

        {/* TAB 2: LIVE MOCK INTERVIEW */}
        {activeTab === 'interview' && (
          <div className="animate-in fade-in duration-300">
            <MockInterview
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              evaluations={evaluations}
              setEvaluations={setEvaluations}
              role={role}
              customRoleName={customRoleName}
              experienceLevel={experienceLevel}
              resumeText={resumeData?.text}
              onFinishInterview={handleFinishInterview}
            />
          </div>
        )}

        {/* TAB 3: SCORECARD & REPORT */}
        {activeTab === 'report' && activeReport && (
          <div className="animate-in fade-in duration-300">
            <ReportView
              report={activeReport}
              onNewInterview={() => {
                setActiveTab('setup');
              }}
            />
          </div>
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-300">
            <HistoryView
              history={history}
              onSelectReport={handleSelectHistoryReport}
              onClearHistory={handleClearHistory}
              onDeleteReport={handleDeleteHistoryReport}
              onNewInterview={() => setActiveTab('setup')}
            />
          </div>
        )}
      </main>
    </div>
  );
}
