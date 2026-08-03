import db from "../Drizzle/db";
import { expenses, expenseCategories } from "../Drizzle/schema";
import { eq, desc, sum } from "drizzle-orm";

export const createExpenseService = async (data: any) => {
  const [result] = await db
    .insert(expenses)
    .values(data)
    .returning();
  return result;
};

export const getExpensesService = async () => {
  return await db
    .select({
      expenseId: expenses.expenseId,
      categoryName: expenseCategories.name,
      amount: expenses.amount,
      description: expenses.description,
      date: expenses.date,
      status: expenses.status,
    })
    .from(expenses)
    .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.categoryId))
    .orderBy(desc(expenses.date));
};

export const getExpenseByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(expenses)
    .where(eq(expenses.expenseId, id));
  if (!result) throw new Error("Expense record not found");
  return result;
};

export const getExpensesByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(expenses)
    .where(eq(expenses.churchId, churchId))
    .orderBy(desc(expenses.date));
};

export const getExpensesSummaryService = async (churchId: number) => {
  const result = await db
    .select({
      totalAmount: sum(expenses.amount),
      status: expenses.status,
    })
    .from(expenses)
    .where(eq(expenses.churchId, churchId))
    .groupBy(expenses.status);
  return result;
};

export const updateExpenseService = async (id: number, data: any) => {
  const [result] = await db
    .update(expenses)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(expenses.expenseId, id))
    .returning();
  if (!result) throw new Error("Expense record not found");
  return result;
};

export const deleteExpenseService = async (id: number) => {
  const [result] = await db
    .delete(expenses)
    .where(eq(expenses.expenseId, id))
    .returning({ id: expenses.expenseId });
  if (!result) throw new Error("Expense record not found");
  return result;
};

export const approveExpenseService = async (id: number, userId: number) => {
  const [result] = await db
    .update(expenses)
    .set({
      status: "approved",
      approvedBy: userId,
      approvedAt: new Date(),
    })
    .where(eq(expenses.expenseId, id))
    .returning();
  if (!result) throw new Error("Expense record not found");
  return result;
};