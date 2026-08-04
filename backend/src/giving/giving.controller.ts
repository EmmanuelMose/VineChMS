import { Request, Response } from "express";
import {
  createGivingCategoryService,
  getGivingCategoriesService,
  getGivingCategoryByIdService,
  getGivingCategoriesByChurchService,
  updateGivingCategoryService,
  deleteGivingCategoryService,
  createGivingService,
  getGivingService,
  getGivingByIdService,
  updateGivingService,
  deleteGivingService,
  getGivingByMemberService,
  getGivingByChurchService,
  getGivingByTypeService,
  getGivingSummaryService,
  getGivingTotalService,
  getGivingByDateRangeService,
} from "./giving.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createGivingCategory = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createGivingCategoryService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingCategories = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getGivingCategoriesService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingCategoryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getGivingCategoryByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getGivingCategoriesByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getGivingCategoriesByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateGivingCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateGivingCategoryService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteGivingCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteGivingCategoryService(id);
    res.json({ success: true, message: "Giving category deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createGiving = async (req: AuthRequest, res: Response) => {
  try {
    const result = await createGivingService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGiving = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getGivingService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getGivingByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateGiving = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateGivingService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteGiving = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteGivingService(id);
    res.json({ success: true, message: "Giving record deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingByMember = async (req: Request, res: Response) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const result = await getGivingByMemberService(memberId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getGivingByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingByType = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const type = req.params.type;
    const result = await getGivingByTypeService(churchId, type);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingSummary = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getGivingSummaryService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingTotal = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getGivingTotalService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGivingByDateRange = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const { startDate, endDate } = req.query;
    
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
    res.status(400).json({ success: false, message: error.message });
  }
};