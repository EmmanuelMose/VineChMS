// File: backend/src/giving/giving.controller.ts

import { Request, Response } from "express";
import {
  createGivingService,
  getGivingByIdService,
  getGivingByChurchService,
  getGivingByMemberService,
  getGivingByTypeService,
  getGivingSummaryService,
  getGivingTotalService,
  updateGivingService,
  deleteGivingService,
  getGivingByDateRangeService,
  approveGivingService,
  rejectGivingService,
  createGivingCategoryService,
  getGivingCategoriesByChurchService,
  getGivingCategoryByIdService,
  updateGivingCategoryService,
  deleteGivingCategoryService,
} from "./giving.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createGivingCategory = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createGivingCategoryService({ ...req.body, churchId });
    res.status(201).json({ success: true, data: result, message: "Category created" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingCategories = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getGivingCategoriesByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingCategoryById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getGivingCategoryByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateGivingCategory = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getGivingCategoryByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updateGivingCategoryService(id, req.body);
    res.json({ success: true, data: result, message: "Category updated" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteGivingCategory = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getGivingCategoryByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteGivingCategoryService(id);
    res.json({ success: true, message: "Category deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createGiving = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createGivingService({ ...req.body, churchId });
    res.status(201).json({ success: true, data: result, message: "Giving recorded" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGiving = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getGivingByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getGivingByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateGiving = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getGivingByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updateGivingService(id, req.body);
    res.json({ success: true, data: result, message: "Giving updated" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteGiving = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getGivingByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteGivingService(id);
    res.json({ success: true, message: "Giving deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingByMember = async (req: AuthRequest, res: Response) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const result = await getGivingByMemberService(memberId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingByType = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    const type = req.params.type;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getGivingByTypeService(churchId, type);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingSummary = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getGivingSummaryService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingTotal = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getGivingTotalService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingByDateRange = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    const { startDate, endDate } = req.query;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "startDate and endDate are required" });
    }
    const result = await getGivingByDateRangeService(churchId, startDate as string, endDate as string);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const approveGiving = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const churchId = req.user?.churchId;
    const { amount } = req.body;

    const existing = await getGivingByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const allowedRoles = ["treasurer", "church_admin", "pastor", "elder"];
    if (!allowedRoles.includes(req.user!.role)) {
      return res.status(403).json({ success: false, message: "Insufficient permissions" });
    }

    let finalAmount = existing.amount;
    if (amount !== undefined && amount !== null && amount !== "") {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount) && numAmount > 0) {
        finalAmount = numAmount.toString();
      } else {
        return res.status(400).json({ success: false, message: "Invalid amount value" });
      }
    }

    const result = await approveGivingService(id, userId, finalAmount);
    res.json({ success: true, data: result, message: "Giving approved" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const rejectGiving = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user!.userId;
    const churchId = req.user?.churchId;

    const existing = await getGivingByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const allowedRoles = ["treasurer", "church_admin", "pastor", "elder"];
    if (!allowedRoles.includes(req.user!.role)) {
      return res.status(403).json({ success: false, message: "Insufficient permissions" });
    }

    const result = await rejectGivingService(id, userId);
    res.json({ success: true, data: result, message: "Giving rejected" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};