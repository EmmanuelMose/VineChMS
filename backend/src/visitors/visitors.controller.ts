import { Request, Response } from "express";
import {
  createVisitorService,
  getVisitorByIdService,
  getVisitorsByChurchService,
  getVisitorsByServiceService,
  getVisitorsByDateRangeService,
  updateVisitorService,
  deleteVisitorService,
  convertVisitorToMemberService,
} from "./visitors.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createVisitor = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await createVisitorService({ ...req.body, churchId });
    res.status(201).json({ success: true, data: result, message: "Visitor created successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to create visitor" });
  }
};

export const getVisitors = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getVisitorsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch visitors" });
  }
};

export const getVisitorById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const result = await getVisitorByIdService(id);
    if (result.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: "Visitor not found" });
  }
};

export const updateVisitor = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getVisitorByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await updateVisitorService(id, req.body);
    res.json({ success: true, data: result, message: "Visitor updated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to update visitor" });
  }
};

export const deleteVisitor = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getVisitorByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteVisitorService(id);
    res.json({ success: true, message: "Visitor deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to delete visitor" });
  }
};

export const getVisitorsByService = async (req: AuthRequest, res: Response) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    const churchId = req.user?.churchId;
    if (!churchId) {
      return res.status(400).json({ success: false, message: "Church ID is required" });
    }
    const result = await getVisitorsByServiceService(serviceId);
    // Filter by church since serviceId might belong to another church
    const filtered = result.filter(v => v.churchId === churchId);
    res.json({ success: true, data: filtered });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch visitors" });
  }
};

export const getVisitorsByDateRange = async (req: AuthRequest, res: Response) => {
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
    const result = await getVisitorsByDateRangeService(
      churchId,
      startDate as string,
      endDate as string
    );
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to fetch visitors" });
  }
};

export const convertVisitorToMember = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const churchId = req.user?.churchId;
    const existing = await getVisitorByIdService(id);
    if (existing.churchId !== churchId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const result = await convertVisitorToMemberService(id, req.body);
    res.json({ success: true, data: result, message: "Visitor converted to member successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to convert visitor to member" });
  }
};