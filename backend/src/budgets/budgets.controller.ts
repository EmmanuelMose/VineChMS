import { Request, Response } from "express";
import {
  createBudgetService,
  getBudgetsService,
  getBudgetByIdService,
  getBudgetsByChurchService,
  getBudgetsByYearService,
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
    const result = await createBudgetService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getBudgetsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBudgetById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getBudgetByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getBudgetsByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getBudgetsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBudgetsByYear = async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.params.year);
    const result = await getBudgetsByYearService(year);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBudgetsByChurchAndYear = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const year = parseInt(req.params.year);
    const result = await getBudgetsByChurchAndYearService(churchId, year);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAnnualBudgets = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getAnnualBudgetsService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMonthlyBudgets = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getMonthlyBudgetsService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateBudgetService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteBudgetService(id);
    res.json({ success: true, message: "Budget deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBudgetsTotal = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const year = parseInt(req.params.year);
    const result = await getBudgetsTotalService(churchId, year);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBudgetsByMonth = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    const result = await getBudgetsByMonthService(churchId, year, month);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBudgetsByDateRange = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const startYear = parseInt(req.params.startYear);
    const endYear = parseInt(req.params.endYear);
    const result = await getBudgetsByDateRangeService(churchId, startYear, endYear);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};