export interface TranslationRequest {
    text: string;
    sourceLanguage: string;
    targetLanguage: string;
    isItContext: boolean;
}

export interface TranslationResponse {
    translatedText: string;
    romaji?: string;
}

export interface TranslationHistoryItem {
    id: number;
    source: string;
    translated: string;
    romaji?: string;
    timestamp: string;
}