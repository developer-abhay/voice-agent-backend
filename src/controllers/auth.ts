import { NextFunction, Request, Response } from "express";
import { createClient, findClientByEmail, findClientById } from "../db/Dynamo";
import { Client, CustomRequest } from "../types/Types";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateToken } from "../utils/AuthUtils";
import { validateClientInput } from "../utils/Validation";
dotenv.config();

// SignUp Handler
export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    // Validate client inputs
    validateClientInput("signup", { email, password, name });

    // Check if client with email already exists
    const existingClient = await findClientByEmail(email);

    if (existingClient) {
      res.status(409).json({ message: "User Already Exists" });
      return;
    }

    //  Create a new client
    const hashedPassword = await bcrypt.hash(password, 10);

    const client: Client = {
      clientId: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createClient(client);

    res.status(200).json({ message: "Client registered Successfully" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error during signup: ", err.message);
      res.status(500).json({ message: err.message });
    } else {
      console.error("Unexpected error during signup: ", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

// SignIn Handler
export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Validate client inputs
    validateClientInput("signin", { email, password });

    // Find client by email
    const existingClient = await findClientByEmail(email);

    if (!existingClient) {
      res
        .status(404)
        .json({ message: "User doesn't exist. Please register first." });
      return;
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      password,
      existingClient.password,
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token and set in cookies
    const token = generateToken(existingClient.clientId);

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res
      .status(200)
      .json({
        message: "Sign in successful",
        user: { name: existingClient.name, email: existingClient.email },
      });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error during signup: ", err.message);
      res.status(500).json({ message: err.message });
    } else {
      console.error("Unexpected error during signup: ", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

// Change password
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //  Method 1
  console.log("Verify old password");
  console.log("Change password");

  // Method 2
  console.log("Send otp to verified email");
  console.log("verify otp");
  console.log("change password");
  try {
    throw new Error("testing");
    res.status(200).json({ message: "Password changes successfully" });
  } catch (error: unknown) {
    return next(error);
  }
};

// Verified User
export const verifyUser = async (req: CustomRequest, res: Response) => {
  const verifiedUserId = req.verifiedUserId;

  if (verifiedUserId) {
    const user = await findClientById(verifiedUserId);

    if (user) {
      res
        .status(200)
        .json({ valid: true, user: { name: user.name, email: user.email } });
      return;
    }
  }

  res.status(401).json({ valid: false, message: "Unauthorized" });
};
