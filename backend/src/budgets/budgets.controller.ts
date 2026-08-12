import { Request, Response } from "express";
import {
  createBudgetService,
  getBudgetByIdService,
  getBudgetsByChurchService,
  getBudgetsByChurchAndYearService,
  getAnnualBudgetsService,
  getMonthlyBudgetsService,
  updateBudgetService,
  deleteBudgetService,
  getBudgetsTotalService,
  getBudgetsByMonthService,
  getBudgetsByDateRangeService,
} from "./budgets.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createBudget = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createBudgetService({ ...req.body, churchId });
    res.status(201).json({ success: true, data: result, message: "Budget created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create budget" });
  }
};

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getBudgetsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch budgets" });
  }
};

export const getBudgetById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getBudgetByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Budget not found" });
  }
};

export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getBudgetByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updateBudgetService(id, req.body);
    res.json({ success: true, data: result, message: "Budget updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update budget" });
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getBudgetByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteBudgetService(id);
    res.json({ success: true, message: "Budget deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete budget" });
  }
};

export const getBudgetsByYear = async (req: AuthRequest, res: Response) => {
  try {
    const year = parseInt(req.params.year);
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getBudgetsByChurchAndYearService(churchId, year);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch budgets" });
  }
};

export const getAnnualBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getAnnualBudgetsService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch annual budgets" });
  }
};

export const getMonthlyBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getMonthlyBudgetsService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch monthly budgets" });
  }
};

export const getBudgetsTotal = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const year = parseInt(req.params.year);
    const userChurchId = req.user?.churchId;
    if (churchId !== userChurchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await getBudgetsTotalService(churchId, year);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch budgets total" });
  }
};

export const getBudgetsByMonth = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    const userChurchId = req.user?.churchId;
    if (churchId !== userChurchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await getBudgetsByMonthService(churchId, year, month);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch budgets" });
  }
};

export const getBudgetsByDateRange = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const startYear = parseInt(req.params.startYear);
    const endYear = parseInt(req.params.endYear);
    const userChurchId = req.user?.churchId;
    if (churchId !== userChurchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await getBudgetsByDateRangeService(churchId, startYear, endYear);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch budgets" });
  }
};