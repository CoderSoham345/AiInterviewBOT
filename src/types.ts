export type NavigationTab =
  | 'landing'
  | 'dashboard'
  | 'mock-interview'
  | 'resume-analysis'
  | 'ats-checker'
  | 'question-bank'
  | 'interview-reports'
  | 'progress-tracker'
  | 'settings';

export type InterviewRole = 'Frontend' | 'AI Engineer' | 'Data Analyst' | 'Software Engineer' | 'Custom' | string;

export type InterviewMode = 'Technical' | 'Behavioral' | 'System Design' | 'Coding' | 'HR' | 'Mixed';

export type InterviewType =
  | 'HR Interview'
  | 'Technical Interview'
  | 'Coding Interview'
  | 'Behavioural Interview'
  | 'System Design'
  | 'AI Interview'
  | 'Data Science'
  | 'Machine Learning'
  | 'Frontend'
  | 'Backend'
  | 'Full Stack'
  | 'DevOps'
  | 'Cloud'
  | 'Cyber Security'
  | 'Embedded Systems';

export type ExperienceLevel =
  | 'Intern'
  | 'Fresher'
  | 'Junior'
  | 'Junior (0-2 yrs)'
  | 'Mid-Level'
  | 'Mid-Level (3-5 yrs)'
  | 'Senior'
  | 'Senior (5+ yrs)'
  | 'Staff / Lead';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface PresetRoleInfo {
  id: InterviewRole;
  title: string;
  iconName: string;
  description: string;
  techStack: string[];
  color: string;
}

export interface ResumeData {
  fileName: string;
  fileType: string;
  text: string;
  resumeScore?: number;
  atsScore?: number;
  summary?: string;
  topSkills?: string[];
  experienceYears?: string;
  highlights?: string[];
  projects?: string[];
  education?: string[];
  strengths?: string[];
  weaknesses?: string[];
  missingSkills?: string[];
  recommendedImprovements?: string[];
}

export interface AtsCheckResult {
  atsScore: number;
  formattingScore: number;
  experienceMatchScore: number;
  educationMatchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingFeedback: string[];
  experienceMatchSummary: string;
  improvedResumeRecommendations: string[];
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  conceptTested: string;
  difficulty: DifficultyLevel;
  contextHint?: string;
}

export interface AnswerEvaluation {
  questionId: number;
  questionText: string;
  userAnswer: string;
  confidenceScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  behaviouralScore: number;
  overallScore: number;
  whatWasGood: string[];
  whatWasMissing: string[];
  idealAnswer: string;
  suggestedImprovement: string;
  learningResources: { title: string; url?: string; description: string }[];
}

export interface InterviewReport {
  id: string;
  timestamp: number;
  role: string;
  interviewType: InterviewType | string;
  experienceLevel: ExperienceLevel;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  resumeFileName?: string;

  overallScore: number;
  confidenceScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  behaviouralScore: number;

  hiringRecommendation: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Preparation' | string;
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  skillGapAnalysis?: { skill: string; status: 'Proficient' | 'Developing' | 'Gap'; note: string }[];
  improvementRoadmap?: { phase: string; title: string; action: string }[];
  recommendedCourses?: { name: string; provider: string; url: string }[];
  recommendedProjects?: { title: string; description: string; tech: string[] }[];
  nextPrepPlan?: string;
  evaluations: AnswerEvaluation[];
}

export interface QuestionBankItem {
  id: string;
  category: InterviewType | string;
  question: string;
  difficulty: DifficultyLevel;
  concept: string;
  answerGuideline: string;
  proTips: string[];
}

export interface UserSettings {
  defaultRole: InterviewType | string;
  defaultLevel: ExperienceLevel;
  defaultDifficulty: DifficultyLevel;
  enableVoiceInterviewer: boolean;
  enableVoiceInput: boolean;
  theme: 'dark' | 'glass';
}
