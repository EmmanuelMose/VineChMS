import { Request, Response } from "express";
import {
  createMemberService,
  getMembersService,
  getMemberByIdService,
  updateMemberService,
  deleteMemberService,
  getMemberByUserIdService,
} from "./members.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createMember = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createMemberService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMembers = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getMembersService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getMemberByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getMemberByUserId = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const result = await getMemberByUserIdService(userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateMemberService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteMemberService(id);
    res.json({ success: true, message: "Member deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};