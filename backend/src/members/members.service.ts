import db from "../Drizzle/db";
import { members } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const getMembersService = async () => {
  return await db
    .select()
    .from(members)
    .orderBy(desc(members.createdAt));
};

export const getMembersByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(members)
    .where(eq(members.churchId, churchId))
    .orderBy(desc(members.createdAt));
};

export const getMembersByOrganizationService = async (organizationId: number) => {
  return await db
    .select()
    .from(members)
    .where(eq(members.organizationId, organizationId))
    .orderBy(desc(members.createdAt));
};

export const getMembersByLargeOrganizationService = async (largeOrganizationId: number) => {
  return await db
    .select()
    .from(members)
    .where(eq(members.largeOrganizationId, largeOrganizationId))
    .orderBy(desc(members.createdAt));
};

export const getMemberByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(members)
    .where(eq(members.memberId, id));
  if (!result) throw new Error("Member not found");
  return result;
};

export const getMemberByUserIdService = async (userId: number) => {
  const [result] = await db
    .select()
    .from(members)
    .where(eq(members.userId, userId));
  if (!result) throw new Error("Member not found");
  return result;
};

export const updateMemberService = async (id: number, data: any) => {
  const [result] = await db
    .update(members)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(members.memberId, id))
    .returning();
  if (!result) throw new Error("Member not found");
  return result;
};

export const deleteMemberService = async (id: number) => {
  const [result] = await db
    .delete(members)
    .where(eq(members.memberId, id))
    .returning({ id: members.memberId });
  if (!result) throw new Error("Member not found");
  return result;
};