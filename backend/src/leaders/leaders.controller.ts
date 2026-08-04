import { Request, Response } from "express";
import {
  createLeaderService,
  getLeadersService,
  getLeaderByIdService,
  getLeadersByMemberService,
  getLeadersByPositionService,
  getLeadersByChurchService,
  updateLeaderService,
  deleteLeaderService,
  hardDeleteLeaderService,
  approveLeaderService,
  revokeApprovalService,
  getActiveLeadersService,
  getApprovedLeadersService,
  getLeadersSummaryService,
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

export const getLeadersByMember = async (req: Request, res: Response) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const result = await getLeadersByMemberService(memberId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLeadersByPosition = async (req: Request, res: Response) => {
  try {
    const positionId = parseInt(req.params.positionId);
    const result = await getLeadersByPositionService(positionId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLeadersByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getLeadersByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
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
    res.json({ success: true, message: "Leader deactivated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const hardDeleteLeader = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await hardDeleteLeaderService(id);
    res.json({ success: true, message: "Leader permanently deleted" });
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

export const revokeApproval = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await revokeApprovalService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getActiveLeaders = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getActiveLeadersService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getApprovedLeaders = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getApprovedLeadersService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLeadersSummary = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getLeadersSummaryService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};