import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createGiving,
  getGiving,
  getGivingById,
  updateGiving,
  deleteGiving,
  getGivingByMember,
  getGivingByType,
  getGivingSummary,
  getGivingTotal,
  getGivingByDateRange,
  approveGiving,
  rejectGiving,
  createGivingCategory,
  getGivingCategories,
  getGivingCategoryById,
  updateGivingCategory,
  deleteGivingCategory,
} from "./giving.controller";

const givingRouter = Router();

givingRouter.post("/categories", authenticate, createGivingCategory);
givingRouter.get("/categories", authenticate, getGivingCategories);
givingRouter.get("/categories/:id", authenticate, getGivingCategoryById);
givingRouter.put("/categories/:id", authenticate, updateGivingCategory);
givingRouter.delete("/categories/:id", authenticate, deleteGivingCategory);

givingRouter.post("/", authenticate, createGiving);
givingRouter.get("/", authenticate, getGiving);
givingRouter.get("/member/:memberId", authenticate, getGivingByMember);
givingRouter.get("/type/:churchId/:type", authenticate, getGivingByType);
givingRouter.get("/summary/:churchId", authenticate, getGivingSummary);
givingRouter.get("/total/:churchId", authenticate, getGivingTotal);
givingRouter.get("/date-range/:churchId", authenticate, getGivingByDateRange);
givingRouter.get("/:id", authenticate, getGivingById);
givingRouter.put("/:id", authenticate, updateGiving);
givingRouter.delete("/:id", authenticate, deleteGiving);
givingRouter.put("/:id/approve", authenticate, approveGiving);
givingRouter.put("/:id/reject", authenticate, rejectGiving);

export default givingRouter;