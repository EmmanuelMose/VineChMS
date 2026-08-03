import db from "../Drizzle/db";
import { groups, groupMembers, members, users } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const createGroupService = async (data: any) => {
  const [result] = await db
    .insert(groups)
    .values(data)
    .returning();
  return result;
};

export const getGroupsService = async () => {
  return await db
    .select()
    .from(groups)
    .orderBy(desc(groups.createdAt));
};

export const getGroupByIdService = async (id: number) => {
  const [result] = await db
    .select()
    .from(groups)
    .where(eq(groups.groupId, id));
  if (!result) throw new Error("Group not found");
  return result;
};

export const getGroupsByChurchService = async (churchId: number) => {
  return await db
    .select()
    .from(groups)
    .where(eq(groups.churchId, churchId))
    .orderBy(desc(groups.createdAt));
};

export const updateGroupService = async (id: number, data: any) => {
  const [result] = await db
    .update(groups)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(groups.groupId, id))
    .returning();
  if (!result) throw new Error("Group not found");
  return result;
};

export const deleteGroupService = async (id: number) => {
  const [result] = await db
    .delete(groups)
    .where(eq(groups.groupId, id))
    .returning({ id: groups.groupId });
  if (!result) throw new Error("Group not found");
  return result;
};

export const addMemberToGroupService = async (data: any) => {
  const [result] = await db
    .insert(groupMembers)
    .values(data)
    .returning();
  return result;
};

export const getGroupMembersService = async (groupId: number) => {
  return await db
    .select({
      groupMemberId: groupMembers.groupMemberId,
      memberId: groupMembers.memberId,
      fullName: users.fullName,
      email: users.email,
      joinedAt: groupMembers.joinedAt,
      isActive: groupMembers.isActive,
    })
    .from(groupMembers)
    .leftJoin(members, eq(groupMembers.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .where(eq(groupMembers.groupId, groupId));
};

export const removeMemberFromGroupService = async (id: number) => {
  const [result] = await db
    .delete(groupMembers)
    .where(eq(groupMembers.groupMemberId, id))
    .returning({ id: groupMembers.groupMemberId });
  if (!result) throw new Error("Group member not found");
  return result;
};