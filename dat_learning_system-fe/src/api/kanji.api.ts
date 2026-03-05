import api from '../hooks/useApi';
import type { Kanji, UpsertKanjiRequest } from '../types_interfaces/kanji';

// Get all kanjis (Backend handles optional level filtering via query)
export const getKanjis = async (level?: string): Promise<Kanji[]> => {
    const response = await api.get('/api/kanjis', { params: { level } });
    return response.data;
};

// Get single kanji detail
export const getKanjiById = async (id: string): Promise<Kanji> => {
    const response = await api.get(`/api/kanjis/${id}`);
    return response.data;
};

// Admin: Upsert (Create/Update) 
// Note: Based on our controller, we use POST for create and PUT for update
export const saveKanji = async (data: UpsertKanjiRequest): Promise<Kanji | void> => {
    if (data.id) {
        // Update scenario: Manual Sync on Backend
        const response = await api.put(`/api/kanjis/${data.id}`, data);
        return response.data;
    } else {
        // Create scenario
        const response = await api.post('/api/kanjis', data);
        return response.data;
    }
};

// Admin: Delete a kanji
export const deleteKanji = async (id: string): Promise<void> => {
    await api.delete(`/api/kanjis/${id}`);
};