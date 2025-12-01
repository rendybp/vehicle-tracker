import express from "express";
import { register, login, getUsers } from "../controllers/userController";

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 * /api/users/login:
 *   post:
 *     summary: Login user
 */

router.post("/register", register);
router.post("/login", login);
router.get("/", getUsers); // contoh: list user untuk admin

export default router;
