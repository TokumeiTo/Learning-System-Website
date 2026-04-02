import api from "../hooks/useApi";

export const downloadFile = async (fileUrl: string): Promise<Blob> => {
    // We pass the fileUrl as a query parameter to our new backend endpoint
    const response = await api.get(`/api/LocalFileManagement/download`, {
        params: { fileUrl },
        responseType: 'blob', // Important: Tells Axios to handle binary data
    });
    return response.data;
};

export const uploadMediaFile = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", folder);

    // Note: We use { responseType: 'text' } because the controller returns a raw string
    // If your axios interceptor usually expects JSON, this helps avoid parsing errors
    const res = await api.post("/api/LocalFileManagement/file", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });

    return res.data;
};