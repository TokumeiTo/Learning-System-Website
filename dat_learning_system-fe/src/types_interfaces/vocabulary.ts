import type { JLPTLevel } from "./kanji";

export type PartOfSpeech = "Noun" | "Verb" | "Adjective" | "Adverb" | "Particle" | "Expression" | "Other";

export interface VocabularyExample {
  id?: string;
  japanese: string; // Matches C# property name
  english: string;  // Matches C# property name
}

export interface Vocabulary {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: PartOfSpeech;
  jlptLevel: JLPTLevel;
  explanation?: string;
  examples: VocabularyExample[];
}

// Used for the Upsert (Create/Update) logic
export interface UpsertVocabRequest extends Partial<Omit<Vocabulary, 'id'>> {
  id?: string;
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: PartOfSpeech;
  jlptLevel: JLPTLevel;
  examples: VocabularyExample[];
}