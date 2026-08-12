import { Router } from "express";
import {
  getMembers,
  getMemberById,
  getMemberByUserId,
  updateMember,
  deleteMember,
  upgradeMemberRole,
} from "./members.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const membersRouter = Router();

membersRouter.get("/", authenticate, getMembers);
membersRouter.get("/:id", authenticate, getMemberById);
membersRouter.get("/user/:userId", authenticate, getMemberByUserId);
membersRouter.put("/:id", authenticate, updateMember);
membersRouter.put("/:id/upgrade", authenticate, authorize("church_admin", "super_admin"), upgradeMemberRole);
membersRouter.delete("/:id", authenticate, deleteMember);

export default membersRouter;