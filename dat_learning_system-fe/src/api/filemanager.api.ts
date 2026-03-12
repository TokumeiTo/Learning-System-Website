import api from "../hooks/useApi";

export const downloadFile = async (fileUrl: string): Promise<Blob> => {
    // We pass the fileUrl as a query parameter to our new backend endpoint
    const response = await api.get(`/api/LocalFileManagement/download`, {
        params: { fileUrl },
        responseType: 'blob', // Important: Tells Axios to handle binary data
    });
    return response.data;
};