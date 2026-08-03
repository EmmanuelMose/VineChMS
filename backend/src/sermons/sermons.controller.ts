import { Request, Response } from "express";
import {
  createSermonService,
  getSermonsService,
  getSermonByIdService,
  updateSermonService,
  deleteSermonService,
  getSermonsByChurchService,
} from "./sermons.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createSermon = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createSermonService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSermons = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getSermonsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSermonById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getSermonByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateSermon = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateSermonService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSermon = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteSermonService(id);
    res.json({ success: true, message: "Sermon deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSermonsByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getSermonsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};