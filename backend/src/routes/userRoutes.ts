import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { verifyToken, checkRole } from "../middlewares/authMiddleware";

const router = Router();

// All user routes require authentication and ADMIN role
router.use(verifyToken, checkRole("ADMIN"));

// GET /api/users - Get all users (ADMIN only)
router.get("/", getAllUsers);

// GET /api/users/:id - Get user by ID (ADMIN only)
router.get("/:id", getUserById);

// POST /api/users - Create new user (ADMIN only)
router.post("/", createUser);

// PUT /api/users/:id - Update user (ADMIN only)
router.put("/:id", updateUser);

// DELETE /api/users/:id - Delete user (ADMIN only)
router.delete("/:id", deleteUser);

export default router;
