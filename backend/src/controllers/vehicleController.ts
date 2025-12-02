import { Request, Response } from "express";
import prisma from "../config/database";

// Get all vehicles
export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    res.json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching vehicles",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get vehicle by ID
export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: Number(id) },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching vehicle",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create new vehicle
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const { name, fuel_level, odometer, latitude, longitude, speed, status } = req.body;

    // Basic validation
    if (!name || fuel_level === undefined || odometer === undefined || 
        latitude === undefined || longitude === undefined || speed === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, fuel_level, odometer, latitude, longitude, speed",
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        fuel_level: parseFloat(fuel_level),
        odometer: parseFloat(odometer),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        speed: parseFloat(speed),
        status: status || "ACTIVE",
      },
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating vehicle",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update vehicle
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, fuel_level, odometer, latitude, longitude, speed, status } = req.body;

    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id: Number(id) },
    });

    if (!existingVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(fuel_level !== undefined && { fuel_level: parseFloat(fuel_level) }),
        ...(odometer !== undefined && { odometer: parseFloat(odometer) }),
        ...(latitude !== undefined && { latitude: parseFloat(latitude) }),
        ...(longitude !== undefined && { longitude: parseFloat(longitude) }),
        ...(speed !== undefined && { speed: parseFloat(speed) }),
        ...(status && { status }),
      },
    });

    res.json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating vehicle",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete vehicle
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id: Number(id) },
    });

    if (!existingVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    await prisma.vehicle.delete({
      where: { id: Number(id) },
    });

    res.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting vehicle",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
