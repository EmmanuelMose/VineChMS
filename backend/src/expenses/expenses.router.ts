import { Router } from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByChurch,
  getExpensesSummary,
  approveExpense,
} from "./expenses.controller";
import { authenticate } from "../middleware/auth.middleware";

const expensesRouter = Router();

expensesRouter.post("/", authenticate, createExpense);
expensesRouter.get("/", authenticate, getExpenses);
expensesRouter.get("/:id", authenticate, getExpenseById);
expensesRouter.put("/:id", authenticate, updateExpense);
expensesRouter.delete("/:id", authenticate, deleteExpense);
expensesRouter.get("/church/:churchId", authenticate, getExpensesByChurch);
expensesRouter.get("/summary/:churchId", authenticate, getExpensesSummary);
expensesRouter.put("/:id/approve", authenticate, approveExpense);

export default expensesRouter;