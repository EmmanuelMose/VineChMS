import db from "../Drizzle/db";
import { auditLogs, users } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const createAuditLogService = async (data: any) => {
  const pool = db.$client;
  
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

export const getAuditLogsService = async () => {
  return await db
    .select({
      auditId: auditLogs.auditId,
      userId: auditLogs.userId,
      fullName: users.fullName,
      email: users.email,
      action: auditLogs.action,
      entity: auditLogs.entity,
      entityId: auditLogs.entityId,
      changes: auditLogs.changes,
      ipAddress: auditLogs.ipAddress,
      userAgent: auditLogs.userAgent,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.userId, users.userId))
    .orderBy(desc(auditLogs.createdAt));
};

export const getAuditLogByIdService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid audit log ID");
  }
  const [result] = await db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.auditId, id));
  if (!result) throw new Error("Audit log not found");
  return result;
};

export const getAuditLogsByUserService = async (userId: number) => {
  if (!userId || isNaN(userId)) {
    throw new Error("Invalid user ID");
  }
  return await db
    .select({
      auditId: auditLogs.auditId,
      action: auditLogs.action,
      entity: auditLogs.entity,
      entityId: auditLogs.entityId,
      changes: auditLogs.changes,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .where(eq(auditLogs.userId, userId))
    .orderBy(desc(auditLogs.createdAt));
};

export const getAuditLogsByActionService = async (action: string) => {
  return await db
    .select({
      auditId: auditLogs.auditId,
      userId: auditLogs.userId,
      fullName: users.fullName,
      email: users.email,
      entity: auditLogs.entity,
      entityId: auditLogs.entityId,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.userId, users.userId))
    .where(eq(auditLogs.action, action))
    .orderBy(desc(auditLogs.createdAt));
};

export const getAuditLogsByEntityService = async (entity: string, entityId?: number) => {
  const conditions = [eq(auditLogs.entity, entity)];
  if (entityId) {
    conditions.push(eq(auditLogs.entityId, entityId));
  }
  
  return await db
    .select({
      auditId: auditLogs.auditId,
      userId: auditLogs.userId,
      fullName: users.fullName,
      email: users.email,
      action: auditLogs.action,
      changes: auditLogs.changes,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.userId, users.userId))
    .where(and(...conditions))
    .orderBy(desc(auditLogs.createdAt));
};

export const getAuditLogsByDateRangeService = async (startDate: string, endDate: string) => {
  const pool = db.$client;
  
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

export const getAuditLogsSummaryService = async () => {
  const pool = db.$client;
  
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

export const getRecentAuditLogsService = async (limit: number = 50) => {
  if (!limit || isNaN(limit)) {
    limit = 50;
  }
  return await db
    .select({
      auditId: auditLogs.auditId,
      userId: auditLogs.userId,
      fullName: users.fullName,
      email: users.email,
      action: auditLogs.action,
      entity: auditLogs.entity,
      entityId: auditLogs.entityId,
      changes: auditLogs.changes,
      ipAddress: auditLogs.ipAddress,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.userId, users.userId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
};

export const deleteAuditLogService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid audit log ID");
  }
  const [result] = await db
    .delete(auditLogs)
    .where(eq(auditLogs.auditId, id))
    .returning({ id: auditLogs.auditId });
  if (!result) throw new Error("Audit log not found");
  return result;
};

export const clearOldAuditLogsService = async (days: number) => {
  if (!days || isNaN(days)) {
    throw new Error("Invalid days");
  }
  const pool = db.$client;
  
  const query = `
    DELETE FROM audit_logs
    WHERE created_at < NOW() - INTERVAL '${days} days'
    RETURNING *
  `;
  
  const result = await pool.query(query);
  return result.rows;
};