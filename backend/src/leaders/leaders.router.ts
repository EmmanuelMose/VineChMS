import { Router } from "express";
import {
  createLeader,
  getLeaders,
  getLeaderById,
  updateLeader,
  deleteLeader,
  approveLeader,
} from "./leaders.controller";
import { authenticate } from "../middleware/auth.middleware";

const leadersRouter = Router();

leadersRouter.post("/", authenticate, createLeader);
leadersRouter.get("/", authenticate, getLeaders);
leadersRouter.get("/:id", authenticate, getLeaderById);
leadersRouter.put("/:id", authenticate, updateLeader);
leadersRouter.delete("/:id", authenticate, deleteLeader);
leadersRouter.put("/:id/approve", authenticate, approveLeader);

export default leadersRouter;