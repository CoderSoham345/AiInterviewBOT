import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { ResumeAnalysisView } from './components/ResumeAnalysisView';
import { AtsCheckerView } from './components/AtsCheckerView';
import { QuestionBankView } from './components/QuestionBankView';
import { MockInterview } from './components/MockInterview';
import { ReportView } from './components/ReportView';
import { HistoryView } from './components/HistoryView';
import { ProgressTrackerView } from './components/ProgressTrackerView';
import { SettingsView } from './components/SettingsView';
import { RoleSelector } from './components/RoleSelector';
import {
  NavigationTab,
  ResumeData,
  InterviewRole,
  ExperienceLevel,
  DifficultyLevel,
  InterviewType,
  InterviewQuestion,
  AnswerEvaluation,
  InterviewReport,
  UserSettings,
} from './types';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('landing');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Default User Settings
  const [settings, setSettings] = useState<UserSettings>({
    defaultRole: 'Frontend',
    defaultLevel: 'Mid-Level',
    defaultDifficulty: 'Medium',
    enableVoiceInterviewer: true,
    enableVoiceInput: true,
    theme: 'dark',
  });

  // Candidate Setup State
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [role, setRole] = useState<InterviewRole>('Frontend');
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical Interview');
  const [customRoleName, setCustomRoleName] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Mid-Level');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
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

  // Load saved settings & history on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('interview_coach_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));

      const savedSettings = localStorage.getItem('interview_coach_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.error('Failed to load local storage:', e);
    }
  }, []);

  const saveHistory = (newHistory: InterviewReport[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('interview_coach_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history:', e);
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
          role: role === 'Custom' ? customRoleName || 'Software Engineer' : role,
          experienceLevel,
          difficulty,
          interviewMode: interviewType,
          resumeText: resumeData?.text || '',
          count: questionCount,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate interview questions');

      setQuestions(data.questions || []);
      setCurrentQuestionIndex(0);
      setEvaluations([]);
      setIsGeneratingQuestions(false);
      setActiveTab('mock-interview');
    } catch (error: any) {
      console.error('Error starting interview:', error);
      alert(error.message || 'Error generating questions. Please try again.');
      setIsGeneratingQuestions(false);
    }
  };

  // Handler: Finish Interview & Generate Final Bar Raiser Scorecard
  const handleFinishInterview = async () => {
    if (evaluations.length === 0) {
      alert('Please answer at least one question before completing.');
      return;
    }

    setIsCompilingReport(true);
    try {
      const response = await fetch('/api/interview/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: role === 'Custom' ? customRoleName || 'Software Engineer' : role,
          interviewType,
          experienceLevel,
          difficulty,
          evaluations,
          resumeFileName: resumeData?.fileName,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate report');

      const compiledReport: InterviewReport = data.report;
      setActiveReport(compiledReport);

      const updated = [compiledReport, ...history];
      saveHistory(updated);

      setIsCompilingReport(false);
      setActiveTab('interview-reports');
    } catch (error: any) {
      console.error('Error compiling report:', error);
      alert(error.message || 'Error generating report.');
      setIsCompilingReport(false);
    }
  };

  const handleSelectHistoryReport = (rep: InterviewReport) => {
    setActiveReport(rep);
    setActiveTab('interview-reports');
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
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {/* Loading Overlay */}
          {isCompilingReport && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4 animate-bounce">
                <Bot className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Compiling Bar Raiser Scorecard...</h2>
              <p className="text-xs text-slate-400 mt-1">
                Aggregating confidence, technical accuracy, and communication metrics...
              </p>
            </div>
          )}

          {/* TAB 1: LANDING OVERVIEW */}
          {activeTab === 'landing' && <LandingPage setActiveTab={setActiveTab} />}

          {/* TAB 2: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardView
              history={history}
              setActiveTab={setActiveTab}
              onSelectReport={handleSelectHistoryReport}
            />
          )}

          {/* TAB 3: MOCK INTERVIEW */}
          {activeTab === 'mock-interview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {questions.length === 0 || isGeneratingQuestions ? (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-black text-white">Configure Your Mock Session</h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Select your target role, experience level, difficulty, and question length to launch your session.
                    </p>
                  </div>

                  <RoleSelector
                    role={role}
                    setRole={setRole}
                    customRoleName={customRoleName}
                    setCustomRoleName={setCustomRoleName}
                    experienceLevel={experienceLevel}
                    setExperienceLevel={setExperienceLevel}
                    interviewMode={interviewType as any}
                    setInterviewMode={setInterviewType as any}
                    questionCount={questionCount}
                    setQuestionCount={setQuestionCount}
                    onStartInterview={handleStartInterview}
                    isGenerating={isGeneratingQuestions}
                    hasResume={Boolean(resumeData)}
                  />
                </div>
              ) : (
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
              )}
            </div>
          )}

          {/* TAB 4: RESUME ANALYSIS */}
          {activeTab === 'resume-analysis' && (
            <ResumeAnalysisView
              resumeData={resumeData}
              setResumeData={setResumeData}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 5: ATS CHECKER */}
          {activeTab === 'ats-checker' && <AtsCheckerView resumeData={resumeData} />}

          {/* TAB 6: QUESTION BANK */}
          {activeTab === 'question-bank' && <QuestionBankView setActiveTab={setActiveTab} />}

          {/* TAB 7: INTERVIEW REPORTS */}
          {activeTab === 'interview-reports' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {activeReport ? (
                <ReportView report={activeReport} onNewInterview={() => setActiveTab('mock-interview')} />
              ) : (
                <HistoryView
                  history={history}
                  onSelectReport={handleSelectHistoryReport}
                  onClearHistory={handleClearHistory}
                  onDeleteReport={handleDeleteHistoryReport}
                  onNewInterview={() => setActiveTab('mock-interview')}
                />
              )}
            </div>
          )}

          {/* TAB 8: PROGRESS TRACKER */}
          {activeTab === 'progress-tracker' && (
            <ProgressTrackerView
              history={history}
              setActiveTab={setActiveTab}
              onSelectReport={handleSelectHistoryReport}
            />
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
              onClearHistory={handleClearHistory}
            />
          )}
        </main>
      </div>
    </div>
  );
}
