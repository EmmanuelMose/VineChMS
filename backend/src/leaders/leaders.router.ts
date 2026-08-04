import { Router } from "express";
import {
  createLeader,
  getLeaders,
  getLeaderById,
  getLeadersByMember,
  getLeadersByPosition,
  getLeadersByChurch,
  updateLeader,
  deleteLeader,
  hardDeleteLeader,
  approveLeader,
  revokeApproval,
  getActiveLeaders,
  getApprovedLeaders,
  getLeadersSummary,
} from "./leaders.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const leadersRouter = Router();

leadersRouter.post("/", authenticate, createLeader);
leadersRouter.get("/", authenticate, getLeaders);
leadersRouter.get("/:id", authenticate, getLeaderById);
leadersRouter.put("/:id", authenticate, updateLeader);
leadersRouter.delete("/:id", authenticate, deleteLeader);
leadersRouter.delete("/:id/permanent", authenticate, authorize("super_admin", "large_org_admin"), hardDeleteLeader);

leadersRouter.get("/member/:memberId", authenticate, getLeadersByMember);
leadersRouter.get("/position/:positionId", authenticate, getLeadersByPosition);
leadersRouter.get("/church/:churchId", authenticate, getLeadersByChurch);

leadersRouter.put("/:id/approve", authenticate, approveLeader);
leadersRouter.put("/:id/revoke", authenticate, revokeApproval);
leadersRouter.get("/status/active", authenticate, getActiveLeaders);
leadersRouter.get("/status/approved", authenticate, getApprovedLeaders);
leadersRouter.get("/summary/all", authenticate, getLeadersSummary);

export default leadersRouter;