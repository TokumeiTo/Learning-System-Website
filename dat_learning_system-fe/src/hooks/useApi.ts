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
        const backendError = error.response?.data;

        // Log it or show a Toast notification
        const message = backendError?.message || "Something went wrong";
        const status = error.response?.status;

        // Check the current URL to see if we are already on the login page
        const isLoginRequest = window.location.pathname.includes("/auth/login");

        if (status === 401) {
            if (isLoginRequest) {
                // CASE 1: Wrong credentials. 
                // Just let the error pass to the SignIn component to show the message.
                console.error("Login Failed:", message);
            } else {
                // CASE 2: Token Expired (8-hour limit hit).
                // Cleanup and redirect.
                localStorage.removeItem("lms_token");
                localStorage.removeItem("lms_user");
                window.location.href = "/auth/login";
                return Promise.reject(error);
            }
        }

        if (status === 403) {
            // CASE 3: Authorized but no permission for this specific action.
            window.location.href = "/unauthorized";
        }

        // Always log the error for debugging
        console.error("API Error:", message);
        return Promise.reject(error);
    }
);

export default api;