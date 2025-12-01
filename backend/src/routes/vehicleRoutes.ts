import express from "express";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 */
router.get("/", verifyToken, getVehicles);
router.post("/", verifyToken, isAdmin, createVehicle);
router.put("/:id", verifyToken, isAdmin, updateVehicle);
router.delete("/:id", verifyToken, isAdmin, deleteVehicle);

export default router;
