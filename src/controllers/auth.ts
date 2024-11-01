import { Request, Response } from "express";
import { User } from "../types/types";
import { createUser, findUserByEmail } from "../db/dynamo";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { validateUserInput } from "../utils/validation";
import { generateToken } from "../utils/authUtils";
dotenv.config();

// SignUp Handler
export const signup = async (req: Request, res: Response) => {
  const { email, password, name, clientId } = req.body;

  try {
    // Validate User inputs
    validateUserInput("signup", { email, password, name, clientId });

    // Check if user with email already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(409).json({ error: "User Already Exists" });
      return;
    }

    //  Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = {
      _id: uuidv4(),
      clientId,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createUser(user);

    res.status(200).json({ message: "User registered Successfully" });
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
    // Validate User inputs
    validateUserInput("signin", { email, password });

    // Find user by email
    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      res.status(404).json({ message: "User doesn't exist" });
      return;
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token and set in cookies
    const token = generateToken(existingUser._id);

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
