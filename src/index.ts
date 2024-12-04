import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { appRouter } from "./routes/App.router";
import { errorHandler } from "./middlewares/ErrorHandler_";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ["https://echobot.abhay.website"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", appRouter);
app.use(errorHandler);

const port = process.env.BACKEND_PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
