export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export type KanjiExample = {
  id?: string;
  word: string;
  reading: string;
  meaning: string;
};

export type Kanji = {
  id: string;
  character: string;
  jlptLevel: JLPTLevel;
  onyomi?: string[];
  kunyomi?: string[];
  romaji: string;
  meaning: string;
  strokes: number;
  examples: KanjiExample[];
  radicals?: string[];
};

export type UpsertKanjiRequest = Omit<Kanji, 'id'> & { id?: string };