import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export const getVehicles = async (req: Request, res: Response) => {
  const vehicles = await prisma.vehicle.findMany();
  res.json(vehicles);
};

export const createVehicle = async (req: Request, res: Response) => {
  const { name, status, fuel_level, odometer, latitude, longitude, speed } = req.body;
  const vehicle = await prisma.vehicle.create({
    data: { name, status, fuel_level, odometer, latitude, longitude, speed },
  });
  res.json(vehicle);
};

export const updateVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status, fuel_level, odometer, latitude, longitude, speed } = req.body;
  const vehicle = await prisma.vehicle.update({
    where: { id: Number(id) },
    data: { name, status, fuel_level, odometer, latitude, longitude, speed },
  });
  res.json(vehicle);
};

export const deleteVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.vehicle.delete({ where: { id: Number(id) } });
  res.json({ message: "Vehicle deleted" });
};
