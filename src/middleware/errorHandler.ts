import type { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  status?: number;
}

// errorHandler is an Express middleware function that catches errors thrown in the route handlers and sends a JSON response with the error message and appropriate HTTP status code. It also logs the error to the console for debugging purposes.
export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (res.headersSent) {
    return;
  }

  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  res
    .status(status)
    .json({ error: err.message || "An unexpected error occurred." });
}
