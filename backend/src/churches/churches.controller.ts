import { Request, Response } from "express";
import {
  createChurchService,
  getChurchesService,
  getChurchByIdService,
  updateChurchService,
  deleteChurchService,
  getChurchMembersService,
} from "./churches.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createChurch = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await createChurchService(userId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getChurches = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getChurchesService(req.user!.userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getChurchById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getChurchByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateChurch = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateChurchService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteChurch = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteChurchService(id);
    res.json({ success: true, message: "Church deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getChurchMembers = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getChurchMembersService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};