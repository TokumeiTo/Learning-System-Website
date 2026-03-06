import api from '../hooks/useApi';
import type { Grammar, UpsertGrammarRequest } from '../types_interfaces/grammar';

// Get all grammars by level
export const getGrammars = async (level: string): Promise<Grammar[]> => {
    // Matches the Controller route: [HttpGet("level/{level}")]
    const response = await api.get(`/api/grammarflashcard/level/${level}`);
    return response.data;
};

export const getGrammarById = async (id: string): Promise<Grammar> => {
    // Matches the Controller route: [HttpGet("{id}")]
    const response = await api.get(`/api/grammarflashcard/${id}`);
    return response.data;
};

// Save (Create or Update)
export const saveGrammar = async (data: UpsertGrammarRequest): Promise<Grammar | void> => {
    if (data.id) {
        // Update: PUT /api/grammar/{id}
        const response = await api.put(`/api/grammarflashcard/${data.id}`, data);
        return response.data;
    } else {
        // Create: POST /api/grammar
        const response = await api.post('/api/grammarflashcard', data);
        return response.data;
    }
};

// Delete
export const deleteGrammar = async (id: string): Promise<void> => {
    await api.delete(`/api/grammarflashcard/${id}`);
};