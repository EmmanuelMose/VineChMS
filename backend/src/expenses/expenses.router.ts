import { Router } from "express";
import {
  createExpenseCategory,
  getExpenseCategories,
  getExpenseCategoryById,
  updateExpenseCategory,
  deleteExpenseCategory,
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  getExpensesByStatus,
  getExpensesSummary,
  getExpensesTotal,
  approveExpense,
  rejectExpense,
  getExpensesByDateRange,
} from "./expenses.controller";
import { authenticate } from "../middleware/auth.middleware";

const expensesRouter = Router();

expensesRouter.post("/categories", authenticate, createExpenseCategory);
expensesRouter.get("/categories", authenticate, getExpenseCategories);
expensesRouter.get("/categories/:id", authenticate, getExpenseCategoryById);
expensesRouter.put("/categories/:id", authenticate, updateExpenseCategory);
expensesRouter.delete("/categories/:id", authenticate, deleteExpenseCategory);

expensesRouter.post("/", authenticate, createExpense);
expensesRouter.get("/", authenticate, getExpenses);
expensesRouter.get("/:id", authenticate, getExpenseById);
expensesRouter.put("/:id", authenticate, updateExpense);
expensesRouter.delete("/:id", authenticate, deleteExpense);
expensesRouter.get("/category/:categoryId", authenticate, getExpensesByCategory);
expensesRouter.get("/status/:status", authenticate, getExpensesByStatus);
expensesRouter.get("/summary/:churchId", authenticate, getExpensesSummary);
expensesRouter.get("/total/:churchId", authenticate, getExpensesTotal);
expensesRouter.put("/:id/approve", authenticate, approveExpense);
expensesRouter.put("/:id/reject", authenticate, rejectExpense);
expensesRouter.get("/date-range/:churchId", authenticate, getExpensesByDateRange);

export default expensesRouter;