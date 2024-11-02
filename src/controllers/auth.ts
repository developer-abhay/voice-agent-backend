import { Request, Response } from "express";
import { Client } from "../types/Types";
import { createClient, findClientByEmail } from "../db/Dynamo";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { validateClientInput } from "../utils/Validation";
import { generateToken } from "../utils/AuthUtils";
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
      res.status(409).json({ error: "Client Already Exists" });
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
      res.status(500).json({ error: err.message });
    } else {
      console.error("Unexpected error during signup: ", err);
      res.status(500).json({ error: "Internal Server Error" });
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
      res.status(404).json({ message: "Client doesn't exist" });
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

    res.cookie("access-token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: "Sign in successful" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error during signup: ", err.message);
      res.status(500).json({ error: err.message });
    } else {
      console.error("Unexpected error during signup: ", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
