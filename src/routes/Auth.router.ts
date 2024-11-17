import express from "express";
import {
  changePassword,
  signin,
  signup,
  verifyUser,
} from "../controllers/Auth";
import { verifyCookies } from "../middlewares/Auth";

export const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.send("Hello World");
});

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);

// authRouter.use(verifyCookies)
authRouter.post("/change-password", changePassword);
authRouter.get("/verify-token", verifyCookies, verifyUser);
