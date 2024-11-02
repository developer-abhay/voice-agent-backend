import express from "express";
import { signin, signup } from "../controllers/Auth";

export const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.send("Hello World");
});
authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
