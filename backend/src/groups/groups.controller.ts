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
} from "./groups.service";
import { AuthRequest } from "../middleware/auth.middleware";

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