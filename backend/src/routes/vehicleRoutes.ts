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

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management endpoints (CRUD operations)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Vehicle ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Vehicle name/model
 *           example: Toyota Avanza
 *         fuel_level:
 *           type: number
 *           format: float
 *           description: Current fuel level (percentage)
 *           minimum: 0
 *           maximum: 100
 *           example: 75.5
 *         odometer:
 *           type: number
 *           format: float
 *           description: Odometer reading (km)
 *           minimum: 0
 *           example: 15000
 *         latitude:
 *           type: number
 *           format: double
 *           description: Current latitude position
 *           example: -6.2088
 *         longitude:
 *           type: number
 *           format: double
 *           description: Current longitude position
 *           example: 106.8456
 *         speed:
 *           type: number
 *           format: float
 *           description: Current speed (km/h)
 *           minimum: 0
 *           example: 60
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, MAINTENANCE]
 *           description: Vehicle operational status
 *           example: ACTIVE
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Record creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     CreateVehicleRequest:
 *       type: object
 *       required:
 *         - name
 *         - fuel_level
 *         - odometer
 *         - latitude
 *         - longitude
 *         - speed
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           example: Toyota Avanza
 *         fuel_level:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           example: 75.5
 *         odometer:
 *           type: number
 *           format: float
 *           minimum: 0
 *           example: 15000
 *         latitude:
 *           type: number
 *           format: double
 *           example: -6.2088
 *         longitude:
 *           type: number
 *           format: double
 *           example: 106.8456
 *         speed:
 *           type: number
 *           format: float
 *           minimum: 0
 *           example: 60
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, MAINTENANCE]
 *           example: ACTIVE
 *     
 *     UpdateVehicleRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Toyota Avanza Updated
 *         fuel_level:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           example: 80.0
 *         odometer:
 *           type: number
 *           format: float
 *           minimum: 0
 *           example: 15500
 *         latitude:
 *           type: number
 *           format: double
 *           example: -6.2100
 *         longitude:
 *           type: number
 *           format: double
 *           example: 106.8500
 *         speed:
 *           type: number
 *           format: float
 *           minimum: 0
 *           example: 65
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, MAINTENANCE]
 *           example: ACTIVE
 *     
 *     VehicleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Vehicle retrieved successfully
 *         data:
 *           $ref: '#/components/schemas/Vehicle'
 *     
 *     VehiclesListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Vehicles retrieved successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Vehicle'
 */

// All routes require authentication
router.use(verifyToken);

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     description: Retrieve a list of all vehicles. Accessible by both USER and ADMIN roles.
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehiclesListResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getAllVehicles);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     description: Retrieve details of a specific vehicle by its ID. Accessible by both USER and ADMIN roles.
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *       400:
 *         description: Bad request - Invalid vehicle ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Vehicle not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", getVehicleById);

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create new vehicle
 *     description: Create a new vehicle record. Only accessible by ADMIN role.
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVehicleRequest'
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *             example:
 *               success: true
 *               message: Vehicle created successfully
 *               data:
 *                 id: 1
 *                 name: Toyota Avanza
 *                 fuel_level: 75.5
 *                 odometer: 15000
 *                 latitude: -6.2088
 *                 longitude: 106.8456
 *                 speed: 60
 *                 status: ACTIVE
 *       400:
 *         description: Bad request - Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions (USER role cannot create vehicles)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Insufficient permissions
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", checkRole("ADMIN"), createVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update vehicle
 *     description: Update an existing vehicle's information. Only accessible by ADMIN role.
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVehicleRequest'
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *             example:
 *               success: true
 *               message: Vehicle updated successfully
 *               data:
 *                 id: 1
 *                 name: Toyota Avanza Updated
 *                 fuel_level: 80.0
 *                 odometer: 15500
 *                 latitude: -6.2100
 *                 longitude: 106.8500
 *                 speed: 65
 *                 status: ACTIVE
 *       400:
 *         description: Bad request - Invalid vehicle ID or data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", checkRole("ADMIN"), updateVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete vehicle
 *     description: Delete a vehicle from the system. Only accessible by ADMIN role.
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: Vehicle deleted successfully
 *       400:
 *         description: Bad request - Invalid vehicle ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", checkRole("ADMIN"), deleteVehicle);

export default router;
