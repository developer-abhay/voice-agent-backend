import { Client } from "../types/Types";

export const validateClientInput = (
  type: "signin" | "signup",
  client: Partial<Client>,
) => {
  if (type == "signup" && !client.name) {
    throw new Error("Missing required fields: Name.");
  }
  if (!client.email) {
    throw new Error("Missing required fields: Email.");
  }
  if (!client.password) {
    throw new Error("Missing required fields: Password.");
  }
  return true;
};
