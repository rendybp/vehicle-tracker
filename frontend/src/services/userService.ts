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

  update: async (
    id: number,
    data: Partial<RegisterRequest> & { is_active?: boolean }
  ) => {
    const response = await api.put<ApiResponse<UserResponse>>(
      `/api/users/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/api/users/${id}`);
    return response.data;
  },
};
