import { Request, Response } from "express";
import { User } from "../types/types";
import { dynamoClient, Table_Name } from "../db/dynamo";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// SignUp Handler
export const signup = async (req: Request, res: Response) => {
  const user: User = req.body;

  if (!user.email || !user.password || !user.name) {
    res.status(400).json({ message: "Enter Valid inputs" });
    return;
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
      res.status(409).json({ error: "user already exists" });
      return;
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
      process.env.JWT_SECRET as string,
      { expiresIn: 3600 },
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during signup: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// SignIn Handler
export const signin = async (req: Request, res: Response) => {
  const user: User = req.body;

  if (!user.email || !user.password) {
    res.status(400).json({ message: "Enter Valid inputs" });
    return;
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
      const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: 3600,
      });

      res.status(200).json({ token });
      return;
    } else {
      res.status(404).json({ message: "User doesn't exist" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
