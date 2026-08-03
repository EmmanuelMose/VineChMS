import { Request, Response } from "express";
import {
  createLeaderService,
  getLeadersService,
  getLeaderByIdService,
  updateLeaderService,
  deleteLeaderService,
  approveLeaderService,
} from "./leaders.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createLeader = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createLeaderService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLeaders = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getLeadersService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLeaderById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getLeaderByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateLeader = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateLeaderService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteLeader = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteLeaderService(id);
    res.json({ success: true, message: "Leader deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const approveLeader = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const result = await approveLeaderService(id, userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};