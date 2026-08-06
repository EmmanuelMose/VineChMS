import { Router } from "express";
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  getActiveGroups,
  addMemberToGroup,
  getGroupMembers,
  getMemberGroups,
  updateGroupMember,
  removeMemberFromGroup,
} from "./groups.controller";
import { authenticate } from "../middleware/auth.middleware";

const groupsRouter = Router();

groupsRouter.post("/", authenticate, createGroup);
groupsRouter.get("/", authenticate, getGroups);
groupsRouter.get("/active", authenticate, getActiveGroups);
groupsRouter.get("/:id", authenticate, getGroupById);
groupsRouter.put("/:id", authenticate, updateGroup);
groupsRouter.delete("/:id", authenticate, deleteGroup);
groupsRouter.post("/member", authenticate, addMemberToGroup);
groupsRouter.get("/:groupId/members", authenticate, getGroupMembers);
groupsRouter.get("/member/:memberId/groups", authenticate, getMemberGroups);
groupsRouter.put("/member/:id", authenticate, updateGroupMember);
groupsRouter.delete("/member/:id", authenticate, removeMemberFromGroup);

export default groupsRouter;