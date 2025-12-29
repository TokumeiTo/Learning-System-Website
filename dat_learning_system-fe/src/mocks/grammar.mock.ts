import type { JLPTLevel } from "../types/kanji";

export type GrammarExample = {
  jp: string;
  romaji: string;
  en: string;
};

export type Grammar = {
  id: string;
  title: string;
  jlptLevel: JLPTLevel;
  meaning: string;
  structure: string;
  explanation: string;
  examples: GrammarExample[];
};

export const grammarMockData: Grammar[] = [
  {
    id: "g1",
    title: "〜です / 〜ます",
    jlptLevel: "N5",
    meaning: "Polite sentence ending",
    structure: "Verb / Noun + です / ます",
    explanation: "Used to make polite statements.",
    examples: [
      {
        jp: "私は学生です。",
        romaji: "Watashi wa gakusei desu.",
        en: "I am a student.",
      },
    ],
  },
  {
    id: "g2",
    title: "〜ている",
    jlptLevel: "N5",
    meaning: "Ongoing action",
    structure: "Verb (て) + いる",
    explanation: "Used to express actions in progress.",
    examples: [
      {
        jp: "本を読んでいます。",
        romaji: "Hon o yonde imasu.",
        en: "I am reading a book.",
      },
    ],
  },
  {
    id: "g3",
    title: "〜ながら",
    jlptLevel: "N4",
    meaning: "While doing",
    structure: "Verb (ます stem) + ながら",
    explanation: "Used to express two actions at the same time.",
    examples: [
      {
        jp: "音楽を聞きながら勉強します。",
        romaji: "Ongaku o kikinagara benkyou shimasu.",
        en: "I study while listening to music.",
      },
    ],
  },
];
