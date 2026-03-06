import type { JLPTLevel } from './kanji';

export type GrammarExample = {
    id?: string; // Optional: Backend needs this to know if it's an Update or Add
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

export type UpsertGrammarRequest = Omit<Grammar, 'id'> & {
    id?: string; // Optional for new records, present for updates
};