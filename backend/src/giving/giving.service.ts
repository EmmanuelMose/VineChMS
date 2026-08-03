import db from "../Drizzle/db";
import { giving, givingCategories, members, users } from "../Drizzle/schema";
import { eq, desc, sum } from "drizzle-orm";

export const createGivingService = async (data: any) => {
  const [result] = await db
    .insert(giving)
    .values(data)
    .returning();
  return result;
};

export const getGivingService = async () => {
  return await db
    .select({
      givingId: giving.givingId,
      memberId: giving.memberId,
      fullName: users.fullName,
      categoryName: givingCategories.name,
      amount: giving.amount,
      type: giving.type,
      date: giving.date,
      status: giving.status,
      paymentMethod: giving.paymentMethod,
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

export const getGivingSummaryService = async (churchId: number) => {
  const result = await db
    .select({
      totalAmount: sum(giving.amount),
      type: giving.type,
    })
    .from(giving)
    .where(eq(giving.churchId, churchId))
    .groupBy(giving.type);
  return result;
};

export const updateGivingService = async (id: number, data: any) => {
  const [result] = await db
    .update(giving)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(giving.givingId, id))
    .returning();
  if (!result) throw new Error("Giving record not found");
  return result;
};

export const deleteGivingService = async (id: number) => {
  const [result] = await db
    .delete(giving)
    .where(eq(giving.givingId, id))
    .returning({ id: giving.givingId });
  if (!result) throw new Error("Giving record not found");
  return result;
};