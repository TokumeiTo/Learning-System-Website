import api from "../hooks/useApi";
import type { ApiResponse } from "../types_interfaces/api";
import type {
    EBook,
    UserBookProgress,
    BookActivityRequest,
    PagedLibraryResponse,
    LibraryStatsData
} from "../types_interfaces/library";

// --- Student Actions ---

export const fetchAllBooks = async (
    page: number = 1,
    pageSize: number = 10,
    category?: string,
    search?: string // Add this 4th parameter
): Promise<PagedLibraryResponse<EBook>> => {

    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    // Only append if they have values
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const response = await api.get(`/api/Library?${params.toString()}`);
    return response.data;
};

export const fetchBookById = async (id: number): Promise<EBook> => {
    const response = await api.get(`/api/Library/${id}`);
    return response.data;
};

export const fetchMyBookProgress = async (id: number): Promise<UserBookProgress> => {
    const response = await api.get(`/api/Library/${id}/my-progress`);
    return response.data;
};

export const recordBookActivity = async (payload: BookActivityRequest): Promise<void> => {
    const response = await api.post('/api/Library/activity', payload);
    return response.data;
};

export const fetchLibraryStats = async (): Promise<LibraryStatsData> => {
    const response = await api.get('/api/Library/stats');
    return response.data;
};

// --- Admin Actions ---

export const createBook = async (payload: FormData, onProgress: (pct: number) => void): Promise<ApiResponse<EBook>> => {
    const response = await api.post('/api/Library', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
            const pct = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            onProgress(pct);
        }
    });
    return response.data;
};

export const updateBook = async (id: number, payload: FormData, onProgress: (pct: number) => void): Promise<ApiResponse> => {
    const response = await api.put(`/api/Library/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
            const pct = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            onProgress(pct);
        }
    });
    return response.data;
};

export const deleteBook = async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/api/Library/${id}`);
    return response.data;
};

export const getDownloadUrl = (id: number): string => {
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\$/, '');
    return `${baseUrl}/api/Library/download/${id}`;
};