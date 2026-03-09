import api from '../hooks/useApi';
import type { Vocabulary, UpsertVocabRequest } from '../types_interfaces/vocabulary';

// Get all vocabulary by level
export const getVocabularies = async (level: string): Promise<Vocabulary[]> => {
  // Matches Controller: [HttpGet("level/{level}")]
  const response = await api.get(`/api/vocabulary/level/${level}`);
  return response.data;
};

// Get single vocabulary by ID for the Detail Modal
export const getVocabById = async (id: string): Promise<Vocabulary> => {
  // Matches Controller: [HttpGet("{id}")]
  const response = await api.get(`/api/vocabulary/${id}`);
  return response.data;
};

// Save (Create or Update)
export const saveVocab = async (data: UpsertVocabRequest): Promise<Vocabulary> => {
  // Matches Controller: [HttpPost("upsert")]
  // We use your 'upsert' endpoint which handles both Add and Manual Sync Update
  const response = await api.post('/api/vocabulary/upsert', data);
  return response.data;
};

// Delete
export const deleteVocab = async (id: string): Promise<void> => {
  // Matches Controller: [HttpDelete("{id}")]
  await api.delete(`/api/vocabulary/${id}`);
};