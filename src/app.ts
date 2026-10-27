import express from "express";
import { ZodError } from "zod";
import { deviceRouter } from "./routes/device.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/api/devices", deviceRouter);

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    if (error instanceof ZodError) {
      response.status(400).json({
        message: "Invalid request data",
        errors: error.issues,
      });
      return;
    }

    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  },
);

