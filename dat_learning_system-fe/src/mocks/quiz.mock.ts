import type { Quiz, QuizProgress, Level } from "../types/quiz";

export const kanjiQuizMock: Quiz = {
    id: "kanji-n5",
    title: "Kanji Quiz – N5",
    passScore: 70,
    questions: [
        {
            id: "q1",
            question: "What is the meaning of 日?",
            options: [
                { id: "a", text: "Moon" },
                { id: "b", text: "Sun" },
                { id: "c", text: "Fire" },
            ],
            correctOptionId: "b",
        },
        {
            id: "q2",
            question: "What is the meaning of 水?",
            options: [
                { id: "a", text: "Water" },
                { id: "b", text: "Tree" },
                { id: "c", text: "Gold" },
            ],
            correctOptionId: "a",
        },
    ],
};

export const progressByLevel: Record<Level, QuizProgress> = {
  N5: { vocabulary: 72, grammar: 22, reading: 40, kanji: 10 },
  N4: { vocabulary: 55, grammar: 20, reading: 30, kanji: 5 },
  N3: { vocabulary: 10, grammar: 5, reading: 0, kanji: 0 },
  N2: { vocabulary: 0, grammar: 0, reading: 0, kanji: 0 },
  N1: { vocabulary: 0, grammar: 0, reading: 0, kanji: 0 },
};

