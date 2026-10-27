import { z } from "zod";

const deviceFields = {
  name: z.string().trim().min(1).max(120),
  deviceType: z.string().trim().min(1).max(80),
  ipAddress: z.union([z.ipv4(), z.ipv6()]),
  status: z.enum(["online", "offline", "maintenance"]),
  location: z.string().trim().min(1).max(160).nullable().optional(),
  macAddress: z
    .string()
    .trim()
    .regex(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, "Invalid MAC address")
    .transform((value) => value.toUpperCase())
    .nullable()
    .optional(),
  lastPing: z.coerce.date().nullable().optional(),
};

export const createDeviceSchema = z.object(deviceFields).strict();

export const updateDeviceSchema = z
  .object(deviceFields)
  .partial()
  .strict()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required",
  });

export const deviceIdSchema = z.uuid();

export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;

