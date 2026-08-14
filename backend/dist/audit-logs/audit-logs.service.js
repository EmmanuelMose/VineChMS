"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOldAuditLogsService = exports.deleteAuditLogService = exports.getRecentAuditLogsService = exports.getAuditLogsSummaryService = exports.getAuditLogsByDateRangeService = exports.getAuditLogsByEntityService = exports.getAuditLogsByActionService = exports.getAuditLogsByUserService = exports.getAuditLogByIdService = exports.getAuditLogsService = exports.createAuditLogService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createAuditLogService = async (data) => {
    const pool = db_1.default.$client;
    const query = `
    INSERT INTO audit_logs (
      user_id,
      action,
      entity,
      entity_id,
      changes,
      ip_address,
      user_agent
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    )
    RETURNING *
  `;
    const values = [
        data.userId ? Number(data.userId) : null,
        data.action,
        data.entity,
        data.entityId ? Number(data.entityId) : null,
        data.changes || null,
        data.ipAddress || null,
        data.userAgent || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};
exports.createAuditLogService = createAuditLogService;
const getAuditLogsService = async () => {
    return await db_1.default
        .select({
        auditId: schema_1.auditLogs.auditId,
        userId: schema_1.auditLogs.userId,
        fullName: schema_1.users.fullName,
        email: schema_1.users.email,
        action: schema_1.auditLogs.action,
        entity: schema_1.auditLogs.entity,
        entityId: schema_1.auditLogs.entityId,
        changes: schema_1.auditLogs.changes,
        ipAddress: schema_1.auditLogs.ipAddress,
        userAgent: schema_1.auditLogs.userAgent,
        createdAt: schema_1.auditLogs.createdAt,
    })
        .from(schema_1.auditLogs)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.auditLogs.userId, schema_1.users.userId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.auditLogs.createdAt));
};
exports.getAuditLogsService = getAuditLogsService;
const getAuditLogByIdService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid audit log ID");
    }
    const [result] = await db_1.default
        .select()
        .from(schema_1.auditLogs)
        .where((0, drizzle_orm_1.eq)(schema_1.auditLogs.auditId, id));
    if (!result)
        throw new Error("Audit log not found");
    return result;
};
exports.getAuditLogByIdService = getAuditLogByIdService;
const getAuditLogsByUserService = async (userId) => {
    if (!userId || isNaN(userId)) {
        throw new Error("Invalid user ID");
    }
    return await db_1.default
        .select({
        auditId: schema_1.auditLogs.auditId,
        action: schema_1.auditLogs.action,
        entity: schema_1.auditLogs.entity,
        entityId: schema_1.auditLogs.entityId,
        changes: schema_1.auditLogs.changes,
        createdAt: schema_1.auditLogs.createdAt,
    })
        .from(schema_1.auditLogs)
        .where((0, drizzle_orm_1.eq)(schema_1.auditLogs.userId, userId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.auditLogs.createdAt));
};
exports.getAuditLogsByUserService = getAuditLogsByUserService;
const getAuditLogsByActionService = async (action) => {
    return await db_1.default
        .select({
        auditId: schema_1.auditLogs.auditId,
        userId: schema_1.auditLogs.userId,
        fullName: schema_1.users.fullName,
        email: schema_1.users.email,
        entity: schema_1.auditLogs.entity,
        entityId: schema_1.auditLogs.entityId,
        createdAt: schema_1.auditLogs.createdAt,
    })
        .from(schema_1.auditLogs)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.auditLogs.userId, schema_1.users.userId))
        .where((0, drizzle_orm_1.eq)(schema_1.auditLogs.action, action))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.auditLogs.createdAt));
};
exports.getAuditLogsByActionService = getAuditLogsByActionService;
const getAuditLogsByEntityService = async (entity, entityId) => {
    const conditions = [(0, drizzle_orm_1.eq)(schema_1.auditLogs.entity, entity)];
    if (entityId) {
        conditions.push((0, drizzle_orm_1.eq)(schema_1.auditLogs.entityId, entityId));
    }
    return await db_1.default
        .select({
        auditId: schema_1.auditLogs.auditId,
        userId: schema_1.auditLogs.userId,
        fullName: schema_1.users.fullName,
        email: schema_1.users.email,
        action: schema_1.auditLogs.action,
        changes: schema_1.auditLogs.changes,
        createdAt: schema_1.auditLogs.createdAt,
    })
        .from(schema_1.auditLogs)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.auditLogs.userId, schema_1.users.userId))
        .where((0, drizzle_orm_1.and)(...conditions))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.auditLogs.createdAt));
};
exports.getAuditLogsByEntityService = getAuditLogsByEntityService;
const getAuditLogsByDateRangeService = async (startDate, endDate) => {
    const pool = db_1.default.$client;
    const query = `
    SELECT 
      al.audit_id,
      al.user_id,
      u.full_name,
      u.email,
      al.action,
      al.entity,
      al.entity_id,
      al.changes,
      al.ip_address,
      al.user_agent,
      al.created_at
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.user_id
    WHERE al.created_at::date >= $1::date
      AND al.created_at::date <= $2::date
    ORDER BY al.created_at DESC
  `;
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
};
exports.getAuditLogsByDateRangeService = getAuditLogsByDateRangeService;
const getAuditLogsSummaryService = async () => {
    const pool = db_1.default.$client;
    const query = `
    SELECT 
      COUNT(*) as total_logs,
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(DISTINCT entity) as unique_entities,
      action,
      COUNT(*) as action_count
    FROM audit_logs
    GROUP BY action
    ORDER BY action_count DESC
  `;
    const result = await pool.query(query);
    return result.rows;
};
exports.getAuditLogsSummaryService = getAuditLogsSummaryService;
const getRecentAuditLogsService = async (limit = 50) => {
    if (!limit || isNaN(limit)) {
        limit = 50;
    }
    return await db_1.default
        .select({
        auditId: schema_1.auditLogs.auditId,
        userId: schema_1.auditLogs.userId,
        fullName: schema_1.users.fullName,
        email: schema_1.users.email,
        action: schema_1.auditLogs.action,
        entity: schema_1.auditLogs.entity,
        entityId: schema_1.auditLogs.entityId,
        changes: schema_1.auditLogs.changes,
        ipAddress: schema_1.auditLogs.ipAddress,
        createdAt: schema_1.auditLogs.createdAt,
    })
        .from(schema_1.auditLogs)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.auditLogs.userId, schema_1.users.userId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.auditLogs.createdAt))
        .limit(limit);
};
exports.getRecentAuditLogsService = getRecentAuditLogsService;
const deleteAuditLogService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid audit log ID");
    }
    const [result] = await db_1.default
        .delete(schema_1.auditLogs)
        .where((0, drizzle_orm_1.eq)(schema_1.auditLogs.auditId, id))
        .returning({ id: schema_1.auditLogs.auditId });
    if (!result)
        throw new Error("Audit log not found");
    return result;
};
exports.deleteAuditLogService = deleteAuditLogService;
const clearOldAuditLogsService = async (days) => {
    if (!days || isNaN(days)) {
        throw new Error("Invalid days");
    }
    const pool = db_1.default.$client;
    const query = `
    DELETE FROM audit_logs
    WHERE created_at < NOW() - INTERVAL '${days} days'
    RETURNING *
  `;
    const result = await pool.query(query);
    return result.rows;
};
exports.clearOldAuditLogsService = clearOldAuditLogsService;
