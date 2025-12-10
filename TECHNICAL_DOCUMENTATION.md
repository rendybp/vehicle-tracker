# Vehicle Tracker - Technical Documentation & Product Requirements Document (PRD)

## Project Overview

**Project Name:** Vehicle Tracker  
**Repository:** rendybp/vehicle-tracker  
**Tech Stack:** React + Vite + TypeScript + SWC  
**Current Phase:** Frontend Development  
**Backend Status:** ✅ Completed  

### Description
A comprehensive vehicle tracking and management system with role-based access control, real-time vehicle monitoring, and secure authentication. The application features a modern, responsive frontend built with React and integrates with a completed backend API. 

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Backend Specifications](#backend-specifications)
3. [Frontend Specifications](#frontend-specifications)
4. [Authentication & Authorization](#authentication--authorization)
5. [Features & User Stories](#features--user-stories)
6. [API Endpoints](#api-endpoints)
7. [Database Schema](#database-schema)
8. [Security Requirements](#security-requirements)
9. [UI/UX Guidelines](#uiux-guidelines)
10. [Development Guidelines](#development-guidelines)

---

## Architecture Overview

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         Client Side                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React + Vite + TypeScript (SWC)                       │ │
│  │  - React Router DOM (Routing)                          │ │
│  │  - Zustand (State Management)                          │ │
│  │  - Axios (HTTP Client)                                 │ │
│  │  - React Hook Form + Zod (Form Validation)            │ │
│  │  - Leaflet + React Leaflet (Maps)                     │ │
│  │  - Framer Motion (Animations)                          │ │
│  │  - TailwindCSS v4.1.17 (Styling)                      │ │
│  │  - Lucide React (Icons)                                │ │
│  │  - React Hot Toast (Notifications)                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                         Server Side                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Node.js + Express                                     │ │
│  │  - JWT (Authentication)                                │ │
│  │  - bcryptjs (Password Hashing)                         │ │
│  │  - CORS (Cross-Origin Resource Sharing)               │ │
│  │  - Helmet (Security Headers)                           │ │
│  │  - HTTP-only Cookies (Refresh Token Storage)          │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Database (PostgreSQL Using Prisma )                   │ │
│  │  - Users Table                                         │ │
│  │  - Vehicles Table                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **Framework:** React 18+ with Vite
- **Language:** TypeScript (SWC compiler)
- **Styling:** TailwindCSS v4.1.17
- **State Management:** Zustand
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Form Management:** React Hook Form
- **Validation:** Zod
- **Maps:** Leaflet + React Leaflet
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Utilities:** clsx, tailwind-merge, date-fns

#### Backend
- **Runtime:** Node.js
- **Framework:** Express.js + TypeScript
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs (10 rounds)
- **Security:** CORS, Helmet, cookie-parser
- **Documentation:** Swagger UI (OpenAPI 3.0)
- **Token Storage:** HTTP-only cookies (refresh token)
- **API Structure:** RESTful with modular routing

---

### Frontend Package Dependencies

#### Core Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.1",
    "zustand": "^5.0.2",
    "axios": "^1.7.7",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.23.8",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "framer-motion": "^11.5.4",
    "lucide-react": "^0.446.0",
    "react-hot-toast": "^2.4.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "date-fns": "^3.6.0"
  }
}
```

#### Dev Dependencies
```json
{
  "devDependencies": {
    "@vitejs/plugin-react-swc": "^3.7.0",
    "typescript": "^5.6.2",
    "tailwindcss": "^4.1.17",
    "vite": "^5.4.8",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@types/leaflet": "^1.9.12",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47"
  }
}
```

#### TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

#### Vite Configuration (vite.config.ts)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

## Backend Specifications

### Completed Features ✅

#### 1. Authentication System
- **User Registration**
  - Automatic login after registration
  - Password hashing with bcryptjs
  - Duplicate email validation
  - Role assignment (default: USER)

- **Secure Login**
  - JWT-based authentication
  - Dual token system (access + refresh)
  - HTTP-only cookies for refresh tokens
  - Password verification

- **Token Management**
  - Access Token: 15 minutes lifetime
  - Refresh Token: 7 days lifetime
  - Token refresh endpoint
  - Automatic token rotation

- **Logout**
  - Secure token cleanup
  - HTTP-only cookie removal
  - Database refresh token deletion

#### 2. Security Features
- **Password Security**
  - bcryptjs hashing (10 rounds)
  - Salt generation
  - Secure comparison

- **Token Security**
  - JWT signing with secret key
  - HTTP-only cookies (XSS prevention)
  - Secure flag in production
  - SameSite cookie attribute

- **HTTP Security**
  - CORS configuration
  - Helmet security headers
  - Rate limiting (recommended)
  - Input validation

#### 3. Role-Based Access Control (RBAC)

##### USER Role
- ✅ View all vehicles (GET /api/vehicles)
- ✅ View vehicle details (GET /api/vehicles/:id)
- ✅ View on his own profile (GET /api/auth/me)
- ❌ Create vehicles (POST /api/vehicles)
- ❌ Update vehicles (PUT /api/vehicles/:id)
- ❌ Delete vehicles (DELETE /api/vehicles/:id)
- ❌ User management endpoints

##### ADMIN Role
- ✅ Full CRUD operations on vehicles
- ✅ Full CRUD operations on users
- ✅ Access to all endpoints
- ✅ User role management

#### 4. Token System Details

##### Access Token
```typescript
interface AccessTokenPayload {
  id: number;                    // Integer user ID
  email: string;
  role: 'USER' | 'ADMIN';
  iat: number;                   // Issued at timestamp
  exp: number;                   // Expiration timestamp
}

// Configuration
{
  lifetime: '15m',               // 15 minutes
  storage: 'client-side (memory/localStorage)',
  usage: 'Authorization: Bearer <token>',
  algorithm: 'HS256',            // HMAC SHA256
  secret: 'ACCESS_TOKEN_SECRET', // From environment variable
  refresh: 'automatic via /api/auth/refresh endpoint'
}
```

##### Refresh Token
```typescript
interface RefreshTokenPayload {
  id: number;                    // Integer user ID
  email: string;
  role: 'USER' | 'ADMIN';
  iat: number;                   // Issued at timestamp
  exp: number;                   // Expiration timestamp
}

// Configuration
{
  lifetime: '7d',                // 7 days
  storage: 'HTTP-only cookie',
  usage: 'automatic with /api/auth/refresh',
  name: 'refreshToken',
  algorithm: 'HS256',            // HMAC SHA256
  secret: 'REFRESH_TOKEN_SECRET', // From environment variable
  database: 'users.refresh_token column',
  security: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 604800000            // 7 days in milliseconds
  }
}
```

---

## Frontend Specifications

### Application Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── GuestDashboard.tsx
│   │   ├── UserDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── vehicle/
│   │   ├── VehicleCard.tsx
│   │   ├── VehicleList.tsx
│   │   ├── VehicleDetails.tsx
│   │   ├── VehicleForm.tsx (Admin only)
│   │   └── VehicleMap.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   ├── animations/
│   │   └── VehicleAnimations.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       └── Loader.tsx
├── pages/
│   ├── HomePage.tsx (Guest Dashboard)
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── VehiclesPage.tsx
│   ├── VehicleDetailsPage.tsx
│   ├── AdminPage.tsx
│   └── NotFoundPage.tsx
├── store/
│   ├── authStore.ts
│   ├── vehicleStore.ts
│   └── uiStore.ts
├── services/
│   ├── api.ts
│   ├── authService.ts
│   └── vehicleService.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useVehicles.ts
│   └── useTokenRefresh.ts
├── utils/
│   ├── cn.ts (clsx + tailwind-merge)
│   ├── formatDate.ts
│   └── validators.ts
├── types/
│   ├── auth.types.ts
│   ├── vehicle.types.ts
│   └── api.types.ts
└── App.tsx
```

### State Management (Zustand)

#### Auth Store
```typescript
interface User {
  id: number;                    // Integer from backend
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  is_active: boolean;
  created_at: string;            // ISO date string
  updated_at: string;
}

interface RegisterData {
  email: string;
  password: string;              // Min 6 characters
  name?: string;
  role?: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string>;  // Returns new access token
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
}

// Implementation notes:
// - Store accessToken in Zustand + localStorage for persistence
// - Refresh token is in HTTP-only cookie (don't store in frontend)
// - Call refreshToken() when receiving 401 responses
// - Clear all auth state on logout
```

#### Vehicle Store
```typescript
interface Vehicle {
  id: number;                    // Integer from backend
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  fuel_level: number;            // Float (0-100)
  odometer: number;              // Float (kilometers)
  latitude: number;              // Float (GPS coordinate)
  longitude: number;             // Float (GPS coordinate)
  speed: number;                 // Float (km/h)
  updated_at: string;            // ISO date string
  created_at: string;
}

interface VehicleFormData {
  name: string;
  fuel_level: number;            // Required (0-100)
  odometer: number;              // Required (km)
  latitude: number;              // Required
  longitude: number;             // Required
  speed: number;                 // Required (km/h)
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'; // Optional, default: ACTIVE
}

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchVehicles: () => Promise<void>;
  fetchVehicleById: (id: number) => Promise<void>;
  createVehicle: (data: VehicleFormData) => Promise<void>;  // ADMIN only
  updateVehicle: (id: number, data: Partial<VehicleFormData>) => Promise<void>; // ADMIN only
  deleteVehicle: (id: number) => Promise<void>;  // ADMIN only
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  clearError: () => void;
}

// Implementation notes:
// - fetchVehicles() and fetchVehicleById() accessible by USER and ADMIN
// - create/update/delete only accessible by ADMIN (check role before calling)
// - Backend returns all vehicles (no pagination)
// - Use snake_case for API requests, store as-is in state
```

#### UI Store
```typescript
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;             // Auto-dismiss after ms (default: 5000)
}

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Implementation notes:
// - Use react-hot-toast for notifications (already in tech stack)
// - Store theme preference in localStorage
// - Sidebar state for mobile responsiveness
```

### TypeScript Types

#### types/auth.types.ts
```typescript
// User from backend
export interface User {
  id: number;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Registration form data
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;       // Frontend only
  name?: string;
}

// Login form data
export interface LoginFormData {
  email: string;
  password: string;
}

// API responses
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}
```

#### types/vehicle.types.ts
```typescript
// Vehicle from backend
export interface Vehicle {
  id: number;
  name: string;
  status: VehicleStatus;
  fuel_level: number;
  odometer: number;
  latitude: number;
  longitude: number;
  speed: number;
  updated_at: string;
  created_at: string;
}

export type VehicleStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

// Vehicle form data
export interface VehicleFormData {
  name: string;
  fuel_level: number;
  odometer: number;
  latitude: number;
  longitude: number;
  speed: number;
  status?: VehicleStatus;
}

// For display purposes
export interface VehicleWithLocation extends Vehicle {
  position: [number, number];    // [latitude, longitude] for Leaflet
}
```

#### types/api.types.ts
```typescript
// Standard API response format
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// API error response
export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// Pagination (if implemented)
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### API Service Layer

#### services/api.ts
```typescript
import axios, { AxiosError, AxiosInstance } from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,           // Important: send cookies
});

// Request interceptor: Add access token
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

// Response interceptor: Handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;
    
    // If 401 and not already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Call refresh token endpoint
        const newToken = await useAuthStore.getState().refreshToken();
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Type augmentation for retry flag
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}
```

#### services/authService.ts
```typescript
import { api } from './api';
import { AuthResponse, RefreshResponse, RegisterFormData, LoginFormData } from '../types/auth.types';

export const authService = {
  // Register new user
  register: async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    const response = await api.post<AuthResponse>('/api/auth/register', registerData);
    return response.data;
  },

  // Login user
  login: async (data: LoginFormData) => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await api.post<RefreshResponse>('/api/auth/refresh');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<User>>('/api/auth/me');
    return response.data;
  },
};
```

#### services/vehicleService.ts
```typescript
import { api } from './api';
import { Vehicle, VehicleFormData } from '../types/vehicle.types';
import { ApiResponse } from '../types/api.types';

export const vehicleService = {
  // Get all vehicles (USER, ADMIN)
  getAll: async () => {
    const response = await api.get<ApiResponse<Vehicle[]>>('/api/vehicles');
    return response.data;
  },

  // Get vehicle by ID (USER, ADMIN)
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Vehicle>>(`/api/vehicles/${id}`);
    return response.data;
  },

  // Create vehicle (ADMIN only)
  create: async (data: VehicleFormData) => {
    const response = await api.post<ApiResponse<Vehicle>>('/api/vehicles', data);
    return response.data;
  },

  // Update vehicle (ADMIN only)
  update: async (id: number, data: Partial<VehicleFormData>) => {
    const response = await api.put<ApiResponse<Vehicle>>(`/api/vehicles/${id}`, data);
    return response.data;
  },

  // Delete vehicle (ADMIN only)
  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/api/vehicles/${id}`);
    return response.data;
  },
};
```

---

### Custom Hooks

#### hooks/useAuth.ts
```typescript
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { LoginFormData, RegisterFormData } from '@/types/auth.types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error,
    login: loginAction,
    register: registerAction,
    logout: logoutAction 
  } = useAuthStore();

  const login = async (data: LoginFormData) => {
    try {
      await loginAction(data.email, data.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      await registerAction(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutAction();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err: any) {
      toast.error('Logout failed');
    }
  };

  // Check if user has specific role
  const hasRole = (role: 'USER' | 'ADMIN') => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => hasRole('ADMIN');

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
  };
};
```

#### hooks/useVehicles.ts
```typescript
import { useVehicleStore } from '@/store/vehicleStore';
import { VehicleFormData } from '@/types/vehicle.types';
import toast from 'react-hot-toast';
import { useAuth } from './useAuth';

export const useVehicles = () => {
  const { isAdmin } = useAuth();
  const {
    vehicles,
    selectedVehicle,
    isLoading,
    error,
    fetchVehicles,
    fetchVehicleById,
    createVehicle: createAction,
    updateVehicle: updateAction,
    deleteVehicle: deleteAction,
    setSelectedVehicle,
  } = useVehicleStore();

  const createVehicle = async (data: VehicleFormData) => {
    if (!isAdmin()) {
      toast.error('Only admins can create vehicles');
      throw new Error('Unauthorized');
    }
    
    try {
      await createAction(data);
      toast.success('Vehicle created successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create vehicle');
      throw err;
    }
  };

  const updateVehicle = async (id: number, data: Partial<VehicleFormData>) => {
    if (!isAdmin()) {
      toast.error('Only admins can update vehicles');
      throw new Error('Unauthorized');
    }
    
    try {
      await updateAction(id, data);
      toast.success('Vehicle updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update vehicle');
      throw err;
    }
  };

  const deleteVehicle = async (id: number) => {
    if (!isAdmin()) {
      toast.error('Only admins can delete vehicles');
      throw new Error('Unauthorized');
    }
    
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }
    
    try {
      await deleteAction(id);
      toast.success('Vehicle deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete vehicle');
      throw err;
    }
  };

  return {
    vehicles,
    selectedVehicle,
    isLoading,
    error,
    fetchVehicles,
    fetchVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    setSelectedVehicle,
  };
};
```

---

### Utilities

#### utils/validators.ts (Zod Schemas)
```typescript
import { z } from 'zod';

// Login validation
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required'),
});

// Registration validation
export const registerSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  name: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Vehicle form validation
export const vehicleSchema = z.object({
  name: z.string()
    .min(1, 'Vehicle name is required')
    .max(255, 'Name is too long'),
  fuel_level: z.number()
    .min(0, 'Fuel level must be at least 0')
    .max(100, 'Fuel level cannot exceed 100'),
  odometer: z.number()
    .min(0, 'Odometer must be positive'),
  latitude: z.number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),
  longitude: z.number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
  speed: z.number()
    .min(0, 'Speed must be positive'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VehicleFormData = z.infer<typeof vehicleSchema>;
```

#### utils/formatters.ts
```typescript
import { format, formatDistanceToNow } from 'date-fns';

// Format ISO date string to readable format
export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

export const formatDateTime = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

// Format fuel level with percentage
export const formatFuelLevel = (level: number): string => {
  return `${level.toFixed(1)}%`;
};

// Format odometer reading
export const formatOdometer = (km: number): string => {
  return `${km.toLocaleString()} km`;
};

// Format speed
export const formatSpeed = (speed: number): string => {
  return `${speed.toFixed(0)} km/h`;
};

// Format GPS coordinates
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

// Get status badge color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800';
    case 'MAINTENANCE':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
```

---

## Authentication & Authorization

### Authentication Flow

#### 1. Registration Flow
```
User fills registration form
      ↓
Frontend validates with Zod
      ↓
POST /api/auth/register
      ↓
Backend validates & hashes password
      ↓
User created with default USER role
      ↓
Generate access + refresh tokens
      ↓
Set HTTP-only cookie (refresh token)
      ↓
Return access token + user data
      ↓
Frontend stores in Zustand + localStorage
      ↓
Redirect to dashboard
```

#### 2. Login Flow
```
User fills login form
      ↓
Frontend validates with Zod
      ↓
POST /api/auth/login
      ↓
Backend validates credentials
      ↓
Generate access + refresh tokens
      ↓
Store refresh token in database
      ↓
Set HTTP-only cookie (refresh token)
      ↓
Return access token + user data
      ↓
Frontend stores in Zustand + localStorage
      ↓
Redirect to dashboard
```

#### 3. Token Refresh Flow
```
Access token expires (15 minutes)
      ↓
API returns 401 Unauthorized
      ↓
Axios interceptor catches error
      ↓
POST /api/auth/refresh (with HTTP-only cookie)
      ↓
Backend validates refresh token
      ↓
Generate new access + refresh tokens
      ↓
Update refresh token in database
      ↓
Update HTTP-only cookie
      ↓
Return new access token
      ↓
Frontend updates Zustand + localStorage
      ↓
Retry original request
```

#### 4. Logout Flow
```
User clicks logout
      ↓
POST /api/auth/logout
      ↓
Backend removes refresh token from database
      ↓
Clear HTTP-only cookie
      ↓
Frontend clears Zustand + localStorage
      ↓
Redirect to home/login page
```

### Protected Routes

```typescript
// Public routes (accessible to everyone)
- / (Home/Guest Dashboard)
- /login
- /register

// Protected routes (require authentication)
- /dashboard (USER, ADMIN)
- /vehicles (USER, ADMIN)
- /vehicles/:id (USER, ADMIN)

// Admin-only routes
- /admin (ADMIN only)
- /admin/users (ADMIN only)
- /admin/vehicles/new (ADMIN only)
- /admin/vehicles/:id/edit (ADMIN only)
```

### Authorization Middleware (Frontend)

```typescript
// components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'USER' | 'ADMIN';
  allowedRoles?: ('USER' | 'ADMIN')[];
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole,
  allowedRoles 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  
  // Check authentication
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check single required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check allowed roles (more flexible)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Usage examples:
// <ProtectedRoute><DashboardPage /></ProtectedRoute>  // Any authenticated user
// <ProtectedRoute requiredRole="ADMIN"><AdminPage /></ProtectedRoute>  // Admin only
// <ProtectedRoute allowedRoles={['USER', 'ADMIN']}><VehiclesPage /></ProtectedRoute>  // Both
```

---

### Key Component Specifications

#### components/auth/LoginForm.tsx
**Purpose**: Handle user login with email and password

**Props**: None (uses useAuth hook)

**Validation**: Zod schema (`loginSchema`)

**Features**:
- Email and password input fields
- Form validation with error messages
- Loading state during submission
- Remember me checkbox (optional)
- Link to registration page
- Toast notifications for success/error

**Integration**:
```typescript
const { login, isLoading } = useAuth();
const handleSubmit = async (data: LoginFormData) => {
  await login(data); // Automatically navigates on success
};
```

#### components/auth/RegisterForm.tsx
**Purpose**: Handle new user registration

**Props**: None (uses useAuth hook)

**Validation**: Zod schema (`registerSchema`)

**Features**:
- Email, password, confirm password, name (optional) fields
- Password strength indicator
- Form validation with inline error messages
- Loading state during submission
- Link to login page
- Toast notifications for success/error

**Password Requirements**:
- Minimum 6 characters (enforced by backend)
- Frontend can add visual indicators for strong passwords

#### components/vehicles/VehicleCard.tsx
**Purpose**: Display individual vehicle information in card format

**Props**:
```typescript
interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: (id: number) => void;  // ADMIN only
  onDelete?: (id: number) => void; // ADMIN only
  onViewDetails?: (id: number) => void;
}
```

**Features**:
- Vehicle name, status badge (colored by getStatusColor)
- Fuel level progress bar
- Odometer reading (formatted with formatOdometer)
- Speed indicator
- Last updated timestamp (formatRelativeTime)
- Action buttons (edit/delete) visible only to admins
- Click to view details

**Styling**:
- TailwindCSS card with shadow
- Responsive grid layout
- Status-based color coding

#### components/vehicles/VehicleMap.tsx
**Purpose**: Display vehicle locations on interactive map

**Props**:
```typescript
interface VehicleMapProps {
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle | null;
  onVehicleSelect?: (vehicle: Vehicle) => void;
  center?: [number, number]; // Default to first vehicle or [0, 0]
  zoom?: number; // Default to 13
}
```

**Features**:
- Leaflet map with OpenStreetMap tiles
- Marker for each vehicle with custom icon
- Popup showing vehicle details on click
- Auto-center on selected vehicle
- Zoom controls
- Vehicle status-based marker colors

**Integration**:
```typescript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// Use formatCoordinates, formatSpeed, formatFuelLevel for popup content
```

#### components/vehicles/VehicleForm.tsx
**Purpose**: Create or update vehicle data

**Props**:
```typescript
interface VehicleFormProps {
  vehicle?: Vehicle; // If editing, undefined for create
  onSubmit: (data: VehicleFormData) => Promise<void>;
  onCancel: () => void;
}
```

**Validation**: Zod schema (`vehicleSchema`)

**Features**:
- All vehicle fields (name, fuel_level, odometer, latitude, longitude, speed, status)
- Number inputs with min/max validation
- Status dropdown (ACTIVE, INACTIVE, MAINTENANCE)
- Map picker for coordinates (optional enhancement)
- Form validation with inline errors
- Cancel and Submit buttons
- Loading state during submission

---

### Routing Configuration

#### src/App.tsx
```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import VehiclesPage from '@/pages/vehicles/VehiclesPage';
import VehicleDetailsPage from '@/pages/vehicles/VehicleDetailsPage';
import AdminPage from '@/pages/admin/AdminPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} 
        />

        {/* Protected Routes - Any authenticated user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <VehiclesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/:id"
          element={
            <ProtectedRoute>
              <VehicleDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
```

#### Route Structure Summary
```
/ (public)                    - Home/Landing page
/login (public)               - Login form
/register (public)            - Registration form
/dashboard (protected)        - User dashboard with vehicle overview
/vehicles (protected)         - Vehicle list/grid view with map
/vehicles/:id (protected)     - Vehicle detail page with history
/admin (admin only)           - Admin panel (user management)
```

#### Navigation Flow
1. **Guest User**: Can access `/`, `/login`, `/register`
2. **Authenticated User**: Redirected from auth pages to `/dashboard`
3. **Protected Pages**: Redirect to `/login` if not authenticated
4. **Admin Pages**: Show 403 error or redirect if not ADMIN role

---

## Features & User Stories

### Guest User (Not Logged In)

#### Guest Dashboard (Home Page)
**Page:** `/`

**Purpose:** Showcase the vehicle tracker platform and encourage sign-up

**Features:**
1. **Hero Section**
   - Compelling headline: "Track Your Fleet in Real-Time"
   - Subheadline: "Powerful vehicle management with live tracking"
   - CTA buttons: "Get Started" (register) and "Learn More"
   - Animated vehicle illustrations (Framer Motion)

2. **Animated Vehicle Showcase**
   - Interactive vehicle animations moving across the screen
   - Different vehicle types (cars, trucks, motorcycles, buses)
   - Smooth transitions using Framer Motion
   - Parallax scrolling effects
   - Animated map background with moving vehicle markers

3. **Feature Highlights**
   - **Real-Time Tracking:** Live vehicle location updates
   - **Fleet Management:** Organize and manage multiple vehicles
   - **Route History:** View historical tracking data
   - **Alerts & Notifications:** Get notified of important events
   - **Role-Based Access:** Secure access control
   - Each feature with icon and animation

4. **Statistics Section**
   - Animated counters showing:
     - "1000+ Vehicles Tracked"
     - "500+ Active Users"
     - "99.9% Uptime"
     - "24/7 Support"

5. **How It Works Section**
   - Step 1: Register your account
   - Step 2: Add your vehicles
   - Step 3: Track in real-time
   - Step 4: Manage your fleet
   - Visual flow diagram with animations

6. **Demo Section**
   - Interactive map with sample vehicles
   - Real-time animation of vehicle movements
   - Click on vehicles to see mock details
   - Non-functional demo (view-only)

7. **Testimonials (Optional)**
   - Carousel of user testimonials
   - Animated transitions

8. **Footer**
   - Quick links
   - Contact information
   - Social media links
   - Copyright notice

**Design Requirements:**
- Modern, clean, professional design
- Primary color: Blue/Teal gradient
- Smooth animations throughout
- Responsive design (mobile-first)
- High-quality vehicle SVG illustrations
- Fast loading times
- Accessible (WCAG 2.1 AA)

**Animations:**
- Vehicle cards slide in on scroll
- Hero section fade-in animation
- Floating vehicle animations in background
- Hover effects on cards and buttons
- Parallax scrolling effects
- Number counter animations
- Map marker animations

**Call-to-Actions:**
- Prominent "Get Started" buttons
- "Try Demo" interactive section
- "Sign Up Now" at bottom
- "Login" link in header

---

### Authenticated User (USER Role)

#### US-001: View All Vehicles
**As a** logged-in user  
**I want to** view a list of all vehicles  
**So that** I can see what vehicles are being tracked

**Acceptance Criteria:**
- Display vehicle cards in a responsive grid
- Show vehicle image, name, model, status, location
- Include search and filter functionality
- Pagination for large lists
- Loading states and error handling
- Click on card to view details

#### US-002: View Vehicle Details
**As a** logged-in user  
**I want to** view detailed information about a specific vehicle  
**So that** I can see its current status and location

**Acceptance Criteria:**
- Display vehicle on interactive map (Leaflet)
- Show real-time location
- Display vehicle information (make, model, year, etc.)
- Show current status (active, idle, maintenance)
- Display route history
- Show last updated timestamp
- Responsive design

#### US-003: View Dashboard
**As a** logged-in user  
**I want to** see a dashboard with vehicle overview  
**So that** I can quickly understand fleet status

**Acceptance Criteria:**
- Display total vehicle count
- Show active/idle/maintenance counts
- Recent vehicle activities
- Quick access to vehicle list
- Map overview of all vehicles
- Responsive cards with statistics

#### US-004: User Profile
**As a** logged-in user  
**I want to** view and edit my profile  
**So that** I can keep my information up-to-date

**Acceptance Criteria:**
- Display user information
- Edit name, email, password
- Form validation with Zod
- Success/error notifications
- Avatar upload (optional)

---

### Admin User (ADMIN Role)

#### US-005: Create Vehicle
**As an** admin  
**I want to** add new vehicles to the system  
**So that** they can be tracked

**Acceptance Criteria:**
- Form with validation (React Hook Form + Zod)
- Fields: name, make, model, year, VIN, license plate, etc.
- Image upload functionality
- Select location on map
- Success notification
- Redirect to vehicle list

#### US-006: Update Vehicle
**As an** admin  
**I want to** edit existing vehicle information  
**So that** I can keep data accurate

**Acceptance Criteria:**
- Pre-filled form with current data
- Validation on all fields
- Update location on map
- Change vehicle status
- Confirmation before saving
- Success notification

#### US-007: Delete Vehicle
**As an** admin  
**I want to** remove vehicles from the system  
**So that** I can manage fleet accurately

**Acceptance Criteria:**
- Confirmation modal before deletion
- Soft delete (recommended)
- Success notification
- Remove from vehicle list
- Cannot delete vehicles with active tracking

#### US-008: User Management
**As an** admin  
**I want to** manage user accounts  
**So that** I can control access

**Acceptance Criteria:**
- View all users in table
- Create new users
- Edit user roles (USER/ADMIN)
- Deactivate/activate users
- Search and filter users
- Bulk actions (optional)

#### US-009: Admin Dashboard
**As an** admin  
**I want to** see advanced analytics  
**So that** I can monitor system health

**Acceptance Criteria:**
- All statistics from user dashboard
- User activity logs
- System health metrics
- Vehicle usage analytics
- Charts and graphs
- Export functionality (optional)

---

## API Endpoints

### Base URL
```
Development: http://localhost:5000
Production: https://your-domain.com
```

### Quick Reference

#### Authentication
| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| POST | `/api/auth/register` | No | - | Register new user |
| POST | `/api/auth/login` | No | - | Login user |
| POST | `/api/auth/logout` | No | - | Logout user |
| POST | `/api/auth/refresh` | Cookie | - | Refresh access token |
| GET | `/api/auth/me` | Yes | USER, ADMIN | Get current user |

#### Vehicles
| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| GET | `/api/vehicles` | Yes | USER, ADMIN | Get all vehicles |
| GET | `/api/vehicles/:id` | Yes | USER, ADMIN | Get vehicle by ID |
| POST | `/api/vehicles` | Yes | ADMIN | Create vehicle |
| PUT | `/api/vehicles/:id` | Yes | ADMIN | Update vehicle |
| DELETE | `/api/vehicles/:id` | Yes | ADMIN | Delete vehicle |

#### Users
| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| GET | `/api/users` | Yes | ADMIN | Get all users |
| GET | `/api/users/:id` | Yes | ADMIN | Get user by ID |
| POST | `/api/users` | Yes | ADMIN | Create user |
| PUT | `/api/users/:id` | Yes | ADMIN | Update user |
| DELETE | `/api/users/:id` | Yes | ADMIN | Delete user |

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123",       // Minimum 6 characters
  "name": "John Doe",              // Optional
  "role": "USER"                   // Optional, default: USER (can be ADMIN)
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,                     // Integer, auto-increment
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"               // USER or ADMIN
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}

Cookies Set:
- refreshToken (HTTP-only, Secure in production, SameSite=strict, 7 days)

Validation:
- Email must be unique
- Password must be at least 6 characters
- Email format must be valid

Notes:
- User is automatically logged in after registration
- Refresh token is stored in database and sent as HTTP-only cookie
- Password is hashed with bcryptjs (10 rounds)
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,                   // Integer
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}

Cookies Set:
- refreshToken (HTTP-only, Secure in production, SameSite=strict, 7 days)

Error Responses:
- 400: Missing email or password
- 401: Invalid email or password
- 403: Account is deactivated

Validation:
- Email and password are required
- Account must be active (is_active = true)
- Password is verified using bcrypt.compare()
```

#### Refresh Token
```
POST /api/auth/refresh
Cookie: refreshToken=<token>

Response (200):
{
  "success": true,
  "message": "Access token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}

Error Responses:
- 401: Refresh token is required / Refresh token expired
- 403: Invalid refresh token / Account is deactivated

Notes:
- Refresh token is read from HTTP-only cookie
- Token is verified against REFRESH_TOKEN_SECRET
- Token in database must match the provided token
- User account must be active (is_active = true)
- Does NOT rotate refresh token (refresh token remains the same)
```

#### Logout
```
POST /api/auth/logout
Cookie: refreshToken=<token>

Response (200):
{
  "success": true,
  "message": "Logout successful"
}

Cookies Cleared:
- refreshToken

Notes:
- Refresh token is removed from database (users.refresh_token set to null)
- HTTP-only cookie is cleared
- No authentication required (can logout even with expired token)
- Returns success even if no refresh token is provided
```
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <access-token>

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    }
  }
}
```

---

### Vehicle Endpoints

**Authentication Required:** All vehicle endpoints require a valid access token in the Authorization header.

**Authorization:**
- GET endpoints: USER and ADMIN
- POST, PUT, DELETE endpoints: ADMIN only

#### Get All Vehicles
```
GET /api/vehicles
Authorization: Bearer <access-token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,                      // Integer
      "name": "Toyota Avanza",
      "status": "ACTIVE",           // ACTIVE, INACTIVE, MAINTENANCE
      "fuel_level": 75.5,           // Float (0-100)
      "odometer": 15000,            // Float (kilometers)
      "latitude": -6.2088,          // Float (GPS coordinate)
      "longitude": 106.8456,        // Float (GPS coordinate)
      "speed": 60,                  // Float (km/h)
      "updated_at": "2025-12-10T10:00:00Z",
      "created_at": "2025-12-03T08:00:00Z"
    }
  ]
}

Accessible by: USER, ADMIN
Notes:
- Returns all vehicles in descending order by created_at
- No pagination implemented (returns all vehicles)
```

#### Get Vehicle by ID
```
GET /api/vehicles/:id
Authorization: Bearer <access-token>

Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Toyota Avanza",
    "status": "ACTIVE",
    "fuel_level": 75.5,
    "odometer": 15000,
    "latitude": -6.2088,
    "longitude": 106.8456,
    "speed": 60,
    "updated_at": "2025-12-10T10:00:00Z",
    "created_at": "2025-12-03T08:00:00Z"
  }
}

Error Responses:
- 404: Vehicle not found

Accessible by: USER, ADMIN
          "lat": 40.7128,
          "lng": -74.0060,
          "timestamp": "2025-12-10T09:00:00Z"
        }
      ],
      "lastUpdated": "2025-12-10T10:00:00Z",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  }
}

Accessible by: USER, ADMIN
```

#### Create Vehicle
```
POST /api/vehicles
Authorization: Bearer <access-token>
Content-Type: application/json

Request Body:
{
  "name": "Toyota Avanza",           // Required
  "fuel_level": 75.5,                // Required (0-100)
  "odometer": 15000,                 // Required (km)
  "latitude": -6.2088,               // Required
  "longitude": 106.8456,             // Required
  "speed": 60,                       // Required (km/h)
  "status": "ACTIVE"                 // Optional, default: ACTIVE
}

Response (201):
{
  "success": true,
  "message": "Vehicle created successfully",
  "data": {
    "id": 1,
    "name": "Toyota Avanza",
    "status": "ACTIVE",
    "fuel_level": 75.5,
    "odometer": 15000,
    "latitude": -6.2088,
    "longitude": 106.8456,
    "speed": 60,
    "updated_at": "2025-12-10T10:00:00Z",
    "created_at": "2025-12-10T10:00:00Z"
  }
}

Error Responses:
- 400: Missing required fields
- 403: Insufficient permissions (USER role)

Accessible by: ADMIN only
Validation:
- All numeric fields (fuel_level, odometer, latitude, longitude, speed) are required
- Status must be: ACTIVE, INACTIVE, or MAINTENANCE
```

#### Update Vehicle
```
PUT /api/vehicles/:id
Authorization: Bearer <access-token>
Content-Type: application/json

Request Body (all fields optional):
{
  "name": "Toyota Avanza Updated",
  "fuel_level": 80.0,
  "odometer": 15500,
  "latitude": -6.2100,
  "longitude": 106.8500,
  "speed": 65,
  "status": "MAINTENANCE"
}

Response (200):
{
  "success": true,
  "message": "Vehicle updated successfully",
  "data": {
    "id": 1,
    "name": "Toyota Avanza Updated",
    "status": "MAINTENANCE",
    "fuel_level": 80.0,
    "odometer": 15500,
    "latitude": -6.2100,
    "longitude": 106.8500,
    "speed": 65,
    "updated_at": "2025-12-10T11:00:00Z",
    "created_at": "2025-12-10T10:00:00Z"
  }
}

Error Responses:
- 404: Vehicle not found
- 403: Insufficient permissions (USER role)

Accessible by: ADMIN only
Notes:
- Only provided fields are updated
- updated_at timestamp is automatically updated
```

#### Delete Vehicle
```
DELETE /api/vehicles/:id
Authorization: Bearer <access-token>

Response (200):
{
  "success": true,
  "message": "Vehicle deleted successfully"
}

Error Responses:
- 404: Vehicle not found
- 403: Insufficient permissions (USER role)

Accessible by: ADMIN only
Notes:
- Hard delete (vehicle is permanently removed from database)
- No soft delete implemented
```

---

### User Management Endpoints (Admin Only)

**Authentication Required:** All user endpoints require ADMIN role.

**Authorization:** ADMIN only (verified by checkRole middleware)

#### Get All Users
```
GET /api/users
Authorization: Bearer <access-token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,                        // Integer
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",                 // USER or ADMIN
      "is_active": true,
      "created_at": "2025-12-10T10:00:00Z",
      "updated_at": "2025-12-10T10:00:00Z"
    }
  ]
}

Notes:
- Password field is excluded from response
- Returns users in descending order by created_at
- No pagination implemented

Accessible by: ADMIN only
```

#### Get User by ID
```
GET /api/users/:id
Authorization: Bearer <access-token>

Response (200):
{
  "success": true,
  "data": {
    \"id\": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "is_active": true,
    "created_at": "2025-12-10T10:00:00Z",
    "updated_at": "2025-12-10T10:00:00Z"
  }
}

Error Responses:
- 404: User not found
- 403: Insufficient permissions (USER role)

Accessible by: ADMIN only
```

#### Create User
```
POST /api/users
Authorization: Bearer <access-token>
Content-Type: application/json

Request Body:
{
  "email": "newuser@example.com",     // Required, must be unique
  "password": "password123",          // Required, min 6 characters
  "name": "Jane Doe",                 // Optional
  "role": "USER",                     // Optional, default: USER
  "is_active": true                   // Optional, default: true
}

Response (201):
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 2,
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "role": "USER",
    "is_active": true,
    "created_at": "2025-12-10T11:00:00Z",
    "updated_at": "2025-12-10T11:00:00Z"
  }
}

Error Responses:
- 400: Email and password are required / Email already exists
- 403: Insufficient permissions (USER role)

Accessible by: ADMIN only
Notes:
- Password is hashed with bcryptjs (10 rounds)
- Email must be unique
```

#### Update User
```
PUT /api/users/:id
Authorization: Bearer <access-token>
Content-Type: application/json

Request Body (all fields optional):
{
  "email": "updated@example.com",
  "name": "John Updated",
  "password": "newpassword123",
  "role": "ADMIN",
  "is_active": false
}

Response (200):
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "email": "updated@example.com",
    "name": "John Updated",
    "role": "ADMIN",
    "is_active": false,
    "created_at": "2025-12-10T10:00:00Z",
    "updated_at": "2025-12-10T12:00:00Z"
  }
}

Error Responses:
- 404: User not found
- 400: Email already in use (if email is being changed)
- 403: Insufficient permissions (USER role)

Accessible by: ADMIN only
Notes:
- Only provided fields are updated
- If password is provided, it will be hashed
- Email uniqueness is checked if being updated
- updated_at is automatically updated
```

#### Delete User
```
DELETE /api/users/:id
Authorization: Bearer <access-token>

Response (200):
{
  "success": true,
  "message": "User deleted successfully"
}

Error Responses:
- 404: User not found
- 403: Insufficient permissions (USER role)

Accessible by: ADMIN only
Notes:
- Hard delete (user is permanently removed)
- No soft delete implemented
```

#### Get Current User (Me)
```
GET /api/auth/me
Authorization: Bearer <access-token>

Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "is_active": true,
    "created_at": "2025-12-10T10:00:00Z",
    "updated_at": "2025-12-10T10:00:00Z"
  }
}

Accessible by: USER, ADMIN
Notes:
- Returns currently authenticated user's information
- Password is excluded from response
```

---

## Database Schema

### Technology
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Migration Tool:** Prisma Migrate
- **Schema Location:** `backend/prisma/schema.prisma`

### Tables

#### Users Table (`users`)
```prisma
model User {
  id            Int      @id @default(autoincrement())
  email         String   @unique
  name          String?
  password      String
  role          UserRole @default(USER)
  is_active     Boolean  @default(true)
  refresh_token String?  // Stores current refresh token
  updated_at    DateTime @default(now()) @updatedAt
  created_at    DateTime @default(now())

  @@map("users")
}

enum UserRole {
  ADMIN
  USER
}
```

**Fields:**
- `id`: Auto-incrementing integer primary key
- `email`: Unique email address (used for login)
- `name`: Optional user full name
- `password`: bcrypt hashed password (10 rounds)
- `role`: USER or ADMIN (default: USER)
- `is_active`: Account status (default: true)
- `refresh_token`: Current JWT refresh token (nullable)
- `updated_at`: Auto-updated timestamp
- `created_at`: Record creation timestamp

**Indexes:**
- Primary key on `id`
- Unique index on `email`

---

#### Vehicles Table (`vehicles`)
```prisma
model Vehicle {
  id          Int           @id @default(autoincrement())
  name        String
  status      VehicleStatus @default(ACTIVE)
  fuel_level  Float
  odometer    Float
  latitude    Float
  longitude   Float
  speed       Float
  updated_at  DateTime      @default(now()) @updatedAt
  created_at  DateTime      @default(now())

  @@map("vehicles")
}

enum VehicleStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
}
```

**Fields:**
- `id`: Auto-incrementing integer primary key
- `name`: Vehicle name/identifier
- `status`: ACTIVE, INACTIVE, or MAINTENANCE (default: ACTIVE)
- `fuel_level`: Current fuel percentage (0-100)
- `odometer`: Odometer reading in kilometers
- `latitude`: GPS latitude coordinate
- `longitude`: GPS longitude coordinate
- `speed`: Current speed in km/h
- `updated_at`: Auto-updated timestamp
- `created_at`: Record creation timestamp

**Indexes:**
- Primary key on `id`

---

### Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (GUI)
npm run db:studio

# Create and apply migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

---

## API Documentation

### Swagger/OpenAPI Documentation

The backend includes interactive API documentation using Swagger UI.

**Access:** `http://localhost:5000/api-docs`

**Features:**
- Interactive API testing
- Request/response examples
- Schema definitions
- Authentication support (JWT Bearer token)
- Organized by tags (Authentication, Vehicles, Users)

**Usage:**
1. Start the backend server: `npm run dev`
2. Navigate to `http://localhost:5000/api-docs`
3. Click "Authorize" and enter your JWT token
4. Test endpoints directly from the browser

### Common Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (optional)"
}
```

#### HTTP Status Codes

**200 OK:** Request succeeded
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**201 Created:** Resource created successfully
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": { ... }
}
```

**400 Bad Request:** Invalid input or validation error
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**401 Unauthorized:** Missing or invalid authentication token
```json
{
  "success": false,
  "message": "Access token expired"
}
```

**403 Forbidden:** Insufficient permissions
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

**404 Not Found:** Resource not found
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:** Server error
```json
{
  "success": false,
  "message": "Error fetching users",
  "error": "Database connection failed"
}
```

---

## Environment Variables

### Backend (.env)

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/vehicle_tracker"

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# JWT Secrets (Generate secure random strings for production)
# Generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

**Required Environment Variables:**
- `DATABASE_URL`: PostgreSQL connection string
- `ACCESS_TOKEN_SECRET`: Secret key for signing access tokens
- `REFRESH_TOKEN_SECRET`: Secret key for signing refresh tokens

**Optional Environment Variables:**
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)
- `CLIENT_URL`: Frontend URL for CORS (default: http://localhost:3000)

**Security Notes:**
- Never commit `.env` file to version control
- Use strong, unique secrets for JWT tokens (64+ characters)
- Different secrets for ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET
- In production, use environment variables from hosting provider

---

## Security Requirements

### Frontend Security

1. **Token Storage**
   - Access token: Store in Zustand (memory) + localStorage backup
   - Never store refresh token in localStorage (HTTP-only cookie only)
   - Clear tokens on logout

2. **XSS Prevention**
   - Sanitize user inputs
   - Use React's built-in XSS protection
   - Validate all data with Zod before rendering

3. **CSRF Protection**
   - Use SameSite cookies
   - Validate origin headers
   - Implement CSRF tokens for sensitive operations

4. **Input Validation**
   - Client-side validation with Zod
   - Real-time form validation
   - Display clear error messages

5. **HTTPS Only**
   - Force HTTPS in production
   - Secure cookie flag enabled

### Backend Security

1. **Password Security**
   - bcryptjs with 10 salt rounds
   - Minimum password requirements:
     - 8+ characters
     - 1 uppercase letter
     - 1 lowercase letter
     - 1 number
     - 1 special character

2. **JWT Security**
   - Strong secret key (256-bit minimum)
   - Short access token lifetime (15 minutes)
   - Refresh token rotation
   - Token blacklisting on logout

3. **HTTP Security Headers (Helmet)**
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block
   - Strict-Transport-Security
   - Content-Security-Policy

4. **CORS Configuration**
   - Whitelist specific origins
   - Credentials: true
   - Specific methods allowed

5. **Rate Limiting**
   - Login: 5 attempts per 15 minutes
   - Registration: 3 per hour per IP
   - API calls: 100 per 15 minutes per user

6. **SQL Injection Prevention**
   - Use parameterized queries
   - ORM/Query builder (e.g., Prisma, TypeORM)
   - Input validation

7. **Audit Logging**
   - Log all authentication attempts
   - Log admin actions
   - Log failed authorization attempts

---

## UI/UX Guidelines

### Design System

#### Colors
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6; /* Main brand color */
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Secondary Colors */
--secondary-500: #14b8a6; /* Teal accent */
--secondary-600: #0d9488;

/* Status Colors */
--success: #10b981; /* Green */
--warning: #f59e0b; /* Orange */
--error: #ef4444; /* Red */
--info: #3b82f6; /* Blue */

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-900: #111827;
```

#### Typography
```css
/* Font Family */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### Spacing
```css
/* TailwindCSS spacing scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
```

#### Border Radius
```css
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */
--radius-xl: 1rem;     /* 16px */
--radius-full: 9999px; /* Fully rounded */
```

#### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### Component Guidelines

#### Buttons
```typescript
// Primary button
<button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
  Click me
</button>

// Secondary button
<button className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors">
  Cancel
</button>

// Sizes
- Small: px-3 py-1.5 text-sm
- Medium: px-4 py-2 text-base (default)
- Large: px-6 py-3 text-lg
```

#### Cards
```typescript
<div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
  {/* Card content */}
</div>
```

#### Forms
```typescript
// Input fields
<input 
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
/>

// Error state
<input 
  className="w-full px-4 py-2 border border-error rounded-lg focus:ring-2 focus:ring-error"
/>
<p className="mt-1 text-sm text-error">Error message</p>
```

### Animation Guidelines

#### Framer Motion Variants
```typescript
// Fade in animation
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Slide in from left
const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  }
};

// Stagger children
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Vehicle float animation
const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};
```

#### Page Transitions
```typescript
// Page fade transition
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Page content */}
</motion.div>
```

### Responsive Design

#### Breakpoints
```css
/* TailwindCSS default breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large desktop */
```

#### Mobile-First Approach
```typescript
// Always design for mobile first
<div className="px-4 sm:px-6 md:px-8 lg:px-12">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Responsive grid */}
  </div>
</div>
```

### Accessibility

1. **Keyboard Navigation**
   - All interactive elements keyboard accessible
   - Visible focus indicators
   - Logical tab order

2. **Screen Readers**
   - Semantic HTML elements
   - ARIA labels where needed
   - Alt text for images

3. **Color Contrast**
   - WCAG 2.1 AA minimum (4.5:1 for text)
   - AAA preferred (7:1 for text)

4. **Form Accessibility**
   - Label every input
   - Error messages associated with inputs
   - Clear error states

---

## Development Guidelines

### Backend Setup & Verification

#### Initial Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secrets

# 4. Generate Prisma Client
npm run db:generate

# 5. Push database schema
npm run db:push

# 6. Start development server
npm run dev
```

#### Verify Backend is Running

**Health Check:**
```bash
curl http://localhost:5000/
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Vehicle Tracker API is running",
  "version": "1.0.0",
  "documentation": "http://localhost:5000/api-docs"
}
```

**Test API Documentation:**
- Navigate to `http://localhost:5000/api-docs`
- Should see Swagger UI with all endpoints documented

#### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm run start        # Start production server
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio GUI
```

### Code Style

#### TypeScript (Backend & Frontend)
```typescript
// Use strict mode
"strict": true

// Backend: Use interfaces for data models
interface User {
  id: number;          // Integer in database
  email: string;
  name: string | null; // Nullable fields
  role: 'USER' | 'ADMIN';
}

// Use explicit return types
async function getUser(id: number): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}

// Frontend: Use const for immutable values
const API_URL = import.meta.env.VITE_API_URL;

// Destructure props
const UserCard = ({ user, onClick }: UserCardProps) => {
  // ...
};
```

#### React Best Practices
```typescript
// Use functional components
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // ...
};

// Custom hooks for reusable logic
const useAuth = () => {
  const store = useAuthStore();
  // ...
  return { user, login, logout };
};

// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Use callback for event handlers
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);
```

#### File Naming
```
- Components: PascalCase (UserCard.tsx)
- Hooks: camelCase with 'use' prefix (useAuth.ts)
- Utils: camelCase (formatDate.ts)
- Constants: UPPER_SNAKE_CASE (API_ENDPOINTS.ts)
- Types: PascalCase (User.types.ts)
- Backend Controllers: camelCase + Controller suffix (authController.ts)
- Backend Routes: camelCase + Routes suffix (authRoutes.ts)
```

### Git Workflow

#### Branch Naming
```
- feature/description (e.g., feature/guest-dashboard)
- fix/description (e.g., fix/login-validation)
- refactor/description (e.g., refactor/auth-flow)
- docs/description (e.g., docs/api-documentation)
```

#### Commit Messages
```
Format: <type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

Examples:
- feat(auth): implement JWT refresh token logic
- fix(vehicles): resolve map marker positioning issue
- docs(readme): add installation instructions
```

### Testing Guidelines

#### Unit Tests
```typescript
// Test utilities
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Test components
describe('LoginForm', () => {
  it('should validate email format', () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });
});
```

#### Integration Tests
```typescript
// Test API integration
describe('Auth API', () => {
  it('should login user and return tokens', async () => {
    const response = await authService.login('user@example.com', 'password');
    expect(response.accessToken).toBeDefined();
    expect(response.user).toBeDefined();
  });
});
```

### Performance Optimization

1. **Code Splitting**
   ```typescript
   // Lazy load routes
   const DashboardPage = lazy(() => import('./pages/DashboardPage'));
   const VehiclesPage = lazy(() => import('./pages/VehiclesPage'));
   ```

2. **Image Optimization**
   - Use WebP format
   - Lazy load images
   - Responsive images
   - Compress before upload

3. **Bundle Optimization**
   - Tree shaking
   - Minimize dependencies
   - Code splitting
   - Use production builds

4. **React Optimization**
   - Use React.memo for expensive components
   - Avoid unnecessary re-renders
   - Use useCallback and useMemo
   - Virtual scrolling for long lists

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_MAP_API_KEY=your_leaflet_or_mapbox_key
VITE_ENVIRONMENT=development
```

#### Backend (.env)
```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/vehicle_tracker
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
BCRYPT_ROUNDS=10
```

---

## Implementation Roadmap

### Phase 1: Core Frontend Setup (Week 1)
- [x] Project initialization with Vite + TypeScript
- [x] Install and configure TailwindCSS v4.1.17
- [x] Install dependencies (React Router, Zustand, Axios, etc.)
- [ ] Set up folder structure
- [ ] Configure TypeScript and ESLint
- [ ] Create design system (colors, typography, spacing)
- [ ] Create base UI components (Button, Input, Card, Modal)

### Phase 2: Authentication (Week 1-2)
- [ ] Create auth store (Zustand)
- [ ] Implement auth service (Axios)
- [ ] Build login page
- [ ] Build registration page
- [ ] Implement token refresh logic
- [ ] Create protected route component
- [ ] Add logout functionality
- [ ] Test authentication flow

### Phase 3: Guest Dashboard (Week 2)
- [ ] Design hero section
- [ ] Create vehicle animations (Framer Motion)
- [ ] Build feature highlights section
- [ ] Implement animated statistics
- [ ] Create "How It Works" section
- [ ] Build interactive demo with map
- [ ] Add testimonials carousel
- [ ] Implement responsive design
- [ ] Test animations and performance

### Phase 4: Vehicle Management (Week 3)
- [ ] Create vehicle store (Zustand)
- [ ] Implement vehicle service (Axios)
- [ ] Build vehicle list page
- [ ] Create vehicle card component
- [ ] Implement search and filter
- [ ] Add pagination
- [ ] Build vehicle details page
- [ ] Integrate Leaflet map
- [ ] Show route history

### Phase 5: User Dashboard (Week 3-4)
- [ ] Create dashboard layout
- [ ] Build statistics cards
- [ ] Implement vehicle overview map
- [ ] Create recent activities feed
- [ ] Add quick actions
- [ ] Responsive design
- [ ] Test dashboard functionality

### Phase 6: Admin Features (Week 4)
- [ ] Build vehicle form (create/edit)
- [ ] Implement image upload
- [ ] Add form validation (React Hook Form + Zod)
- [ ] Create delete confirmation modal
- [ ] Build user management page
- [ ] Implement role management
- [ ] Create admin dashboard
- [ ] Add analytics and charts

### Phase 7: Polish & Testing (Week 5)
- [ ] Add loading states everywhere
- [ ] Implement error handling
- [ ] Add toast notifications
- [ ] Create 404 page
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Write documentation

### Phase 8: Deployment (Week 6)
- [ ] Environment configuration
- [ ] Build optimization
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Deploy backend (Railway/Render)
- [ ] Set up CI/CD pipeline
- [ ] Configure domain
- [ ] SSL certificates
- [ ] Monitoring setup

---

## Success Metrics

### Technical Metrics
- **Performance:**
  - First Contentful Paint: < 1.5s
  - Time to Interactive: < 3.5s
  - Lighthouse Score: > 90

- **Security:**
  - Zero critical vulnerabilities
  - All dependencies up-to-date
  - Security headers properly configured

- **Code Quality:**
  - Test coverage: > 80%
  - Zero ESLint errors
  - TypeScript strict mode: enabled

### User Metrics
- **Engagement:**
  - Guest-to-signup conversion: > 10%
  - Daily active users: Track growth
  - Average session duration: > 5 minutes

- **Performance:**
  - Page load time: < 2 seconds
  - API response time: < 500ms
  - Uptime: > 99.5%

---

## Troubleshooting & FAQs

### Common Issues

#### Token Refresh Not Working
**Problem:** Access token expires but refresh doesn't trigger  
**Solution:**
1. Check Axios interceptor configuration
2. Verify refresh token cookie is being sent
3. Check backend refresh endpoint logs
4. Ensure CORS credentials: true

#### Map Not Displaying
**Problem:** Leaflet map shows blank or doesn't render  
**Solution:**
1. Import Leaflet CSS in main file
2. Check map container has height set
3. Verify latitude/longitude values
4. Check browser console for errors

#### Authentication State Lost on Refresh
**Problem:** User logged out when page refreshes  
**Solution:**
1. Store access token in localStorage
2. Implement token check on app load
3. Call /api/auth/me to verify token
4. Restore auth state in Zustand

#### CORS Errors
**Problem:** API requests blocked by CORS  
**Solution:**
1. Add frontend URL to CORS whitelist
2. Set credentials: true in Axios
3. Check CORS_ORIGIN environment variable
4. Ensure cookies are being sent

---

## Additional Resources

### Documentation Links
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS v4 Docs](https://tailwindcss.com/docs)
- [Zustand Guide](https://docs.pmnd.rs/zustand/)
- [React Router](https://reactrouter.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Leaflet](https://react-leaflet.js.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

### Design Resources
- [Lucide Icons](https://lucide.dev/)
- [TailwindUI Components](https://tailwindui.com/)
- [Heroicons](https://heroicons.com/)
- [Unsplash (Free Images)](https://unsplash.com/)

### Learning Resources
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [OWASP Security Guidelines](https://owasp.org/)
- [React Performance](https://react.dev/learn/render-and-commit)

---

## Contact & Support

**Project Owner:** rendybp  
**Repository:** rendybp/vehicle-tracker  
**Last Updated:** 2025-12-10

For questions or issues, please create an issue in the GitHub repository.

---

## Appendix

### Type Definitions

```typescript
// auth.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  active: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

// vehicle.types.ts
export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  status: 'active' | 'idle' | 'maintenance';
  location: Location;
  imageUrl?: string;
  lastUpdated: string;
  createdAt: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface VehicleFormData {
  name: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  status: 'active' | 'idle' | 'maintenance';
  location: Location;
}

export interface TrackingPoint {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

// api.types.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### Validation Schemas

```typescript
// validators.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const vehicleSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  make: z.string().min(2, 'Make is required'),
  model: z.string().min(2, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().length(17, 'VIN must be exactly 17 characters'),
  licensePlate: z.string().min(3, 'License plate is required'),
  status: z.enum(['active', 'idle', 'maintenance']),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});
```

---

**End of Technical Documentation & PRD**

This document serves as the single source of truth for the Vehicle Tracker project. All development decisions and implementations should reference this document. Updates should be made as the project evolves.