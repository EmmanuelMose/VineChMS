import db from "../Drizzle/db";
import { leaders, members, users, positions } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createLeaderService = async (data: any) => {
  const [result] = await db
    .insert(leaders)
    .values(data)
    .returning();
  return result;
};

export const getLeadersService = async () => {
  return await db
    .select({
      leaderId: leaders.leaderId,
      memberId: leaders.memberId,
      positionId: leaders.positionId,
      positionName: positions.name,
      fullName: users.fullName,
      email: users.email,
      startDate: leaders.startDate,
      endDate: leaders.endDate,
      isActive: leaders.isActive,
      isApproved: leaders.isApproved,
    })
    .from(leaders)
    .leftJoin(members, eq(leaders.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .leftJoin(positions, eq(leaders.positionId, positions.positionId))
    .orderBy(desc(leaders.createdAt));
};

export const getLeaderByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(leaders)
    .where(eq(leaders.leaderId, id));
  if (!result) throw new Error("Leader not found");
  return result;
};

export const updateLeaderService = async (id: number, data: any) => {
  const [result] = await db
    .update(leaders)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(leaders.leaderId, id))
    .returning();
  if (!result) throw new Error("Leader not found");
  return result;
};

export const deleteLeaderService = async (id: number) => {
  const [result] = await db
    .delete(leaders)
    .where(eq(leaders.leaderId, id))
    .returning({ id: leaders.leaderId });
  if (!result) throw new Error("Leader not found");
  return result;
};

export const approveLeaderService = async (id: number, userId: number) => {
  const [result] = await db
    .update(leaders)
    .set({
      isApproved: true,
      approvedBy: userId,
      approvedAt: new Date(),
    })
    .where(eq(leaders.leaderId, id))
    .returning();
  if (!result) throw new Error("Leader not found");
  return result;
};