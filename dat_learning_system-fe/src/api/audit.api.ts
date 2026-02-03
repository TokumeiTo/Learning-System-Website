import api from "../hooks/useApi";

export interface AuditParams {
    page: number;
    pageSize: number;
    search?: string;
    from?: string | null;
    to?: string | null;
}

export const getGlobalAuditLogs = async (params: AuditParams) => {
    const response = await api.get('/api/audit', { params });
    // Returns { data: GlobalAuditLogDto[], totalCount: number }
    return response.data;
};