import db from "../Drizzle/db";
import { leaders, members, users, positions } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

const toDate = (value: any): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return date;
  }
  if (typeof value === 'number') return new Date(value);
  return null;
};

const toDateOrNow = (value: any): Date => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  if (typeof value === 'number') return new Date(value);
  return new Date();
};

export const createLeaderService = async (data: any) => {
  const processedData = {
    ...data,
    startDate: toDateOrNow(data.startDate),
    endDate: toDate(data.endDate),
    approvedAt: data.approvedAt ? toDate(data.approvedAt) : null,
    isActive: data.isActive !== undefined ? data.isActive : true,
    isApproved: data.isApproved !== undefined ? data.isApproved : false,
  };

  Object.keys(processedData).forEach(key => {
    if (processedData[key] === undefined) {
      delete processedData[key];
    }
  });

  const [result] = await db
    .insert(leaders)
    .values(processedData)
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
      approvedBy: leaders.approvedBy,
      approvedAt: leaders.approvedAt,
      notes: leaders.notes,
      profilePicture: leaders.profilePicture,
      createdAt: leaders.createdAt,
      updatedAt: leaders.updatedAt,
    })
    .from(leaders)
    .leftJoin(members, eq(leaders.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .leftJoin(positions, eq(leaders.positionId, positions.positionId))
    .orderBy(desc(leaders.createdAt));
};

export const getLeaderByIdService = async (id: number) => {
  const [result] = await db
    .select({
      leaderId: leaders.leaderId,
      memberId: leaders.memberId,
      positionId: leaders.positionId,
      startDate: leaders.startDate,
      endDate: leaders.endDate,
      isActive: leaders.isActive,
      isApproved: leaders.isApproved,
      approvedBy: leaders.approvedBy,
      approvedAt: leaders.approvedAt,
      notes: leaders.notes,
      profilePicture: leaders.profilePicture,
      createdAt: leaders.createdAt,
      updatedAt: leaders.updatedAt,
    })
    .from(leaders)
    .where(eq(leaders.leaderId, id));

  if (!result) {
    throw new Error("Leader not found");
  }

  return result;
};

export const getLeadersByMemberService = async (memberId: number) => {
  return await db
    .select({
      leaderId: leaders.leaderId,
      positionId: leaders.positionId,
      positionName: positions.name,
      startDate: leaders.startDate,
      endDate: leaders.endDate,
      isActive: leaders.isActive,
      isApproved: leaders.isApproved,
      notes: leaders.notes,
    })
    .from(leaders)
    .leftJoin(positions, eq(leaders.positionId, positions.positionId))
    .where(eq(leaders.memberId, memberId))
    .orderBy(desc(leaders.createdAt));
};

export const getLeadersByPositionService = async (positionId: number) => {
  return await db
    .select({
      leaderId: leaders.leaderId,
      memberId: leaders.memberId,
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
    .where(eq(leaders.positionId, positionId))
    .orderBy(desc(leaders.createdAt));
};

export const getLeadersByChurchService = async (churchId: number) => {
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
    .where(eq(members.churchId, churchId))
    .orderBy(desc(leaders.createdAt));
};

export const updateLeaderService = async (id: number, data: any) => {
  const processedData: any = {
    ...data,
    updatedAt: new Date(),
  };

  if (data.startDate !== undefined) {
    processedData.startDate = data.startDate ? toDate(data.startDate) : null;
  }
  if (data.endDate !== undefined) {
    processedData.endDate = data.endDate ? toDate(data.endDate) : null;
  }
  if (data.approvedAt !== undefined) {
    processedData.approvedAt = data.approvedAt ? toDate(data.approvedAt) : null;
  }

  Object.keys(processedData).forEach(key => {
    if (processedData[key] === undefined) {
      delete processedData[key];
    }
  });

  const [result] = await db
    .update(leaders)
    .set(processedData)
    .where(eq(leaders.leaderId, id))
    .returning();

  if (!result) {
    throw new Error("Leader not found");
  }

  return result;
};

export const deleteLeaderService = async (id: number) => {
  const [result] = await db
    .update(leaders)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(leaders.leaderId, id))
    .returning({ id: leaders.leaderId });

  if (!result) {
    throw new Error("Leader not found");
  }

  return result;
};

export const hardDeleteLeaderService = async (id: number) => {
  const [result] = await db
    .delete(leaders)
    .where(eq(leaders.leaderId, id))
    .returning({ id: leaders.leaderId });

  if (!result) {
    throw new Error("Leader not found");
  }

  return result;
};

export const approveLeaderService = async (id: number, userId: number) => {
  const [result] = await db
    .update(leaders)
    .set({
      isApproved: true,
      approvedBy: userId,
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(leaders.leaderId, id))
    .returning();

  if (!result) {
    throw new Error("Leader not found");
  }

  return result;
};

export const revokeApprovalService = async (id: number) => {
  const [result] = await db
    .update(leaders)
    .set({
      isApproved: false,
      approvedBy: null,
      approvedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(leaders.leaderId, id))
    .returning();

  if (!result) {
    throw new Error("Leader not found");
  }

  return result;
};

export const getActiveLeadersService = async () => {
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
    .where(eq(leaders.isActive, true))
    .orderBy(desc(leaders.createdAt));
};

export const getApprovedLeadersService = async () => {
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
    .where(eq(leaders.isApproved, true))
    .orderBy(desc(leaders.createdAt));
};

export const getLeadersSummaryService = async () => {
  const allLeaders = await db
    .select()
    .from(leaders);

  const total = allLeaders.length;
  const active = allLeaders.filter(l => l.isActive).length;
  const approved = allLeaders.filter(l => l.isApproved).length;
  const pending = allLeaders.filter(l => !l.isApproved && l.isActive).length;
  const inactive = allLeaders.filter(l => !l.isActive).length;

  return {
    total,
    active,
    approved,
    pending,
    inactive,
  };
};