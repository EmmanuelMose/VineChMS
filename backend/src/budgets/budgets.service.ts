import db from "../Drizzle/db";
import { budgets } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const createBudgetService = async (data: any) => {
  const pool = db.$client;
  
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

export const getBudgetsService = async () => {
  return await db
    .select()
    .from(budgets)
    .orderBy(desc(budgets.createdAt));
};

export const getBudgetByIdService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid budget ID");
  }
  const [result] = await db
    .select()
    .from(budgets)
    .where(eq(budgets.budgetId, id));
  if (!result) throw new Error("Budget not found");
  return result;
};

export const getBudgetsByChurchService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(budgets)
    .where(eq(budgets.churchId, churchId))
    .orderBy(desc(budgets.createdAt));
};

export const getBudgetsByYearService = async (year: number) => {
  if (!year || isNaN(year)) {
    throw new Error("Invalid year");
  }
  return await db
    .select()
    .from(budgets)
    .where(eq(budgets.year, year))
    .orderBy(desc(budgets.createdAt));
};

export const getBudgetsByChurchAndYearService = async (churchId: number, year: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  if (!year || isNaN(year)) {
    throw new Error("Invalid year");
  }
  return await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.churchId, churchId), eq(budgets.year, year)))
    .orderBy(desc(budgets.createdAt));
};

export const getAnnualBudgetsService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.isAnnual, true), eq(budgets.churchId, churchId)))
    .orderBy(desc(budgets.createdAt));
};

export const getMonthlyBudgetsService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.isAnnual, false), eq(budgets.churchId, churchId)))
    .orderBy(desc(budgets.createdAt));
};

export const updateBudgetService = async (id: number, data: any) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid budget ID");
  }
  
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
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
  if (!result.rows[0]) throw new Error("Budget not found");
  return result.rows[0];
};

export const deleteBudgetService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid budget ID");
  }
  const [result] = await db
    .delete(budgets)
    .where(eq(budgets.budgetId, id))
    .returning({ id: budgets.budgetId });
  if (!result) throw new Error("Budget not found");
  return result;
};

export const getBudgetsTotalService = async (churchId: number, year: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  if (!year || isNaN(year)) {
    throw new Error("Invalid year");
  }
  const pool = db.$client;
  
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

export const getBudgetsByMonthService = async (churchId: number, year: number, month: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  if (!year || isNaN(year)) {
    throw new Error("Invalid year");
  }
  if (!month || isNaN(month)) {
    throw new Error("Invalid month");
  }
  return await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.churchId, churchId), eq(budgets.year, year), eq(budgets.month, month)))
    .orderBy(desc(budgets.createdAt));
};

export const getBudgetsByDateRangeService = async (churchId: number, startYear: number, endYear: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  if (!startYear || isNaN(startYear)) {
    throw new Error("Invalid start year");
  }
  if (!endYear || isNaN(endYear)) {
    throw new Error("Invalid end year");
  }
  const pool = db.$client;
  
  const query = `
    SELECT *
    FROM budgets
    WHERE church_id = $1 AND year BETWEEN $2 AND $3
    ORDER BY year DESC, month ASC
  `;
  
  const result = await pool.query(query, [churchId, startYear, endYear]);
  return result.rows;
};