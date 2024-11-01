import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction
) => {
  if (err instanceof Error) {
    console.error(err.stack);
    res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  } else {
    console.error("Unexpected error:", err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
