import { Router } from "express";
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController";

const router = Router();

// GET /api/vehicles - Get all vehicles
router.get("/", getAllVehicles);

// GET /api/vehicles/:id - Get vehicle by ID
router.get("/:id", getVehicleById);

// POST /api/vehicles - Create new vehicle
router.post("/", createVehicle);

// PUT /api/vehicles/:id - Update vehicle
router.put("/:id", updateVehicle);

// DELETE /api/vehicles/:id - Delete vehicle
router.delete("/:id", deleteVehicle);

export default router;
