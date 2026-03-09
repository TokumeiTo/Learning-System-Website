import api from "../hooks/useApi";
import type { Onomatopoeia, UpsertOnomatoRequest } from "../types_interfaces/onomatopoeia";

const API_URL = "/api/onomato";

export const getAllOnomato = async (): Promise<Onomatopoeia[]> => {
    const response = await api.get<Onomatopoeia[]>(API_URL);
    return response.data;
};

export const getOnomatoById = async (id: number): Promise<Onomatopoeia> => {
    const response = await api.get<Onomatopoeia>(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Handles both Create and Update
 * Uses the /upsert endpoint we built in the Controller
 */
export const saveOnomato = async (payload: UpsertOnomatoRequest): Promise<Onomatopoeia> => {
    const response = await api.post<Onomatopoeia>(`${API_URL}/upsert`, payload);
    return response.data;
};

export const deleteOnomato = async (id: number): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
};