import { api } from "../lib/axios";
import type { ApiResponse, Vehicle, VehicleResponse } from "../types";

export const vehicleService = {
    getAll: async () => {
        const response = await api.get<ApiResponse<VehicleResponse[]>>(
            "/api/vehicles"
        );
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<ApiResponse<VehicleResponse>>(
            `/api/vehicles/${id}`
        );
        return response.data;
    },

    create: async (data: Partial<Vehicle>) => {
        const response = await api.post<ApiResponse<VehicleResponse>>(
            "/api/vehicles",
            data
        );
        return response.data;
    },

    update: async (id: number, data: Partial<Vehicle>) => {
        const response = await api.put<ApiResponse<VehicleResponse>>(
            `/api/vehicles/${id}`,
            data
        );
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete<ApiResponse<null>>(`/api/vehicles/${id}`);
        return response.data;
    },
};
