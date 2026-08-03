import db from "../Drizzle/db";
import { members, users } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createMemberService = async (data: any) => {
  const [result] = await db
    .insert(members)
    .values(data)
    .returning();
  return result;
};

export const getMembersService = async () => {
  return await db
    .select({
      memberId: members.memberId,
      userId: members.userId,
      email: users.email,
      fullName: users.fullName,
      churchId: members.churchId,
      membershipNumber: members.membershipNumber,
      isActive: members.isActive,
      isBaptized: members.isBaptized,
      isLeader: members.isLeader,
    })
    .from(members)
    .leftJoin(users, eq(members.userId, users.userId))
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