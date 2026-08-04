import db from "../Drizzle/db";
import { giving, givingCategories, members, users } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createGivingCategoryService = async (data: any) => {
  const pool = db.$client;
  
  const query = `
    INSERT INTO giving_categories (
      church_id,
      name,
      description,
      type,
      is_active,
      image
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    )
    RETURNING *
  `;

  const values = [
    Number(data.churchId),
    data.name,
    data.description || null,
    data.type,
    data.isActive !== undefined ? Boolean(data.isActive) : true,
    data.image || null
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getGivingCategoriesService = async () => {
  return await db
    .select()
    .from(givingCategories)
    .orderBy(desc(givingCategories.createdAt));
};

export const getGivingCategoryByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(givingCategories)
    .where(eq(givingCategories.categoryId, id));
  if (!result) throw new Error("Giving category not found");
  return result;
};

export const getGivingCategoriesByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(givingCategories)
    .where(eq(givingCategories.churchId, churchId))
    .orderBy(desc(givingCategories.createdAt));
};

export const updateGivingCategoryService = async (id: number, data: any) => {
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
  if (data.type !== undefined) {
    updates.push(`type = $${paramIndex}`);
    values.push(data.type);
    paramIndex++;
  }
  if (data.isActive !== undefined) {
    updates.push(`is_active = $${paramIndex}`);
    values.push(Boolean(data.isActive));
    paramIndex++;
  }
  if (data.image !== undefined) {
    updates.push(`image = $${paramIndex}`);
    values.push(data.image);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE giving_categories 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE category_id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  if (!result.rows[0]) throw new Error("Giving category not found");
  return result.rows[0];
};

export const deleteGivingCategoryService = async (id: number) => {
  const [result] = await db
    .delete(givingCategories)
    .where(eq(givingCategories.categoryId, id))
    .returning({ id: givingCategories.categoryId });
  if (!result) throw new Error("Giving category not found");
  return result;
};

export const createGivingService = async (data: any) => {
  const pool = db.$client;
  
  const query = `
    INSERT INTO giving (
      member_id,
      church_id,
      category_id,
      amount,
      currency,
      type,
      status,
      date,
      payment_method,
      transaction_id,
      notes,
      is_anonymous,
      receipt_number
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    )
    RETURNING *
  `;

  const values = [
    Number(data.memberId),
    Number(data.churchId),
    data.categoryId ? Number(data.categoryId) : null,
    data.amount || "0.00",
    data.currency || "USD",
    data.type || "offering",
    data.status || "pending",
    data.date || new Date().toISOString(),
    data.paymentMethod || null,
    data.transactionId || null,
    data.notes || null,
    data.isAnonymous !== undefined ? Boolean(data.isAnonymous) : false,
    data.receiptNumber || null
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getGivingService = async () => {
  return await db
    .select({
      givingId: giving.givingId,
      memberId: giving.memberId,
      fullName: users.fullName,
      categoryName: givingCategories.name,
      amount: giving.amount,
      currency: giving.currency,
      type: giving.type,
      date: giving.date,
      status: giving.status,
      paymentMethod: giving.paymentMethod,
      isAnonymous: giving.isAnonymous,
    })
    .from(giving)
    .leftJoin(members, eq(giving.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .leftJoin(givingCategories, eq(giving.categoryId, givingCategories.categoryId))
    .orderBy(desc(giving.date));
};

export const getGivingByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(giving)
    .where(eq(giving.givingId, id));
  if (!result) throw new Error("Giving record not found");
  return result;
};

export const getGivingByMemberService = async (memberId: number) => {
  return await db
    .select()
    .from(giving)
    .where(eq(giving.memberId, memberId))
    .orderBy(desc(giving.date));
};

export const getGivingByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(giving)
    .where(eq(giving.churchId, churchId))
    .orderBy(desc(giving.date));
};

export const getGivingByTypeService = async (churchId: number, type: string) => {
  return await db
    .select()
    .from(giving)
    .where(
      eq(giving.churchId, churchId) && eq(giving.type, type as any)
    )
    .orderBy(desc(giving.date));
};

export const getGivingSummaryService = async (churchId: number) => {
  const pool = db.$client;
  
  const query = `
    SELECT 
      COALESCE(SUM(amount::numeric), 0) as total_amount,
      type,
      COUNT(*) as count
    FROM giving
    WHERE church_id = $1
    GROUP BY type
  `;
  
  const result = await pool.query(query, [churchId]);
  return result.rows;
};

export const getGivingTotalService = async (churchId: number) => {
  const pool = db.$client;
  
  const query = `
    SELECT 
      COALESCE(SUM(amount::numeric), 0) as total
    FROM giving
    WHERE church_id = $1
  `;
  
  const result = await pool.query(query, [churchId]);
  return result.rows[0];
};

export const updateGivingService = async (id: number, data: any) => {
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

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
  if (data.type !== undefined) {
    updates.push(`type = $${paramIndex}`);
    values.push(data.type);
    paramIndex++;
  }
  if (data.status !== undefined) {
    updates.push(`status = $${paramIndex}`);
    values.push(data.status);
    paramIndex++;
  }
  if (data.date !== undefined) {
    updates.push(`date = $${paramIndex}`);
    values.push(data.date);
    paramIndex++;
  }
  if (data.paymentMethod !== undefined) {
    updates.push(`payment_method = $${paramIndex}`);
    values.push(data.paymentMethod);
    paramIndex++;
  }
  if (data.transactionId !== undefined) {
    updates.push(`transaction_id = $${paramIndex}`);
    values.push(data.transactionId);
    paramIndex++;
  }
  if (data.notes !== undefined) {
    updates.push(`notes = $${paramIndex}`);
    values.push(data.notes);
    paramIndex++;
  }
  if (data.isAnonymous !== undefined) {
    updates.push(`is_anonymous = $${paramIndex}`);
    values.push(Boolean(data.isAnonymous));
    paramIndex++;
  }
  if (data.receiptNumber !== undefined) {
    updates.push(`receipt_number = $${paramIndex}`);
    values.push(data.receiptNumber);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE giving 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE giving_id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  if (!result.rows[0]) throw new Error("Giving record not found");
  return result.rows[0];
};

export const deleteGivingService = async (id: number) => {
  const [result] = await db
    .delete(giving)
    .where(eq(giving.givingId, id))
    .returning({ id: giving.givingId });
  if (!result) throw new Error("Giving record not found");
  return result;
};

export const getGivingByDateRangeService = async (churchId: number, startDate: string, endDate: string) => {
  const pool = db.$client;
  
  const query = `
    SELECT *
    FROM giving
    WHERE church_id = $1
      AND date::date >= $2::date
      AND date::date <= $3::date
    ORDER BY date DESC
  `;
  
  const result = await pool.query(query, [churchId, startDate, endDate]);
  return result.rows;
};