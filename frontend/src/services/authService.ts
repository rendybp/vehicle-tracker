import { api } from "../lib/axios";
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ApiResponse,
    User,
} from "../types";

export const authService = {
    login: async (data: LoginRequest) => {
        const response = await api.post<AuthResponse>("/api/auth/login", data);
        return response.data;
    },

    register: async (data: RegisterRequest) => {
        const response = await api.post<AuthResponse>("/api/auth/register", data);
        return response.data;
    },

    logout: async () => {
        const response = await api.post<{ success: true }>("/api/auth/logout");
        return response.data;
    },

    getProfile: async () => {
        // Assuming there is an endpoint for getting current user profile if needed
        // The docs mention GET /api/auth/me for user profile
        const response = await api.get<ApiResponse<User>>("/api/auth/me");
        return response.data;
    },

    updateProfile: async (data: Partial<User> & { password?: string }) => {
        const response = await api.patch<ApiResponse<User>>("/api/auth/me", data);
        return response.data;
    },
};
