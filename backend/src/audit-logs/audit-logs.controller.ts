import { Request, Response } from "express";
import {
  getAuditLogsService,
  getAuditLogByIdService,
  getAuditLogsByUserService,
  getAuditLogsByActionService,
  getAuditLogsByEntityService,
  getAuditLogsByDateRangeService,
  getAuditLogsSummaryService,
  getRecentAuditLogsService,
  deleteAuditLogService,
  clearOldAuditLogsService,
} from "./audit-logs.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getAuditLogsService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAuditLogById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getAuditLogByIdService(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getAuditLogsByUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const result = await getAuditLogsByUserService(userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAuditLogsByAction = async (req: Request, res: Response) => {
  try {
    const action = req.params.action;
    const result = await getAuditLogsByActionService(action);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAuditLogsByEntity = async (req: Request, res: Response) => {
  try {
    const entity = req.params.entity;
    const entityId = req.query.entityId ? parseInt(req.query.entityId as string) : undefined;
    const result = await getAuditLogsByEntityService(entity, entityId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAuditLogsByDateRange = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required query parameters"
      });
    }
    
    const result = await getAuditLogsByDateRangeService(
      startDate as string,
      endDate as string
    );
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAuditLogsSummary = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getAuditLogsSummaryService();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRecentAuditLogs = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const result = await getRecentAuditLogsService(limit);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAuditLog = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteAuditLogService(id);
    res.json({ success: true, message: "Audit log deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const clearOldAuditLogs = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.params.days);
    const result = await clearOldAuditLogsService(days);
    res.json({ 
      success: true, 
      message: `${result.length} audit logs older than ${days} days deleted`,
      data: result 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};