import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/Auth.router";
import { errorHandler } from "./middlewares/ErrorHandler_";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"], // Specify allowed origins (or use '*' for all origins)
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRouter);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
