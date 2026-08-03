import { Request, Response } from "express";
import {
  createGivingService,
  getGivingService,
  getGivingByIdService,
  updateGivingService,
  deleteGivingService,
  getGivingByMemberService,
  getGivingByChurchService,
  getGivingSummaryService,
} from "./giving.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createGiving = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createGivingService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGiving = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getGivingService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getGivingByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateGiving = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateGivingService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteGiving = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteGivingService(id);
    res.json({ success: true, message: "Giving record deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingByMember = async (req: Request, res: Response) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const result = await getGivingByMemberService(memberId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getGivingByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingSummary = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getGivingSummaryService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};