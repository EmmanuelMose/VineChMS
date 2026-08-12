import { Router } from "express";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetsByYear,
  getAnnualBudgets,
  getMonthlyBudgets,
  getBudgetsTotal,
  getBudgetsByMonth,
  getBudgetsByDateRange,
} from "./budgets.controller";
import { authenticate } from "../middleware/auth.middleware";

const budgetsRouter = Router();

budgetsRouter.post("/", authenticate, createBudget);
budgetsRouter.get("/", authenticate, getBudgets);
budgetsRouter.get("/:id", authenticate, getBudgetById);
budgetsRouter.put("/:id", authenticate, updateBudget);
budgetsRouter.delete("/:id", authenticate, deleteBudget);
budgetsRouter.get("/year/:year", authenticate, getBudgetsByYear);
budgetsRouter.get("/annual/:churchId", authenticate, getAnnualBudgets);
budgetsRouter.get("/monthly/:churchId", authenticate, getMonthlyBudgets);
budgetsRouter.get("/total/:churchId/year/:year", authenticate, getBudgetsTotal);
budgetsRouter.get("/church/:churchId/year/:year/month/:month", authenticate, getBudgetsByMonth);
budgetsRouter.get("/date-range/:churchId/:startYear/:endYear", authenticate, getBudgetsByDateRange);

export default budgetsRouter;