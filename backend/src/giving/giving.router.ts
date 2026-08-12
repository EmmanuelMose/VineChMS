import { Router } from "express";
import {
  createGivingCategory,
  getGivingCategories,
  getGivingCategoryById,
  updateGivingCategory,
  deleteGivingCategory,
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
} from "./giving.controller";
import { authenticate } from "../middleware/auth.middleware";

const givingRouter = Router();

givingRouter.post("/categories", authenticate, createGivingCategory);
givingRouter.get("/categories", authenticate, getGivingCategories);
givingRouter.get("/categories/:id", authenticate, getGivingCategoryById);
givingRouter.put("/categories/:id", authenticate, updateGivingCategory);
givingRouter.delete("/categories/:id", authenticate, deleteGivingCategory);

givingRouter.post("/", authenticate, createGiving);
givingRouter.get("/", authenticate, getGiving);
givingRouter.get("/:id", authenticate, getGivingById);
givingRouter.put("/:id", authenticate, updateGiving);
givingRouter.delete("/:id", authenticate, deleteGiving);
givingRouter.get("/member/:memberId", authenticate, getGivingByMember);
givingRouter.get("/type/:churchId/:type", authenticate, getGivingByType);
givingRouter.get("/summary/:churchId", authenticate, getGivingSummary);
givingRouter.get("/total/:churchId", authenticate, getGivingTotal);
givingRouter.get("/date-range/:churchId", authenticate, getGivingByDateRange);

export default givingRouter;