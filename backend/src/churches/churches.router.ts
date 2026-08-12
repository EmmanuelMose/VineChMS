import { Router } from "express";
import {
  createChurch,
  getChurches,
  getChurchById,
  updateChurch,
  deleteChurch,
  getChurchMembers,
} from "./churches.controller";
import { authenticate } from "../middleware/auth.middleware";

const churchesRouter = Router();

churchesRouter.post("/", authenticate, createChurch);
churchesRouter.get("/", authenticate, getChurches);
churchesRouter.get("/:id", authenticate, getChurchById);
churchesRouter.put("/:id", authenticate, updateChurch);
churchesRouter.delete("/:id", authenticate, deleteChurch);
churchesRouter.get("/:id/members", authenticate, getChurchMembers);

export default churchesRouter;