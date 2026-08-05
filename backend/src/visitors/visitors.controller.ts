import { Request, Response } from "express";
import {
  createVisitorService,
  getVisitorsService,
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
    const result = await createVisitorService(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getVisitors = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getVisitorsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getVisitorById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getVisitorByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getVisitorsByChurch = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const result = await getVisitorsByChurchService(churchId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getVisitorsByService = async (req: Request, res: Response) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    const result = await getVisitorsByServiceService(serviceId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getVisitorsByDateRange = async (req: Request, res: Response) => {
  try {
    const churchId = parseInt(req.params.churchId);
    const { startDate, endDate } = req.query;
    
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
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateVisitor = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await updateVisitorService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteVisitor = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteVisitorService(id);
    res.json({ success: true, message: "Visitor deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const convertVisitorToMember = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await convertVisitorToMemberService(id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};