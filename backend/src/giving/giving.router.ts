import { Router } from "express";
import {
  createGiving,
  getGiving,
  getGivingById,
  updateGiving,
  deleteGiving,
  getGivingByMember,
  getGivingByChurch,
  getGivingSummary,
} from "./giving.controller";
import { authenticate } from "../middleware/auth.middleware";

const givingRouter = Router();

givingRouter.post("/", authenticate, createGiving);
givingRouter.get("/", authenticate, getGiving);
givingRouter.get("/:id", authenticate, getGivingById);
givingRouter.put("/:id", authenticate, updateGiving);
givingRouter.delete("/:id", authenticate, deleteGiving);
givingRouter.get("/member/:memberId", authenticate, getGivingByMember);
givingRouter.get("/church/:churchId", authenticate, getGivingByChurch);
givingRouter.get("/summary/:churchId", authenticate, getGivingSummary);

export default givingRouter;