import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
    baseURL,
    withCredentials: true, // Important for cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/register")
        ) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                // We use a new axios instance to isolate this request from interceptors logic if needed,
                // but here we just need to hit the refresh endpoint.
                // The refresh endpoint relies on the HTTP-Only cookie.
                const response = await axios.post(
                    `${baseURL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                if (response.data?.success && response.data?.data?.accessToken) {
                    const newAccessToken = response.data.data.accessToken;

                    // Update store
                    useAuthStore.getState().setAccessToken(newAccessToken);

                    // Update header for the retry
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, logout user
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
