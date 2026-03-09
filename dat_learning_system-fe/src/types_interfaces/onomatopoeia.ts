export type OnomatoType = "Giseigo" | "Gitaigo" | "Giongo" | "Gibeigo";

export interface Onomatopoeia {
    id: number;
    phrase: string;
    romaji: string;
    meaning: string;
    type: OnomatoType;
    category: string; // e.g., "Texture", "Action", "Emotion"
    explanation?: string;
    examples: OnomatoExample[];
}

export interface OnomatoExample {
    id?: number;
    japanese: string;
    english: string;
    onomatopoeiaId?: number;
}

export interface UpsertOnomatoRequest extends Omit<Onomatopoeia, 'id' | 'examples'> {
    id: number | null; 
    examples: OnomatoExample[];
}