import { Request, Response } from "express";
import { User } from "../types/types";
import { dynamoClient } from "../db/dynamo";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req: Request, res: Response) => {
  const user: User = req.body;

  const Table_Name: string = "voiceAgentUserTable";

  const scanParams = {
    TableName: Table_Name,
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": user.email,
    },
  };

  try {
    const response = await dynamoClient.scan(scanParams).promise();

    if (response.Count && response.Count > 0) {
      return res.json({ error: "user already exists" });
    }

    user.id = uuidv4();
    user.createdAt = new Date();

    const params = {
      TableName: Table_Name,
      Item: user,
    };

    await dynamoClient.put(params).promise();

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signin = (req: Request, res: Response) => {
  res.json({ message: "Sign In Route" });
};
