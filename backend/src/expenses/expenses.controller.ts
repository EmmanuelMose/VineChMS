// File: backend/src/expenses/expenses.controller.ts

import { Request, Response } from "express";
import {
  createExpenseCategoryService,
  getExpenseCategoriesByChurchService,
  getExpenseCategoryByIdService,
  updateExpenseCategoryService,
  deleteExpenseCategoryService,
  createExpenseService,
  getExpenseByIdService,
  getExpensesByChurchService,
  getExpensesByCategoryService,
  getExpensesByStatusService,
  getExpensesSummaryService,
  getExpensesTotalService,
  updateExpenseService,
  deleteExpenseService,
  approveExpenseService,
  rejectExpenseService,
  getExpensesByDateRangeService,
} from "./expenses.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createExpenseCategory = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createExpenseCategoryService({ ...req.body, churchId });
    res.status(201).json({ success: true, data: result, message: "Expense category created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create expense category" });
  }
};

export const getExpenseCategories = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getExpenseCategoriesByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch expense categories" });
  }
};

export const getExpenseCategoryById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getExpenseCategoryByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Expense category not found" });
  }
};

export const updateExpenseCategory = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getExpenseCategoryByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updateExpenseCategoryService(id, req.body);
    res.json({ success: true, data: result, message: "Expense category updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update expense category" });
  }
};

export const deleteExpenseCategory = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getExpenseCategoryByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteExpenseCategoryService(id);
    res.json({ success: true, message: "Expense category deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete expense category" });
  }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createExpenseService({ ...req.body, churchId });
    res.status(201).json({ 
      success: true, 
      data: result, 
      message: result.mpesaCheckoutRequestID 
        ? "Expense created. STK Push sent to your phone." 
        : "Expense created successfully" 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create expense" });
  }
};

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getExpensesByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch expenses" });
  }
};

export const getExpenseById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getExpenseByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Expense not found" });
  }
};

export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getExpenseByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updateExpenseService(id, req.body);
    res.json({ success: true, data: result, message: "Expense updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update expense" });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getExpenseByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteExpenseService(id);
    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete expense" });
  }
};

export const getExpensesByCategory = async (req: AuthRequest, res: Response) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const category = await getExpenseCategoryByIdService(categoryId);
    if (category.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await getExpensesByCategoryService(categoryId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch expenses" });
  }
};

export const getExpensesByStatus = async (req: AuthRequest, res: Response) => {
  try {
    const status = req.params.status;
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getExpensesByStatusService(status, churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch expenses" });
  }
};

export const getExpensesSummary = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getExpensesSummaryService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch expenses summary" });
  }
};

export const getExpensesTotal = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getExpensesTotalService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch expenses total" });
  }
};

export const approveExpense = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const churchId = req.user?.churchId;
    const existing = await getExpenseByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await approveExpenseService(id, userId);
    res.json({ success: true, data: result, message: "Expense approved successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to approve expense" });
  }
};

export const rejectExpense = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const churchId = req.user?.churchId;
    const existing = await getExpenseByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await rejectExpenseService(id, userId);
    res.json({ success: true, data: result, message: "Expense rejected successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to reject expense" });
  }
};

export const getExpensesByDateRange = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    const { startDate, endDate } = req.query;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required query parameters"
      });
    }
    const result = await getExpensesByDateRangeService(
      churchId,
      startDate as string,
      endDate as string
    );
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch expenses" });
  }
};