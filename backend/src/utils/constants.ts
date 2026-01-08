import { CookieOptions } from "express";
import bcrypt from "bcryptjs";

/**
 * Cookie configuration for refresh tokens.
 * Uses SameSite=None + Secure for cross-origin support.
 * Works on both localhost (secure context) and production (HTTPS).
 */
export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

/**
 * Password policy: Minimum 8 characters, at least one uppercase letter,
 * one lowercase letter, one number, and one special character.
 */
export const PASSWORD_POLICY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const PASSWORD_POLICY_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";

/**
 * RFC 5322 compliant email validation regex.
 */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Hash a password using bcrypt with salt rounds of 10.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

/**
 * Validate email format.
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validate password against policy.
 */
export const isValidPassword = (password: string): boolean => {
  return PASSWORD_POLICY_REGEX.test(password);
};

/**
 * Sanitize error messages for production.
 * Hides internal details in production environment.
 */
export const sanitizeError = (error: unknown): string => {
  if (process.env.NODE_ENV === "production") {
    return "An unexpected error occurred";
  }
  return error instanceof Error ? error.message : "Unknown error";
};

/**
 * Type for user profile update data.
 */
export interface ProfileUpdateData {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * Type for admin user update data.
 * Note: For Prisma compatibility, role uses the generated UserRole type.
 * Import UserRole from "@prisma/client" when using this interface.
 */
export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "USER"; // Matches Prisma UserRole enum
  is_active?: boolean;
}
