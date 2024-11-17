import AWS from "aws-sdk";
import dotenv from "dotenv";
import { Client } from "../types/Types";
import { Client_Table_Name } from "../config/Constants";

dotenv.config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();

// Find a client by clientId
const findClientById = async (clientId: string): Promise<Client | null> => {
  const params = {
    TableName: Client_Table_Name,
    Key: {
      clientId,
    },
  };

  try {
    const response = await dynamoClient.get(params).promise();

    return response.Item ? (response.Item as Client) : null;
  } catch (error) {
    console.error(error);
    throw new Error("Error while searching client by Id");
  }
};

// Find a client by email
const findClientByEmail = async (email: string): Promise<Client | null> => {
  const params = {
    TableName: Client_Table_Name,
    FilterExpression: "email = :email",
    ExpressionAttributeValues: { ":email": email },
  };

  try {
    const response = await dynamoClient.scan(params).promise();

    return response.Count && response.Count! > 0
      ? (response.Items![0] as Client)
      : null;
  } catch (error) {
    console.log(error);
    throw new Error("Error while searching Client by email");
  }
};

// Create a new client
const createClient = async (client: Client): Promise<void> => {
  const params = { TableName: Client_Table_Name, Item: client };

  try {
    await dynamoClient.put(params).promise();
  } catch {
    throw new Error("Error while Creating a newClient in dynamoDB");
  }
};

export { findClientById, findClientByEmail, createClient };
