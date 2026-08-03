import db from "../Drizzle/db";
import { prayerRequests, prayerInteractions, members, users } from "../Drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

export const createPrayerRequestService = async (data: any) => {
  const [result] = await db
    .insert(prayerRequests)
    .values(data)
    .returning();
  return result;
};

export const getPrayerRequestsService = async () => {
  return await db
    .select({
      prayerRequestId: prayerRequests.prayerRequestId,
      title: prayerRequests.title,
      description: prayerRequests.description,
      fullName: users.fullName,
      status: prayerRequests.status,
      visibility: prayerRequests.visibility,
      prayerCount: prayerRequests.prayerCount,
      createdAt: prayerRequests.createdAt,
    })
    .from(prayerRequests)
    .leftJoin(members, eq(prayerRequests.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .orderBy(desc(prayerRequests.createdAt));
};

export const getPrayerRequestByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(prayerRequests)
    .where(eq(prayerRequests.prayerRequestId, id));
  if (!result) throw new Error("Prayer request not found");
  return result;
};

export const getPrayerRequestsByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(prayerRequests)
    .where(eq(prayerRequests.churchId, churchId))
    .orderBy(desc(prayerRequests.createdAt));
};

export const updatePrayerRequestService = async (id: number, data: any) => {
  const [result] = await db
    .update(prayerRequests)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(prayerRequests.prayerRequestId, id))
    .returning();
  if (!result) throw new Error("Prayer request not found");
  return result;
};

export const deletePrayerRequestService = async (id: number) => {
  const [result] = await db
    .delete(prayerRequests)
    .where(eq(prayerRequests.prayerRequestId, id))
    .returning({ id: prayerRequests.prayerRequestId });
  if (!result) throw new Error("Prayer request not found");
  return result;
};

export const prayForRequestService = async (prayerRequestId: number, memberId: number) => {
  const [result] = await db
    .insert(prayerInteractions)
    .values({
      prayerRequestId,
      memberId,
      type: "prayed",
    })
    .returning();
  
  await db
    .update(prayerRequests)
    .set({
      prayerCount: sql`${prayerRequests.prayerCount} + 1`,
    })
    .where(eq(prayerRequests.prayerRequestId, prayerRequestId));
  
  return result;
};

export const getPrayerInteractionsService = async (prayerRequestId: number) => {
  return await db
    .select({
      interactionId: prayerInteractions.interactionId,
      fullName: users.fullName,
      type: prayerInteractions.type,
      notes: prayerInteractions.notes,
      createdAt: prayerInteractions.createdAt,
    })
    .from(prayerInteractions)
    .leftJoin(members, eq(prayerInteractions.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .where(eq(prayerInteractions.prayerRequestId, prayerRequestId));
};