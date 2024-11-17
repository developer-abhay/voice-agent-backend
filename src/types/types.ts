import { Request } from "express";

export type Client = {
  clientId: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export interface CustomRequest extends Request {
  verifiedUser?: { name: string, email: string };
}