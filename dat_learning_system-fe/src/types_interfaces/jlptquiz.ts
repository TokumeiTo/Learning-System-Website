/**
 * Erasable Syntax Friendly Enum for Display Modes
 */
export const QuizDisplayMode = {
    KanjiReading: 0,
    MeaningMatch: 1,
    GrammarStar: 2,
    ContextFill: 3,
    SynonymMatch: 4
} as const;

export type QuizDisplayMode = typeof QuizDisplayMode[keyof typeof QuizDisplayMode];

/**
 * Represents the Available Quiz metadata (Landing Page)
 */
export interface JlptTestDto {
    id: string; // Guid
    title: string;
    jlptLevel: string;
    category: string;
    passingGrade: number;
    questionCount: number;
}

/**
 * Represents a single Question sent to the client
 */
export interface QuizQuestionDto {
    quizItemId: string; // Guid
    displayMode: QuizDisplayMode;
    prompt: string;
    options: string[];
    points: number;
    sortOrder: number;
}

/**
 * Individual answer selected by the student
 */
export interface QuizAnswerDto {
    quizItemId: string;
    selectedAnswer: string;
}

/**
 * The full payload sent to the /submit endpoint
 */
export interface QuizSubmissionDto {
    sessionId: number;
    answers: QuizAnswerDto[];
}

/**
 * Feedback for a specific question after grading
 */
export interface AnswerFeedbackDto {
    quizItemId: string;
    isCorrect: boolean;
    correctAnswer: string;
    explanation?: string;
}

/**
 * Final result returned after submission
 */
export interface QuizResultDto {
    score: number;
    totalPoints: number;
    isPassed: boolean;
    feedback: AnswerFeedbackDto[];
}

/**
 * Entity representation for history tracking
 */
export interface QuizSession {
    id: number;
    testId: string;
    userId: string;
    startedAt: string;
    finishedAt?: string;
    finalScore?: number;
    isPassed?: boolean;
}