export type QuizType = "MultipleChoice" | "StarPuzzle" | "MediaOption";

export interface Option {
  id?: string; // Optional for new options being created
  optionText: string;
  isCorrect?: boolean | null; // Student gets null, Admin gets boolean
}

export interface Question {
  id?: string;
  questionText: string;
  type: QuizType;
  mediaUrl?: string;
  points: number;
  sortOrder: number;
  options: Option[];
}

export interface Test {
  id?: string;
  title?: string;
  questions: Question[];
  passingGrade: number;
  isGlobal: boolean;

  category?: string | null;
  jlptLevel?: string | null;
}

export interface LessonSubmission {
  lessonId?: string;
  testId: string;
  // TypeScript equivalent of Dictionary<Guid, Guid>
  answers: { [questionId: string]: string }; 
}

export interface LessonResult {
  testId: string;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  attemptedAt: string;
  attempts?: number;
  userAnswers?: Record<string, string>;
  correctAnswers?: Record<string, string>;
}

// Attempts handling

export interface LessonAttempt {
  id: string;
  testId: string;
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

export interface CategoryProgress {
    category: string;
    totalCount: number;
    passedCount: number;
    progressPercentage: number;
}