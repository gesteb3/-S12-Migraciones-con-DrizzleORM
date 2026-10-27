import { Router } from "express";
import {
  createDevice,
  deleteDevice,
  getDeviceById,
  listDevices,
  updateDevice,
} from "../controllers/device.controller.js";

export const deviceRouter = Router();

deviceRouter.get("/", listDevices);
deviceRouter.get("/:id", getDeviceById);
deviceRouter.post("/", createDevice);
deviceRouter.put("/:id", updateDevice);
deviceRouter.delete("/:id", deleteDevice);

