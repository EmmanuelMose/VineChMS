"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOldAuditLogs = exports.deleteAuditLog = exports.getRecentAuditLogs = exports.getAuditLogsSummary = exports.getAuditLogsByDateRange = exports.getAuditLogsByEntity = exports.getAuditLogsByAction = exports.getAuditLogsByUser = exports.getAuditLogById = exports.getAuditLogs = void 0;
const audit_logs_service_1 = require("./audit-logs.service");
const getAuditLogs = async (req, res) => {
    try {
        const result = await (0, audit_logs_service_1.getAuditLogsService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAuditLogs = getAuditLogs;
const getAuditLogById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, audit_logs_service_1.getAuditLogByIdService)(id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getAuditLogById = getAuditLogById;
const getAuditLogsByUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const result = await (0, audit_logs_service_1.getAuditLogsByUserService)(userId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAuditLogsByUser = getAuditLogsByUser;
const getAuditLogsByAction = async (req, res) => {
    try {
        const action = req.params.action;
        const result = await (0, audit_logs_service_1.getAuditLogsByActionService)(action);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAuditLogsByAction = getAuditLogsByAction;
const getAuditLogsByEntity = async (req, res) => {
    try {
        const entity = req.params.entity;
        const entityId = req.query.entityId ? parseInt(req.query.entityId) : undefined;
        const result = await (0, audit_logs_service_1.getAuditLogsByEntityService)(entity, entityId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAuditLogsByEntity = getAuditLogsByEntity;
const getAuditLogsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "startDate and endDate are required query parameters"
            });
        }
        const result = await (0, audit_logs_service_1.getAuditLogsByDateRangeService)(startDate, endDate);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAuditLogsByDateRange = getAuditLogsByDateRange;
const getAuditLogsSummary = async (req, res) => {
    try {
        const result = await (0, audit_logs_service_1.getAuditLogsSummaryService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getAuditLogsSummary = getAuditLogsSummary;
const getRecentAuditLogs = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 50;
        const result = await (0, audit_logs_service_1.getRecentAuditLogsService)(limit);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getRecentAuditLogs = getRecentAuditLogs;
const deleteAuditLog = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, audit_logs_service_1.deleteAuditLogService)(id);
        res.json({ success: true, message: "Audit log deleted" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteAuditLog = deleteAuditLog;
const clearOldAuditLogs = async (req, res) => {
    try {
        const days = parseInt(req.params.days);
        const result = await (0, audit_logs_service_1.clearOldAuditLogsService)(days);
        res.json({
            success: true,
            message: `${result.length} audit logs older than ${days} days deleted`,
            data: result
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.clearOldAuditLogs = clearOldAuditLogs;
