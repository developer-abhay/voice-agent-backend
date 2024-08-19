import { Request, Response } from "express";
import { User } from "../types/types";
import { dynamoClient, Table_Name } from "../db/dynamo";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req: Request, res: Response) => {
  const user: User = req.body;

  if (!user.email || !user.password || !user.name) {
    return res.json({ message: "Enter Valid inputs" });
  }

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
    user.createdAt = new Date().toISOString();

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

export const signin = async (req: Request, res: Response) => {
  const user: User = req.body;

  if (!user.email || !user.password) {
    return res.json({ message: "Enter Valid inputs" });
  }

  const params = {
    TableName: Table_Name,
    FilterExpression: "email = :email and password = :password",
    ExpressionAttributeValues: {
      ":email": user.email,
      ":password": user.password,
    },
  };

  try {
    const response = await dynamoClient.scan(params).promise();

    if (response.Items && response.Items?.length == 1) {
      const userId = response.Items[0].id;
      const token = jwt.sign({ userId }, process.env.JWT_SECRET as string);

      res.json({ token });
    } else {
      res.json({ message: "User doesn't exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
