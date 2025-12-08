import { Router } from "express";
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController";
import { verifyToken, checkRole } from "../middlewares/authMiddleware";

const router = Router();

// All routes require authentication
router.use(verifyToken);

// GET /api/vehicles - Get all vehicles (USER and ADMIN)
router.get("/", getAllVehicles);

// GET /api/vehicles/:id - Get vehicle by ID (USER and ADMIN)
router.get("/:id", getVehicleById);

// POST /api/vehicles - Create new vehicle (ADMIN only)
router.post("/", checkRole("ADMIN"), createVehicle);

// PUT /api/vehicles/:id - Update vehicle (ADMIN only)
router.put("/:id", checkRole("ADMIN"), updateVehicle);

// DELETE /api/vehicles/:id - Delete vehicle (ADMIN only)
router.delete("/:id", checkRole("ADMIN"), deleteVehicle);

export default router;
