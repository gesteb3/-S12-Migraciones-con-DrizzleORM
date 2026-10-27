import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { devices } from "../db/schema.js";
import {
  createDeviceSchema,
  deviceIdSchema,
  updateDeviceSchema,
} from "../schemas/device.schema.js";

export async function listDevices(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await db.select().from(devices).orderBy(devices.createdAt);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getDeviceById(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = deviceIdSchema.parse(request.params.id);
    const [device] = await db.select().from(devices).where(eq(devices.id, id));

    if (!device) {
      response.status(404).json({ message: "Device not found" });
      return;
    }

    response.status(200).json(device);
  } catch (error) {
    next(error);
  }
}

export async function createDevice(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const payload = createDeviceSchema.parse(request.body);
    const [device] = await db.insert(devices).values(payload).returning();
    response.status(201).json(device);
  } catch (error) {
    next(error);
  }
}

export async function updateDevice(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = deviceIdSchema.parse(request.params.id);
    const payload = updateDeviceSchema.parse(request.body);
    const [device] = await db
      .update(devices)
      .set(payload)
      .where(eq(devices.id, id))
      .returning();

    if (!device) {
      response.status(404).json({ message: "Device not found" });
      return;
    }

    response.status(200).json(device);
  } catch (error) {
    next(error);
  }
}

export async function deleteDevice(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = deviceIdSchema.parse(request.params.id);
    const [device] = await db
      .delete(devices)
      .where(eq(devices.id, id))
      .returning();

    if (!device) {
      response.status(404).json({ message: "Device not found" });
      return;
    }

    response.status(200).json({ message: "Device deleted", device });
  } catch (error) {
    next(error);
  }
}

