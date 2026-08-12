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
  requestToJoinGroup,
  getGroupJoinRequests,
  getMyJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
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

groupsRouter.post("/request", authenticate, requestToJoinGroup);
groupsRouter.get("/requests/:groupId", authenticate, getGroupJoinRequests);
groupsRouter.get("/my-requests", authenticate, getMyJoinRequests);
groupsRouter.put("/requests/:requestId/approve", authenticate, approveJoinRequest);
groupsRouter.put("/requests/:requestId/reject", authenticate, rejectJoinRequest);
groupsRouter.get("/requests/:requestId/accept", approveJoinRequest);

export default groupsRouter;