export type InterviewRole = 'Frontend' | 'AI Engineer' | 'Data Analyst' | 'Software Engineer' | 'Custom';

export type ExperienceLevel = 'Junior (0-2 yrs)' | 'Mid-Level (3-5 yrs)' | 'Senior (5+ yrs)' | 'Staff / Lead';

export type InterviewMode = 'Mixed' | 'Technical Deep-Dive' | 'Behavioral (STAR)' | 'System Design';

export interface ResumeData {
  fileName: string;
  fileType: string;
  text: string;
  summary?: string;
  topSkills?: string[];
  experienceYears?: string;
  highlights?: string[];
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: 'Technical' | 'Behavioral' | 'System Design' | 'Resume Specific';
  conceptTested: string;
  contextHint?: string;
}

export interface AnswerEvaluation {
  questionId: number;
  questionText: string;
  userAnswer: string;
  confidenceScore: number;
  technicalScore: number;
  communicationScore: number;
  overallScore: number;
  strengths: string[];
  areasToImprove: string[];
  idealAnswer: string;
  keyTakeaway: string;
}

export interface InterviewReport {
  id: string;
  timestamp: number;
  role: string;
  customRoleName?: string;
  experienceLevel: ExperienceLevel;
  interviewMode: InterviewMode;
  resumeFileName?: string;
  overallScore: number;
  confidenceScore: number;
  technicalScore: number;
  communicationScore: number;
  questionsCount: number;
  evaluations: AnswerEvaluation[];
  executiveSummary: string;
  strengthsSummary: string[];
  keyWeaknesses: string[];
  actionPlan: {
    topic: string;
    description: string;
    resourceOrExercise: string;
  }[];
  recommendedQuestions: string[];
}

export interface PresetRoleInfo {
  id: InterviewRole;
  title: string;
  iconName: string;
  description: string;
  techStack: string[];
  color: string;
}
