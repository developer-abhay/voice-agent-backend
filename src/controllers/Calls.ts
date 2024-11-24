import { Request, Response } from "express";
import { fetchCallsByClientId } from "../db/Dynamo_";

export const getCallDetails = async (req: Request, res: Response) => {
    const clientId = req.params.clientId as string;
    const callDetailsArray = await fetchCallsByClientId(clientId)
    res.json({ data: callDetailsArray })
}