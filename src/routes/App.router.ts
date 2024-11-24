import path from 'path'
import express from "express";
import {
  changePassword,
  signin,
  signup,
  verifyUser,
} from "../controllers/Auth_";
import { verifyCookies } from "../middlewares/Auth";
import { getCallDetails } from '../controllers/Calls';

export const appRouter = express.Router();

appRouter.post("/signup", signup);
appRouter.post("/signin", signin);

appRouter.use(verifyCookies) // Verify Token Middleware for proetected routes

appRouter.post("/change-password", changePassword);
appRouter.get("/verify-token", verifyUser);

// Fetch call details
appRouter.get('/calldetails/:clientId', getCallDetails)
