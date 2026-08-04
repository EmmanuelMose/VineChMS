import { Request, Response } from "express";
import {
  createExpenseCategoryService,
  getExpenseCategoriesService,
  getExpenseCategoryByIdService,
  getExpenseCategoriesByChurchService,
  updateExpenseCategoryService,
  deleteExpenseCategoryService,
  createExpenseService,
  getExpensesService,
  getExpenseByIdService,
  updateExpenseService,
  deleteExpenseService,
  getExpensesByChurchService,
  getExpensesByCategoryService,
  getExpensesByStatusService,
  getExpensesSummaryService,
  getExpensesTotalService,
  approveExpenseService,
  rejectExpenseService,
  getExpensesByDateRangeService,
} from "./expenses.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createExpenseCategory = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createExpenseCategoryService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExpenseCategories = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getExpenseCategoriesService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExpenseCategoryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getExpenseCategoryByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getExpenseCategoriesByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getExpenseCategoriesByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateExpenseCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateExpenseCategoryService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteExpenseCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteExpenseCategoryService(id);
    res.json({ success: true, message: "Expense category deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createExpenseService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getExpensesService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getExpenseByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateExpenseService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteExpenseService(id);
    res.json({ success: true, message: "Expense record deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExpensesByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getExpensesByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExpensesByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const result = await getExpensesByCategoryService(categoryId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExpensesByStatus = async (req: Request, res: Response) => {
  try {
    const status = req.params.status;
    const result = await getExpensesByStatusService(status);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExpensesSummary = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getExpensesSummaryService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExpensesTotal = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getExpensesTotalService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const approveExpense = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const result = await approveExpenseService(id, userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const rejectExpense = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const result = await rejectExpenseService(id, userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getExpensesByDateRange = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const { startDate, endDate } = req.query;
    
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
    res.status(400).json({ success: false, message: error.message });
  }
};