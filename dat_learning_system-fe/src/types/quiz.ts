export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
};

export type Quiz = {
  id: string;
  title: string;
  passScore: number;
  questions: QuizQuestion[];
};

export type QuizProgress = {
  vocabulary: number;
  grammar: number;
  reading: number;
  kanji: number;
};

export type LevelProgressMap = {
  [level: string]: QuizProgress;
};

export type Level = "N5" | "N4" | "N3" | "N2" | "N1";
