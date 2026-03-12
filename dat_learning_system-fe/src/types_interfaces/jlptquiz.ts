export interface QuizQuestionDto {
    quizItemId: string;
    prompt: string;         // For Star Puzzle, this is "＿ ＿ ★ ＿"
    options: string[];      // Shuffled parts or distractors
    displayMode: number;    // 0: Kanji, 1: Vocab, 2: GrammarStar
    points: number;
}

export interface QuizAnswerDto {
    quizItemId: string;
    selectedAnswer: string;
}

export interface QuizSession {
    id: string;
    testId: string;
    startedAt: string;
    finishedAt?: string;
    finalScore: number;
    isPassed: boolean;
}

export interface JlptTestDto {
    id: string;
    title: string;
    jlptLevel: string;
    category: string;
    passingGrade: number;
    questionCount: number;
}

export interface QuizSubmissionDto {
    sessionId: number; // Changed from string to number
    answers: QuizAnswerDto[];
}