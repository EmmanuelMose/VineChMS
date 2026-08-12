import { Request, Response } from "express";
import {
  getMembersService,
  getMemberByIdService,
  updateMemberService,
  deleteMemberService,
  getMemberByUserIdService,
  getMembersByChurchService,
  getMembersByOrganizationService,
  getMembersByLargeOrganizationService,
  upgradeMemberRoleService,
} from "./members.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const getMembers = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user!.role;
    const churchId = req.user!.churchId;
    const organizationId = req.user!.organizationId;
    const largeOrganizationId = req.user!.largeOrganizationId;

    let result;

    if (userRole === "super_admin") {
      result = await getMembersService();
    } else if (userRole === "church_admin" || userRole === "pastor" || userRole === "elder" || userRole === "secretary") {
      if (!churchId) {
        return res.status(400).json({
          success: false,
          message: "User is not associated with a church",
        });
      }
      result = await getMembersByChurchService(churchId);
    } else if (userRole === "church_member") {
      const member = await getMemberByUserIdService(req.user!.userId);
      result = [member];
    } else if (userRole === "small_org_admin" || userRole === "small_org_member") {
      if (!organizationId) {
        return res.status(400).json({
          success: false,
          message: "User is not associated with an organization",
        });
      }
      result = await getMembersByOrganizationService(organizationId);
    } else if (userRole === "large_org_admin" || userRole === "large_org_member") {
      if (!largeOrganizationId) {
        return res.status(400).json({
          success: false,
          message: "User is not associated with a large organization",
        });
      }
      result = await getMembersByLargeOrganizationService(largeOrganizationId);
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

export const upgradeMemberRole = async (req: AuthRequest, res: Response) => {
  try {
    const memberId = parseInt(req.params.id);
    const { role } = req.body;
    const userRole = req.user!.role;

    if (userRole !== "church_admin" && userRole !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only Church Admin or Super Admin can upgrade members",
      });
    }

    const validRoles = ["pastor", "elder", "treasurer", "secretary", "church_member"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Valid roles: pastor, elder, treasurer, secretary, church_member",
      });
    }

    const result = await upgradeMemberRoleService(memberId, role, req.user!.userId);

    const responseData: any = {
      success: true,
      data: {
        member: result.member,
        user: result.user,
      },
      message: `✅ Member upgraded to ${role} successfully!`,
    };

    if (result.newToken && result.updatedUser) {
      responseData.newToken = result.newToken;
      responseData.updatedUser = result.updatedUser;
      responseData.message = `✅ Member upgraded to ${role} successfully! Your session has been refreshed.`;
    }

    res.json(responseData);
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