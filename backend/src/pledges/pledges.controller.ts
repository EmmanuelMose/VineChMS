import { Request, Response } from "express";
import {
  createPledgeService,
  getPledgesService,
  getPledgeByIdService,
  getPledgesByMemberService,
  getPledgesByChurchService,
  getPledgesByCategoryService,
  getFulfilledPledgesService,
  getUnfulfilledPledgesService,
  updatePledgeService,
  deletePledgeService,
  fulfillPledgeService,
  getPledgesSummaryService,
} from "./pledges.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createPledge = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createPledgeService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPledges = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getPledgesService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPledgeById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getPledgeByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getPledgesByMember = async (req: Request, res: Response) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const result = await getPledgesByMemberService(memberId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPledgesByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getPledgesByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPledgesByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const result = await getPledgesByCategoryService(categoryId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getFulfilledPledges = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getFulfilledPledgesService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUnfulfilledPledges = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getUnfulfilledPledgesService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePledge = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updatePledgeService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePledge = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deletePledgeService(id);
    res.json({ success: true, message: "Pledge deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const fulfillPledge = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await fulfillPledgeService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPledgesSummary = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getPledgesSummaryService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};