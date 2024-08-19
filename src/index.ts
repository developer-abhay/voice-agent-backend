import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1", authRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
