import { Request, Response } from "express";
import {
  getMembersService,
  getMemberByIdService,
  updateMemberService,
  deleteMemberService,
  getMemberByUserIdService,
  getMembersByChurchService,
  getMembersByOrganizationService,
} from "./members.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const getMembers = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user!.role;
    const churchId = req.user!.churchId;
    const organizationId = req.user!.organizationId;

    let result;
    if (userRole === "super_admin") {
      result = await getMembersService();
    } else if (userRole === "church_admin" || userRole === "pastor" || userRole === "church_member") {
      if (!churchId) {
        return res.status(400).json({
          success: false,
          message: "User is not associated with a church",
        });
      }
      result = await getMembersByChurchService(churchId);
    } else if (userRole === "small_org_admin" || userRole === "small_org_member") {
      if (!organizationId) {
        return res.status(400).json({
          success: false,
          message: "User is not associated with an organization",
        });
      }
      result = await getMembersByOrganizationService(organizationId);
    } else {
      result = await getMembersByChurchService(churchId!);
    }

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