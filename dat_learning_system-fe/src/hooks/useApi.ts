import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // This 'data' is the 'response' object from your Backend ExceptionMiddleware
        const backendError = error.response?.data;

        // Log it or show a Toast notification
        const message = backendError?.message || "Something went wrong";

        console.error("API Error:", message);

        // If you use a library like react-toastify, you'd call it here:
        // toast.error(message);

        return Promise.reject(error);
    }
);

export default api;