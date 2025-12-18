import { api } from "../lib/axios";
import type { ApiResponse, UserResponse, RegisterRequest } from "../types";

export const userService = {
    getAll: async () => {
        // Only for ADMIN
        const response = await api.get<ApiResponse<UserResponse[]>>("/api/users");
        return response.data;
    },

    create: async (data: RegisterRequest) => {
        // Admin creating user
        const response = await api.post<ApiResponse<UserResponse>>(
            "/api/users",
            data
        );
        return response.data;
    },

    // Additional methods as needed (update, delete)
};
