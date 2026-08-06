import { Request, Response } from "express";
import {
  createGivingCategoryService,
  getGivingCategoriesByChurchService,
  getGivingCategoryByIdService,
  updateGivingCategoryService,
  deleteGivingCategoryService,
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
} from "./giving.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createGivingCategory = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createGivingCategoryService({ ...req.body, churchId });
    res.status(201).json({ success: true, data: result, message: "Giving category created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create giving category" });
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
    res.status(400).json({ success: false, message: "Failed to fetch giving categories" });
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
    res.status(404).json({ success: false, message: "Giving category not found" });
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
    res.json({ success: true, data: result, message: "Giving category updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update giving category" });
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
    res.json({ success: true, message: "Giving category deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete giving category" });
  }
};

export const createGiving = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createGivingService({ ...req.body, churchId });
    res.status(201).json({ success: true, data: result, message: "Giving record created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create giving record" });
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
    res.status(400).json({ success: false, message: "Failed to fetch giving records" });
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
    res.status(404).json({ success: false, message: "Giving record not found" });
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
    res.json({ success: true, data: result, message: "Giving record updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update giving record" });
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
    res.json({ success: true, message: "Giving record deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete giving record" });
  }
};

export const getGivingByMember = async (req: AuthRequest, res: Response) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const result = await getGivingByMemberService(memberId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch giving records" });
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
    res.status(400).json({ success: false, message: "Failed to fetch giving records" });
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
    res.status(400).json({ success: false, message: "Failed to fetch giving summary" });
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
    res.status(400).json({ success: false, message: "Failed to fetch giving total" });
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
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required query parameters"
      });
    }
    const result = await getGivingByDateRangeService(
      churchId,
      startDate as string,
      endDate as string
    );
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch giving records" });
  }
};