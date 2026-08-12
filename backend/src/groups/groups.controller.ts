import { Request, Response } from "express";
import {
  createGroupService,
  getGroupByIdService,
  getGroupsByChurchService,
  getActiveGroupsService,
  updateGroupService,
  deleteGroupService,
  addMemberToGroupService,
  getGroupMembersService,
  getMemberGroupsService,
  updateGroupMemberService,
  removeMemberFromGroupService,
  createJoinRequestService,
  getGroupJoinRequestsService,
  getMyJoinRequestsService,
  approveJoinRequestService,
  rejectJoinRequestService,
} from "./groups.service";
import { AuthRequest } from "../middleware/auth.middleware";
import db from "../Drizzle/db";
import { members, users } from "../Drizzle/schema";
import { eq, and } from "drizzle-orm";

export const createGroup = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createGroupService({ ...req.body, churchId });
    res.status(201).json({ success: true, data: result, message: "Group created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create group" });
  }
};

export const getGroups = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getGroupsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch groups" });
  }
};

export const getGroupById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getGroupByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Group not found" });
  }
};

export const updateGroup = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getGroupByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updateGroupService(id, req.body);
    res.json({ success: true, data: result, message: "Group updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update group" });
  }
};

export const deleteGroup = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getGroupByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteGroupService(id);
    res.json({ success: true, message: "Group deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete group" });
  }
};

export const getActiveGroups = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getActiveGroupsService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch active groups" });
  }
};

export const addMemberToGroup = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    const { groupId } = req.body;
    const group = await getGroupByIdService(groupId);
    if (group.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await addMemberToGroupService(req.body);
    res.status(201).json({ success: true, data: result, message: "Member added to group successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to add member to group" });
  }
};

export const getGroupMembers = async (req: AuthRequest, res: Response) => {
  try {
    const groupId = parseInt(req.params.groupId);
    const churchId = req.user?.churchId;
    const group = await getGroupByIdService(groupId);
    if (group.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await getGroupMembersService(groupId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch group members" });
  }
};

export const getMemberGroups = async (req: AuthRequest, res: Response) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const result = await getMemberGroupsService(memberId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch member groups" });
  }
};

export const updateGroupMember = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateGroupMemberService(id, req.body);
    res.json({ success: true, data: result, message: "Group member updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update group member" });
  }
};

export const removeMemberFromGroup = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await removeMemberFromGroupService(id);
    res.json({ success: true, message: "Member removed from group successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to remove member from group" });
  }
};

export const requestToJoinGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId, memberId, message } = req.body;
    const userId = req.user?.userId;
    if (userId === undefined) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const member = await db.query.members.findFirst({
      where: and(eq(members.memberId, memberId), eq(members.userId, userId)),
    });
    if (!member) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const result = await createJoinRequestService({ groupId, memberId, message });
    res.status(201).json({ success: true, data: result, message: "Request sent successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGroupJoinRequests = async (req: AuthRequest, res: Response) => {
  try {
    const groupId = parseInt(req.params.groupId);
    const result = await getGroupJoinRequestsService(groupId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyJoinRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (userId === undefined) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const member = await db.query.members.findFirst({
      where: eq(members.userId, userId),
    });
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }
    const result = await getMyJoinRequestsService(member.memberId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const approveJoinRequest = async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.requestId);
    const result = await approveJoinRequestService(requestId);
    res.json({ success: true, data: result, message: "Request approved. Member added to group." });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const rejectJoinRequest = async (req: AuthRequest, res: Response) => {
  try {
    const requestId = parseInt(req.params.requestId);
    const result = await rejectJoinRequestService(requestId);
    res.json({ success: true, data: result, message: "Request rejected." });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};