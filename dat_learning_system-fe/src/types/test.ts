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
  questions: Question[];
}

export interface LessonSubmission {
  lessonId: string;
  selectedOptionIds: string[];
}

export interface LessonResult {
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  attemptedAt: string;
}