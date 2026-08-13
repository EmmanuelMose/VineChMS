// File: backend/src/expenses/expenses.service.ts (full updated)

import db from "../Drizzle/db";
import { expenses, expenseCategories } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { initiateStkPush } from "../mpesa/mpesa.service";

export const createExpenseCategoryService = async (data: any) => {
  const pool = db.$client;
  
  const query = `
    INSERT INTO expense_categories (
      church_id,
      name,
      description,
      is_active,
      image,
      image_public_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    )
    RETURNING *
  `;

  const values = [
    Number(data.churchId),
    data.name,
    data.description || null,
    data.isActive !== undefined ? Boolean(data.isActive) : true,
    data.image || null,
    data.imagePublicId || null
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getExpenseCategoriesByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(expenseCategories)
    .where(eq(expenseCategories.churchId, churchId))
    .orderBy(desc(expenseCategories.createdAt));
};

export const getExpenseCategoryByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(expenseCategories)
    .where(eq(expenseCategories.categoryId, id));
  if (!result) throw new Error("Expense category not found");
  return result;
};

export const updateExpenseCategoryService = async (id: number, data: any) => {
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
  if (data.imagePublicId !== undefined) {
    updates.push(`image_public_id = $${paramIndex}`);
    values.push(data.imagePublicId);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE expense_categories 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE category_id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  if (!result.rows[0]) throw new Error("Expense category not found");
  return result.rows[0];
};

export const deleteExpenseCategoryService = async (id: number) => {
  const [result] = await db
    .delete(expenseCategories)
    .where(eq(expenseCategories.categoryId, id))
    .returning({ id: expenseCategories.categoryId });
  if (!result) throw new Error("Expense category not found");
  return result;
};

export const createExpenseService = async (data: any) => {
  const pool = db.$client;
  let mpesaCheckoutRequestID: string | null = null;
  let mpesaMerchantRequestID: string | null = null;

  if (data.paymentMethod === "mpesa" && data.phoneNumber) {
    try {
      let phoneNumber = data.phoneNumber.replace(/\D/g, "");
      if (phoneNumber.startsWith("0")) {
        phoneNumber = "254" + phoneNumber.slice(1);
      } else if (!phoneNumber.startsWith("254")) {
        phoneNumber = "254" + phoneNumber;
      }

      const stkResult = await initiateStkPush(
        phoneNumber,
        parseFloat(data.amount),
        `EXP-${Date.now()}`,
        "Church Expense Payment"
      );
      mpesaCheckoutRequestID = stkResult.CheckoutRequestID;
      mpesaMerchantRequestID = stkResult.MerchantRequestID;
      
      if (stkResult.ResponseCode !== "0") {
        console.warn("STK push warning:", stkResult.ResponseDescription);
      }
    } catch (error: any) {
      console.error("STK push error:", error.message);
    }
  }

  const query = `
    INSERT INTO expenses (
      church_id,
      member_id,
      category_id,
      amount,
      currency,
      description,
      date,
      status,
      payment_method,
      notes,
      receipt_url,
      receipt_public_id,
      mpesa_checkout_request_id,
      mpesa_merchant_request_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )
    RETURNING *
  `;

  const values = [
    Number(data.churchId),
    data.memberId ? Number(data.memberId) : null,
    data.categoryId ? Number(data.categoryId) : null,
    data.amount || "0.00",
    data.currency || "KES",
    data.description,
    data.date || new Date().toISOString(),
    data.status || "pending",
    data.paymentMethod || null,
    data.notes || null,
    data.receiptUrl || null,
    data.receiptPublicId || null,
    mpesaCheckoutRequestID,
    mpesaMerchantRequestID
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getExpenseByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(expenses)
    .where(eq(expenses.expenseId, id));
  if (!result) throw new Error("Expense not found");
  return result;
};

export const getExpensesByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(expenses)
    .where(eq(expenses.churchId, churchId))
    .orderBy(desc(expenses.date));
};

export const getExpensesByCategoryService = async (categoryId: number) => {
  return await db
    .select()
    .from(expenses)
    .where(eq(expenses.categoryId, categoryId))
    .orderBy(desc(expenses.date));
};

export const getExpensesByStatusService = async (status: string, churchId: number) => {
  return await db
    .select()
    .from(expenses)
    .where(and(eq(expenses.status, status as any), eq(expenses.churchId, churchId)))
    .orderBy(desc(expenses.date));
};

export const getExpensesSummaryService = async (churchId: number) => {
  const pool = db.$client;
  
  const query = `
    SELECT 
      COALESCE(SUM(amount::numeric), 0) as total_amount,
      status,
      COUNT(*) as count
    FROM expenses
    WHERE church_id = $1
    GROUP BY status
  `;
  
  const result = await pool.query(query, [churchId]);
  return result.rows;
};

export const getExpensesTotalService = async (churchId: number) => {
  const pool = db.$client;
  
  const query = `
    SELECT 
      COALESCE(SUM(amount::numeric), 0) as total
    FROM expenses
    WHERE church_id = $1
  `;
  
  const result = await pool.query(query, [churchId]);
  return result.rows[0];
};

export const updateExpenseService = async (id: number, data: any) => {
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.memberId !== undefined) {
    updates.push(`member_id = $${paramIndex}`);
    values.push(data.memberId ? Number(data.memberId) : null);
    paramIndex++;
  }
  if (data.categoryId !== undefined) {
    updates.push(`category_id = $${paramIndex}`);
    values.push(data.categoryId ? Number(data.categoryId) : null);
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
  if (data.description !== undefined) {
    updates.push(`description = $${paramIndex}`);
    values.push(data.description);
    paramIndex++;
  }
  if (data.date !== undefined) {
    updates.push(`date = $${paramIndex}`);
    values.push(data.date);
    paramIndex++;
  }
  if (data.status !== undefined) {
    updates.push(`status = $${paramIndex}`);
    values.push(data.status);
    paramIndex++;
  }
  if (data.paymentMethod !== undefined) {
    updates.push(`payment_method = $${paramIndex}`);
    values.push(data.paymentMethod);
    paramIndex++;
  }
  if (data.notes !== undefined) {
    updates.push(`notes = $${paramIndex}`);
    values.push(data.notes);
    paramIndex++;
  }
  if (data.receiptUrl !== undefined) {
    updates.push(`receipt_url = $${paramIndex}`);
    values.push(data.receiptUrl);
    paramIndex++;
  }
  if (data.receiptPublicId !== undefined) {
    updates.push(`receipt_public_id = $${paramIndex}`);
    values.push(data.receiptPublicId);
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE expenses 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE expense_id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  if (!result.rows[0]) throw new Error("Expense not found");
  return result.rows[0];
};

export const deleteExpenseService = async (id: number) => {
  const [result] = await db
    .delete(expenses)
    .where(eq(expenses.expenseId, id))
    .returning({ id: expenses.expenseId });
  if (!result) throw new Error("Expense not found");
  return result;
};

export const approveExpenseService = async (id: number, userId: number) => {
  const pool = db.$client;
  
  const query = `
    UPDATE expenses 
    SET 
      status = 'approved',
      approved_by = $1,
      approved_at = NOW(),
      updated_at = NOW()
    WHERE expense_id = $2
    RETURNING *
  `;
  
  const result = await pool.query(query, [userId, id]);
  if (!result.rows[0]) throw new Error("Expense not found");
  return result.rows[0];
};

export const rejectExpenseService = async (id: number, userId: number) => {
  const pool = db.$client;
  
  const query = `
    UPDATE expenses 
    SET 
      status = 'rejected',
      approved_by = $1,
      approved_at = NOW(),
      updated_at = NOW()
    WHERE expense_id = $2
    RETURNING *
  `;
  
  const result = await pool.query(query, [userId, id]);
  if (!result.rows[0]) throw new Error("Expense not found");
  return result.rows[0];
};

export const getExpensesByDateRangeService = async (churchId: number, startDate: string, endDate: string) => {
  const pool = db.$client;
  
  const query = `
    SELECT *
    FROM expenses
    WHERE church_id = $1
      AND date::date >= $2::date
      AND date::date <= $3::date
    ORDER BY date DESC
  `;
  
  const result = await pool.query(query, [churchId, startDate, endDate]);
  return result.rows;
};

export const updateExpenseStatusFromMpesa = async (checkoutRequestID: string, status: string, resultDesc?: string) => {
  const pool = db.$client;
  const query = `
    UPDATE expenses 
    SET 
      status = $1, 
      notes = COALESCE(notes, '') || ' | M-Pesa: ' || COALESCE($2, ''),
      updated_at = NOW() 
    WHERE mpesa_checkout_request_id = $3 
    RETURNING *
  `;
  const result = await pool.query(query, [status, resultDesc, checkoutRequestID]);
  return result.rows[0];
};