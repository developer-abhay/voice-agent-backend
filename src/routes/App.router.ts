import express from "express";
import {
  changePassword,
  logout,
  signin,
  signup,
  verifyUser,
} from "../controllers/Auth_";
import { verifyCookies } from "../middlewares/Auth";
import { getCallDetails } from '../controllers/Calls';

export const appRouter = express.Router();

appRouter.get("/", (req, res) => {
  res.send('Hello User')
});

appRouter.post("/signup", signup);
appRouter.post("/signin", signin);

appRouter.use(verifyCookies) // Verify Token Middleware for proetected routes

appRouter.post("/change-password", changePassword);
appRouter.get("/verify-token", verifyUser);
appRouter.post('/logout', logout);

// Fetch call details
appRouter.get('/calldetails/:clientId', getCallDetails)
