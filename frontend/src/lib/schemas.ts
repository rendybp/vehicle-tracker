import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
        ),
        confirmPassword: z.string(),
        role: z.enum(["USER", "ADMIN"]).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const vehicleSchema = z.object({
    name: z.string().min(2, "Vehicle name is required"),
    status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]),
    fuel_level: z.coerce.number().min(0).max(100),
    odometer: z.coerce.number().min(0),
    speed: z.coerce.number().min(0),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VehicleFormData = z.infer<typeof vehicleSchema>;
