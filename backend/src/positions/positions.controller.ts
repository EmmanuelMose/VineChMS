import { Request, Response } from "express";
import {
  createPositionService,
  getPositionsService,
  getPositionByIdService,
  updatePositionService,
  deletePositionService,
} from "./positions.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createPosition = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createPositionService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPositions = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getPositionsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPositionById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getPositionByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updatePosition = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updatePositionService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePosition = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deletePositionService(id);
    res.json({ success: true, message: "Position deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};