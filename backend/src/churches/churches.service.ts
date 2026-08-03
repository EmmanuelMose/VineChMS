import db from "../Drizzle/db";
import { churches, members, users } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createChurchService = async (userId: number, data: any) => {
  const [result] = await db
    .insert(churches)
    .values({ ...data, createdBy: userId })
    .returning();
  return result;
};

export const getChurchesService = async (userId: number) => {
  return await db
    .select()
    .from(churches)
    .where(eq(churches.createdBy, userId))
    .orderBy(desc(churches.createdAt));
};

export const getChurchByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(churches)
    .where(eq(churches.churchId, id));
  if (!result) throw new Error("Church not found");
  return result;
};

export const updateChurchService = async (id: number, data: any) => {
  const [result] = await db
    .update(churches)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(churches.churchId, id))
    .returning();
  if (!result) throw new Error("Church not found");
  return result;
};

export const deleteChurchService = async (id: number) => {
  const [result] = await db
    .delete(churches)
    .where(eq(churches.churchId, id))
    .returning({ id: churches.churchId });
  if (!result) throw new Error("Church not found");
  return result;
};

export const getChurchMembersService = async (churchId: number) => {
  return await db
    .select({
      memberId: members.memberId,
      userId: members.userId,
      email: users.email,
      fullName: users.fullName,
      membershipNumber: members.membershipNumber,
      isActive: members.isActive,
      isBaptized: members.isBaptized,
      isLeader: members.isLeader,
    })
    .from(members)
    .leftJoin(users, eq(members.userId, users.userId))
    .where(eq(members.churchId, churchId));
};