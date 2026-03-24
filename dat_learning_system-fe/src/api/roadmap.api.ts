import api from "../hooks/useApi";
import type { 
    RoadmapResponse, 
    RoadmapRequest 
} from "../types_interfaces/roadmap";

/**
 * Fetch all available roadmaps (Michi / Blueprints)
 */
export const fetchAllRoadmaps = async (): Promise<RoadmapResponse[]> => {
    const response = await api.get<RoadmapResponse[]>('/api/Roadmap');
    return response.data;
};

/**
 * Fetch a single roadmap by ID with all its steps
 */
export const fetchRoadmapById = async (id: number): Promise<RoadmapResponse> => {
    const response = await api.get<RoadmapResponse>(`/api/Roadmap/${id}`);
    return response.data;
};

/**
 * Admin: Create a new Roadmap header
 */
export const createRoadmap = async (payload: RoadmapRequest): Promise<RoadmapResponse> => {
    const response = await api.post<RoadmapResponse>('/api/Roadmap', payload);
    return response.data;
};

export const updateRoadmap = async (id: number, payload: RoadmapResponse): Promise<RoadmapResponse> => {
    const response = await api.put<RoadmapResponse>(`/api/Roadmap/${id}`, payload);
    return response.data;
};

/**
 * Admin: Delete a roadmap
 * (Adding this now as it's standard for your Repository pattern)
 */
export const deleteRoadmap = async (id: number): Promise<void> => {
    await api.delete(`/api/Roadmap/${id}`);
};

export const duplicateRoadmap = async (id: number): Promise<RoadmapResponse> => {
    const response = await api.post<RoadmapResponse>(`/api/Roadmap/${id}/duplicate`);
    return response.data;
};