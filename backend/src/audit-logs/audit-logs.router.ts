import { Router } from "express";
import {
  getAuditLogs,
  getAuditLogById,
  getAuditLogsByUser,
  getAuditLogsByAction,
  getAuditLogsByEntity,
  getAuditLogsByDateRange,
  getAuditLogsSummary,
  getRecentAuditLogs,
  deleteAuditLog,
  clearOldAuditLogs,
} from "./audit-logs.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const auditLogsRouter = Router();

// All audit log routes require authentication and admin privileges
auditLogsRouter.use(authenticate);
auditLogsRouter.use(authorize("super_admin", "large_org_admin", "small_org_admin", "church_admin"));

auditLogsRouter.get("/", getAuditLogs);
auditLogsRouter.get("/summary", getAuditLogsSummary);
auditLogsRouter.get("/recent", getRecentAuditLogs);
auditLogsRouter.get("/:id", getAuditLogById);
auditLogsRouter.get("/user/:userId", getAuditLogsByUser);
auditLogsRouter.get("/action/:action", getAuditLogsByAction);
auditLogsRouter.get("/entity/:entity", getAuditLogsByEntity);
auditLogsRouter.get("/date-range", getAuditLogsByDateRange);
auditLogsRouter.delete("/:id", deleteAuditLog);
auditLogsRouter.delete("/clear/:days", clearOldAuditLogs);

export default auditLogsRouter;