import api from "../hooks/useApi";
import type { SchedulePlan, SchedulePlanUpsert } from "../types_interfaces/schedule";

export const scheduleApi = {
    // --- User Endpoints ---
    
    /**
     * Fetches schedules visible to the current user for a specific date
     * @param date ISO string or YYYY-MM-DD
     */
    getMySchedule: async (date: string): Promise<SchedulePlan[]> => {
        const res = await api.get<SchedulePlan[]>("/api/Schedule/my-schedule", {
            params: { date }
        });
        return res.data;
    },

    // --- Admin Endpoints ---

    /**
     * Gets all schedule plans for management (Admin only)
     */
    getAllAdminPlans: async (): Promise<SchedulePlan[]> => {
        const res = await api.get<SchedulePlan[]>("/api/Schedule/admin/all");
        return res.data;
    },

    /**
     * Creates a new schedule plan
     */
    createPlan: async (data: SchedulePlanUpsert): Promise<{ message: string }> => {
        const res = await api.post("/api/Schedule/admin/create", data);
        return res.data;
    },

    /**
     * Updates an existing schedule plan
     */
    updatePlan: async (id: string, data: SchedulePlanUpsert): Promise<{ message: string }> => {
        const res = await api.put(`/api/Schedule/admin/${id}`, data);
        return res.data;
    },

    /**
     * Deletes a schedule plan
     */
    deletePlan: async (id: string): Promise<{ message: string }> => {
        const res = await api.delete(`/api/Schedule/admin/${id}`);
        return res.data;
    }
};