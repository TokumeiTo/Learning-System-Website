export interface Option {
  id?: string; // Optional for new options being created
  optionText: string;
  isCorrect?: boolean | null; // Student gets null, Admin gets boolean
}

export interface Question {
  id?: string;
  questionText: string;
  points: number;
  sortOrder: number;
  options: Option[];
}

export interface Test {
  id?: string;
  title?: string;
  questions: Question[];
  passingGrade: number;
}

export interface LessonSubmission {
  lessonId: string;
  testId: string;
  // TypeScript equivalent of Dictionary<Guid, Guid>
  answers: { [questionId: string]: string }; 
}

export interface LessonResult {
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  attemptedAt: string;
  correctOptionIds?: string[];
}

// Attempts handling

export interface LessonAttempt {
  id: string;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  attemptedAt: string;
}

export interface QuestionAnalytic {
    questionId: string;
    questionText: string;
    failureRate: number;
}

export interface AdminLessonStats {
  lessonId: string;
  lessonTitle: string;
  totalAttempts: number;
  passCount: number;
  averagePercentage: number;
  difficultQuestions: QuestionAnalytic[];
}

export interface StudentPerformanceKPI {
  userId: string;
  fullName: string;
  email: string;
  lessonsCompleted: number;
  overallAverageScore: number;
  lastActivity?: string;
}