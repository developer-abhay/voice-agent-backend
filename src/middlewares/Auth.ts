import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Client, CustomRequest } from "../types/Types";

dotenv.config();

export const verifyCookies = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const { clientId } = jwt.verify(token, process.env.JWT_SECRET) as Client;

    req.verifiedUserId = clientId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};
