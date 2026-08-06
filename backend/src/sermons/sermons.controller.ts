import { Request, Response } from "express";
import {
  createSermonService,
  getSermonByIdService,
  getSermonsByChurchService,
  updateSermonService,
  deleteSermonService,
} from "./sermons.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createSermon = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createSermonService({ ...req.body, churchId });
    res.status(201).json({ success: true, data: result, message: "Sermon created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create sermon" });
  }
};

export const getSermons = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getSermonsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch sermons" });
  }
};

export const getSermonById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getSermonByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Sermon not found" });
  }
};

export const updateSermon = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getSermonByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updateSermonService(id, req.body);
    res.json({ success: true, data: result, message: "Sermon updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update sermon" });
  }
};

export const deleteSermon = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getSermonByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteSermonService(id);
    res.json({ success: true, message: "Sermon deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete sermon" });
  }
};