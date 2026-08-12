import db from "../Drizzle/db";
import { pledges, members, users, givingCategories } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const createPledgeService = async (data: any) => {
  const pool = db.$client;
  
  const query = `
    INSERT INTO pledges (
      member_id,
      church_id,
      category_id,
      amount,
      currency,
      start_date,
      end_date,
      frequency,
      is_fulfilled,
      notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    )
    RETURNING *
  `;

  const values = [
    Number(data.memberId),
    Number(data.churchId),
    data.categoryId ? Number(data.categoryId) : null,
    data.amount || "0.00",
    data.currency || "USD",
    data.startDate || new Date().toISOString(),
    data.endDate || new Date().toISOString(),
    data.frequency || "monthly",
    data.isFulfilled !== undefined ? Boolean(data.isFulfilled) : false,
    data.notes || null
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getPledgeByIdService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid pledge ID");
  }
  const [result] = await db
    .select()
    .from(pledges)
    .where(eq(pledges.pledgeId, id));
  if (!result) throw new Error("Pledge not found");
  return result;
};

export const getPledgesByChurchService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select({
      pledgeId: pledges.pledgeId,
      memberId: pledges.memberId,
      fullName: users.fullName,
      categoryName: givingCategories.name,
      amount: pledges.amount,
      currency: pledges.currency,
      startDate: pledges.startDate,
      endDate: pledges.endDate,
      frequency: pledges.frequency,
      isFulfilled: pledges.isFulfilled,
      notes: pledges.notes,
      createdAt: pledges.createdAt,
      churchId: pledges.churchId,
    })
    .from(pledges)
    .leftJoin(members, eq(pledges.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .leftJoin(givingCategories, eq(pledges.categoryId, givingCategories.categoryId))
    .where(eq(pledges.churchId, churchId))
    .orderBy(desc(pledges.createdAt));
};

export const getPledgesByMemberService = async (memberId: number) => {
  if (!memberId || isNaN(memberId)) {
    throw new Error("Invalid member ID");
  }
  return await db
    .select({
      pledgeId: pledges.pledgeId,
      memberId: pledges.memberId,
      churchId: pledges.churchId,
      fullName: users.fullName,
      categoryName: givingCategories.name,
      amount: pledges.amount,
      currency: pledges.currency,
      startDate: pledges.startDate,
      endDate: pledges.endDate,
      frequency: pledges.frequency,
      isFulfilled: pledges.isFulfilled,
      notes: pledges.notes,
      createdAt: pledges.createdAt,
    })
    .from(pledges)
    .leftJoin(members, eq(pledges.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .leftJoin(givingCategories, eq(pledges.categoryId, givingCategories.categoryId))
    .where(eq(pledges.memberId, memberId))
    .orderBy(desc(pledges.createdAt));
};

export const getPledgesByCategoryService = async (categoryId: number) => {
  if (!categoryId || isNaN(categoryId)) {
    throw new Error("Invalid category ID");
  }
  return await db
    .select({
      pledgeId: pledges.pledgeId,
      memberId: pledges.memberId,
      churchId: pledges.churchId,
      fullName: users.fullName,
      categoryName: givingCategories.name,
      amount: pledges.amount,
      currency: pledges.currency,
      startDate: pledges.startDate,
      endDate: pledges.endDate,
      frequency: pledges.frequency,
      isFulfilled: pledges.isFulfilled,
      notes: pledges.notes,
      createdAt: pledges.createdAt,
    })
    .from(pledges)
    .leftJoin(members, eq(pledges.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .leftJoin(givingCategories, eq(pledges.categoryId, givingCategories.categoryId))
    .where(eq(pledges.categoryId, categoryId))
    .orderBy(desc(pledges.createdAt));
};

export const getFulfilledPledgesService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(pledges)
    .where(and(eq(pledges.isFulfilled, true), eq(pledges.churchId, churchId)))
    .orderBy(desc(pledges.createdAt));
};

export const getUnfulfilledPledgesService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  return await db
    .select()
    .from(pledges)
    .where(and(eq(pledges.isFulfilled, false), eq(pledges.churchId, churchId)))
    .orderBy(desc(pledges.createdAt));
};

export const updatePledgeService = async (id: number, data: any) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid pledge ID");
  }
  
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
  if (data.startDate !== undefined) {
    updates.push(`start_date = $${paramIndex}`);
    values.push(data.startDate);
    paramIndex++;
  }
  if (data.endDate !== undefined) {
    updates.push(`end_date = $${paramIndex}`);
    values.push(data.endDate);
    paramIndex++;
  }
  if (data.frequency !== undefined) {
    updates.push(`frequency = $${paramIndex}`);
    values.push(data.frequency);
    paramIndex++;
  }
  if (data.isFulfilled !== undefined) {
    updates.push(`is_fulfilled = $${paramIndex}`);
    values.push(Boolean(data.isFulfilled));
    paramIndex++;
  }
  if (data.fulfilledAt !== undefined) {
    updates.push(`fulfilled_at = $${paramIndex}`);
    values.push(data.fulfilledAt);
    paramIndex++;
  }
  if (data.notes !== undefined) {
    updates.push(`notes = $${paramIndex}`);
    values.push(data.notes);
    paramIndex++;
  }
  if (data.categoryId !== undefined) {
    updates.push(`category_id = $${paramIndex}`);
    values.push(data.categoryId ? Number(data.categoryId) : null);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE pledges 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE pledge_id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  if (!result.rows[0]) throw new Error("Pledge not found");
  return result.rows[0];
};

export const deletePledgeService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid pledge ID");
  }
  const [result] = await db
    .delete(pledges)
    .where(eq(pledges.pledgeId, id))
    .returning({ id: pledges.pledgeId });
  if (!result) throw new Error("Pledge not found");
  return result;
};

export const fulfillPledgeService = async (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid pledge ID");
  }
  const pool = db.$client;
  
  const query = `
    UPDATE pledges 
    SET 
      is_fulfilled = true,
      fulfilled_at = NOW(),
      updated_at = NOW()
    WHERE pledge_id = $1
    RETURNING *
  `;
  
  const result = await pool.query(query, [id]);
  if (!result.rows[0]) throw new Error("Pledge not found");
  return result.rows[0];
};

export const getPledgesSummaryService = async (churchId: number) => {
  if (!churchId || isNaN(churchId)) {
    throw new Error("Invalid church ID");
  }
  const pool = db.$client;
  
  const query = `
    SELECT 
      COUNT(*) as total_pledges,
      COALESCE(SUM(amount::numeric), 0) as total_amount,
      COUNT(CASE WHEN is_fulfilled THEN 1 END) as fulfilled_count,
      COUNT(CASE WHEN NOT is_fulfilled THEN 1 END) as unfulfilled_count,
      COALESCE(SUM(CASE WHEN is_fulfilled THEN amount::numeric ELSE 0 END), 0) as fulfilled_amount,
      COALESCE(SUM(CASE WHEN NOT is_fulfilled THEN amount::numeric ELSE 0 END), 0) as unfulfilled_amount
    FROM pledges
    WHERE church_id = $1
  `;
  
  const result = await pool.query(query, [churchId]);
  return result.rows[0];
};