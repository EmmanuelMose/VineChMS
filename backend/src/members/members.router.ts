import { Router } from "express";
import {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  getMemberByUserId,
} from "./members.controller";
import { authenticate } from "../middleware/auth.middleware";

const membersRouter = Router();

membersRouter.post("/", authenticate, createMember);
membersRouter.get("/", authenticate, getMembers);
membersRouter.get("/:id", authenticate, getMemberById);
membersRouter.get("/user/:userId", authenticate, getMemberByUserId);
membersRouter.put("/:id", authenticate, updateMember);
membersRouter.delete("/:id", authenticate, deleteMember);

export default membersRouter;