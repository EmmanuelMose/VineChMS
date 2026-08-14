"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetsByDateRangeService = exports.getBudgetsByMonthService = exports.getBudgetsTotalService = exports.deleteBudgetService = exports.updateBudgetService = exports.getMonthlyBudgetsService = exports.getAnnualBudgetsService = exports.getBudgetsByChurchAndYearService = exports.getBudgetsByChurchService = exports.getBudgetByIdService = exports.createBudgetService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createBudgetService = async (data) => {
    const pool = db_1.default.$client;
    const query = `
    INSERT INTO budgets (
      church_id,
      name,
      description,
      amount,
      currency,
      year,
      month,
      is_annual,
      attachment,
      attachment_public_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    )
    RETURNING *
  `;
    const values = [
        Number(data.churchId),
        data.name,
        data.description || null,
        data.amount || "0.00",
        data.currency || "USD",
        Number(data.year),
        data.month ? Number(data.month) : null,
        data.isAnnual !== undefined ? Boolean(data.isAnnual) : false,
        data.attachment || null,
        data.attachmentPublicId || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};
exports.createBudgetService = createBudgetService;
const getBudgetByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.budgets)
        .where((0, drizzle_orm_1.eq)(schema_1.budgets.budgetId, id));
    if (!result)
        throw new Error("Budget not found");
    return result;
};
exports.getBudgetByIdService = getBudgetByIdService;
const getBudgetsByChurchService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.budgets)
        .where((0, drizzle_orm_1.eq)(schema_1.budgets.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.budgets.createdAt));
};
exports.getBudgetsByChurchService = getBudgetsByChurchService;
const getBudgetsByChurchAndYearService = async (churchId, year) => {
    return await db_1.default
        .select()
        .from(schema_1.budgets)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.budgets.churchId, churchId), (0, drizzle_orm_1.eq)(schema_1.budgets.year, year)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.budgets.createdAt));
};
exports.getBudgetsByChurchAndYearService = getBudgetsByChurchAndYearService;
const getAnnualBudgetsService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.budgets)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.budgets.isAnnual, true), (0, drizzle_orm_1.eq)(schema_1.budgets.churchId, churchId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.budgets.createdAt));
};
exports.getAnnualBudgetsService = getAnnualBudgetsService;
const getMonthlyBudgetsService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.budgets)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.budgets.isAnnual, false), (0, drizzle_orm_1.eq)(schema_1.budgets.churchId, churchId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.budgets.createdAt));
};
exports.getMonthlyBudgetsService = getMonthlyBudgetsService;
const updateBudgetService = async (id, data) => {
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.name !== undefined) {
        updates.push(`name = $${paramIndex}`);
        values.push(data.name);
        paramIndex++;
    }
    if (data.description !== undefined) {
        updates.push(`description = $${paramIndex}`);
        values.push(data.description);
        paramIndex++;
    }
    if (data.amount !== undefined) {
        updates.push(`amount = $${paramIndex}`);
        values.push(data.amount);
        paramIndex++;
    }
    if (data.currency !== undefined) {
        updates.push(`currency = $${paramIndex}`);
        values.push(data.currency);
        paramIndex++;
    }
    if (data.year !== undefined) {
        updates.push(`year = $${paramIndex}`);
        values.push(Number(data.year));
        paramIndex++;
    }
    if (data.month !== undefined) {
        updates.push(`month = $${paramIndex}`);
        values.push(data.month ? Number(data.month) : null);
        paramIndex++;
    }
    if (data.isAnnual !== undefined) {
        updates.push(`is_annual = $${paramIndex}`);
        values.push(Boolean(data.isAnnual));
        paramIndex++;
    }
    if (data.attachment !== undefined) {
        updates.push(`attachment = $${paramIndex}`);
        values.push(data.attachment);
        paramIndex++;
    }
    if (data.attachmentPublicId !== undefined) {
        updates.push(`attachment_public_id = $${paramIndex}`);
        values.push(data.attachmentPublicId);
        paramIndex++;
    }
    if (updates.length === 0) {
        throw new Error("No fields to update");
    }
    values.push(id);
    const query = `
    UPDATE budgets 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE budget_id = $${paramIndex}
    RETURNING *
  `;
    const result = await pool.query(query, values);
    if (!result.rows[0])
        throw new Error("Budget not found");
    return result.rows[0];
};
exports.updateBudgetService = updateBudgetService;
const deleteBudgetService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.budgets)
        .where((0, drizzle_orm_1.eq)(schema_1.budgets.budgetId, id))
        .returning({ id: schema_1.budgets.budgetId });
    if (!result)
        throw new Error("Budget not found");
    return result;
};
exports.deleteBudgetService = deleteBudgetService;
const getBudgetsTotalService = async (churchId, year) => {
    const pool = db_1.default.$client;
    const query = `
    SELECT 
      COALESCE(SUM(amount::numeric), 0) as total_amount,
      COUNT(*) as count
    FROM budgets
    WHERE church_id = $1 AND year = $2
  `;
    const result = await pool.query(query, [churchId, year]);
    return result.rows[0];
};
exports.getBudgetsTotalService = getBudgetsTotalService;
const getBudgetsByMonthService = async (churchId, year, month) => {
    return await db_1.default
        .select()
        .from(schema_1.budgets)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.budgets.churchId, churchId), (0, drizzle_orm_1.eq)(schema_1.budgets.year, year), (0, drizzle_orm_1.eq)(schema_1.budgets.month, month)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.budgets.createdAt));
};
exports.getBudgetsByMonthService = getBudgetsByMonthService;
const getBudgetsByDateRangeService = async (churchId, startYear, endYear) => {
    const pool = db_1.default.$client;
    const query = `
    SELECT *
    FROM budgets
    WHERE church_id = $1 AND year BETWEEN $2 AND $3
    ORDER BY year DESC, month ASC
  `;
    const result = await pool.query(query, [churchId, startYear, endYear]);
    return result.rows;
};
exports.getBudgetsByDateRangeService = getBudgetsByDateRangeService;
