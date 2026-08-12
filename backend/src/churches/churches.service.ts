import db from "../Drizzle/db";
import { churches, members, users } from "../Drizzle/schema";
import { eq, desc, inArray } from "drizzle-orm";

export const createChurchService = async (userId: number, data: any) => {
  const [result] = await db
    .insert(churches)
    .values({ ...data, createdBy: userId })
    .returning();
  return result;
};

export const getChurchesService = async (userId?: number) => {
  if (userId) {
    return await db
      .select()
      .from(churches)
      .where(eq(churches.createdBy, userId))
      .orderBy(desc(churches.createdAt));
  }
  return await db
    .select()
    .from(churches)
    .orderBy(desc(churches.createdAt));
};

export const getChurchesByOrganizationService = async (organizationId: number) => {
  return await db
    .select()
    .from(churches)
    .where(eq(churches.organizationId, organizationId))
    .orderBy(desc(churches.createdAt));
};

export const getChurchesByOrganizationIdsService = async (organizationIds: number[]) => {
  if (organizationIds.length === 0) {
    return [];
  }
  return await db
    .select()
    .from(churches)
    .where(inArray(churches.organizationId, organizationIds))
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
      role: members.role,
      createdAt: members.createdAt,
    })
    .from(members)
    .leftJoin(users, eq(members.userId, users.userId))
    .where(eq(members.churchId, churchId))
    .orderBy(desc(members.createdAt));
};