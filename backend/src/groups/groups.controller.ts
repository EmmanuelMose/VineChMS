import { Request, Response } from "express";
import {
  createGroupService,
  getGroupsService,
  getGroupByIdService,
  updateGroupService,
  deleteGroupService,
  getGroupsByChurchService,
  getActiveGroupsService,
  addMemberToGroupService,
  getGroupMembersService,
  getMemberGroupsService,
  updateGroupMemberService,
  removeMemberFromGroupService,
} from "./groups.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createGroup = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createGroupService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGroups = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getGroupsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getGroupByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateGroupService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteGroupService(id);
    res.json({ success: true, message: "Group deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGroupsByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getGroupsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getActiveGroups = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getActiveGroupsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addMemberToGroup = async (req: AuthRequest, res: Response) => {
  try {
    console.log('📥 addMemberToGroup - Request body:', req.body);
    const result = await addMemberToGroupService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error('❌ addMemberToGroup error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGroupMembers = async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.groupId);
    const result = await getGroupMembersService(groupId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMemberGroups = async (req: Request, res: Response) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const result = await getMemberGroupsService(memberId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateGroupMember = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateGroupMemberService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeMemberFromGroup = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await removeMemberFromGroupService(id);
    res.json({ success: true, message: "Member removed from group" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};