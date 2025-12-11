export interface User {
    id: number;
    email: string;
    name: string | null;
    role: "USER" | "ADMIN";
    is_active: boolean;
    refresh_token?: string | null;
    updated_at: string;
    created_at: string;
}

export interface UserResponse extends User { }

export interface Vehicle {
    id: number;
    name: string;
    status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
    fuel_level: number;
    odometer: number;
    latitude: number;
    longitude: number;
    speed: number;
    updated_at: string;
    created_at: string;
}

export interface VehicleResponse extends Vehicle { }

export interface VehicleWithLocation extends Vehicle {
    position: [number, number];
    lastUpdate: string;
}

export interface AccessTokenPayload {
    id: number;
    email: string;
    role: "USER" | "ADMIN";
    iat: number;
    exp: number;
}

export interface AuthResponse {
    success: true;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
    role?: "USER" | "ADMIN";
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
}
