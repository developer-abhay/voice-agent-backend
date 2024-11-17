import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  if (err instanceof Error) {
    console.error("1");
    console.error(err.stack);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  } else {
    console.error("Unexpected error:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
