import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  getCurrentUser,
} from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// POST /api/auth/register - Register new user
router.post("/register", register);

// POST /api/auth/login - Login user
router.post("/login", login);

// POST /api/auth/logout - Logout user
router.post("/logout", logout);

// POST /api/auth/refresh - Refresh access token
router.post("/refresh", refresh);

// GET /api/auth/me - Get current user (requires authentication)
router.get("/me", verifyToken, getCurrentUser);

export default router;
