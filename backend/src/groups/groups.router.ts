import { Router } from "express";
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  getGroupsByChurch,
  addMemberToGroup,
  getGroupMembers,
  removeMemberFromGroup,
} from "./groups.controller";
import { authenticate } from "../middleware/auth.middleware";

const groupsRouter = Router();

groupsRouter.post("/", authenticate, createGroup);
groupsRouter.get("/", authenticate, getGroups);
groupsRouter.get("/:id", authenticate, getGroupById);
groupsRouter.put("/:id", authenticate, updateGroup);
groupsRouter.delete("/:id", authenticate, deleteGroup);
groupsRouter.get("/church/:churchId", authenticate, getGroupsByChurch);
groupsRouter.post("/member", authenticate, addMemberToGroup);
groupsRouter.get("/:groupId/members", authenticate, getGroupMembers);
groupsRouter.delete("/member/:id", authenticate, removeMemberFromGroup);

export default groupsRouter;