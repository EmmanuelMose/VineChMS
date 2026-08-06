import db from "../Drizzle/db";
import { groups, groupMembers, members, users } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const createGroupService = async (data: any) => {
  const pool = db.$client;
  
  const query = `
    INSERT INTO groups (
      church_id,
      name,
      description,
      type,
      leader_id,
      meeting_day,
      meeting_time,
      location,
      is_active
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    )
    RETURNING *
  `;

  const values = [
    Number(data.churchId),
    data.name,
    data.description || null,
    data.type || null,
    data.leaderId ? Number(data.leaderId) : null,
    data.meetingDay ? Number(data.meetingDay) : null,
    data.meetingTime || null,
    data.location || null,
    data.isActive !== undefined ? Boolean(data.isActive) : true
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
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

export const getActiveGroupsService = async (churchId: number) => {
  return await db
    .select()
    .from(groups)
    .where(and(eq(groups.isActive, true), eq(groups.churchId, churchId)))
    .orderBy(desc(groups.createdAt));
};

export const updateGroupService = async (id: number, data: any) => {
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex}`);
    values.push(data.name);
    paramIndex++;
  }
  if (data.description !== undefined) {
    updates.push(`description = $${paramIndex}`);
    values.push(data.description);
    paramIndex++;
  }
  if (data.type !== undefined) {
    updates.push(`type = $${paramIndex}`);
    values.push(data.type);
    paramIndex++;
  }
  if (data.leaderId !== undefined) {
    updates.push(`leader_id = $${paramIndex}`);
    values.push(data.leaderId ? Number(data.leaderId) : null);
    paramIndex++;
  }
  if (data.meetingDay !== undefined) {
    updates.push(`meeting_day = $${paramIndex}`);
    values.push(data.meetingDay ? Number(data.meetingDay) : null);
    paramIndex++;
  }
  if (data.meetingTime !== undefined) {
    updates.push(`meeting_time = $${paramIndex}`);
    values.push(data.meetingTime);
    paramIndex++;
  }
  if (data.location !== undefined) {
    updates.push(`location = $${paramIndex}`);
    values.push(data.location);
    paramIndex++;
  }
  if (data.isActive !== undefined) {
    updates.push(`is_active = $${paramIndex}`);
    values.push(Boolean(data.isActive));
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE groups 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE group_id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  if (!result.rows[0]) throw new Error("Group not found");
  return result.rows[0];
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
  const groupId = Number(data.groupId);
  const memberId = Number(data.memberId);
  
  const pool = db.$client;
  
  const existingCheck = await pool.query(
    'SELECT group_member_id FROM group_members WHERE group_id = $1 AND member_id = $2',
    [groupId, memberId]
  );
  
  if (existingCheck.rows.length > 0) {
    throw new Error("Member already in this group");
  }
  
  const query = `
    INSERT INTO group_members (
      group_id,
      member_id,
      role,
      is_active
    ) VALUES (
      $1, $2, $3, $4
    )
    RETURNING *
  `;

  const values = [
    groupId,
    memberId,
    data.role || 'member',
    data.isActive !== undefined ? Boolean(data.isActive) : true
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getGroupMembersService = async (groupId: number) => {
  return await db
    .select({
      groupMemberId: groupMembers.groupMemberId,
      memberId: groupMembers.memberId,
      fullName: users.fullName,
      email: users.email,
      role: groupMembers.role,
      joinedAt: groupMembers.joinedAt,
      isActive: groupMembers.isActive,
    })
    .from(groupMembers)
    .leftJoin(members, eq(groupMembers.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .where(eq(groupMembers.groupId, groupId))
    .orderBy(desc(groupMembers.joinedAt));
};

export const getMemberGroupsService = async (memberId: number) => {
  return await db
    .select({
      groupMemberId: groupMembers.groupMemberId,
      groupId: groupMembers.groupId,
      groupName: groups.name,
      groupType: groups.type,
      role: groupMembers.role,
      joinedAt: groupMembers.joinedAt,
      isActive: groupMembers.isActive,
    })
    .from(groupMembers)
    .leftJoin(groups, eq(groupMembers.groupId, groups.groupId))
    .where(eq(groupMembers.memberId, memberId))
    .orderBy(desc(groupMembers.joinedAt));
};

export const updateGroupMemberService = async (id: number, data: any) => {
  const pool = db.$client;
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.role !== undefined) {
    updates.push(`role = $${paramIndex}`);
    values.push(data.role);
    paramIndex++;
  }
  if (data.isActive !== undefined) {
    updates.push(`is_active = $${paramIndex}`);
    values.push(Boolean(data.isActive));
    paramIndex++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE group_members 
    SET ${updates.join(', ')}
    WHERE group_member_id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  if (!result.rows[0]) throw new Error("Group member not found");
  return result.rows[0];
};

export const removeMemberFromGroupService = async (id: number) => {
  const [result] = await db
    .delete(groupMembers)
    .where(eq(groupMembers.groupMemberId, id))
    .returning({ id: groupMembers.groupMemberId });
  if (!result) throw new Error("Group member not found");
  return result;
};