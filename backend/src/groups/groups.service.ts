import db from "../Drizzle/db";
import { groups, groupMembers, members, users, groupJoinRequests } from "../Drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { sendEmail } from "../mailer/mailer";

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

export const createJoinRequestService = async (data: { groupId: number; memberId: number; message?: string }) => {
  const existing = await db
    .select()
    .from(groupJoinRequests)
    .where(
      and(
        eq(groupJoinRequests.groupId, data.groupId),
        eq(groupJoinRequests.memberId, data.memberId),
        eq(groupJoinRequests.status, "pending")
      )
    )
    .limit(1);

  if (existing.length > 0) {
    throw new Error("You already have a pending request for this group.");
  }

  const member = await db.query.members.findFirst({
    where: eq(members.memberId, data.memberId),
    with: {
      user: true,
      church: true,
    },
  });

  const group = await db.query.groups.findFirst({
    where: eq(groups.groupId, data.groupId),
    with: {
      leader: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!group) throw new Error("Group not found");
  if (!member) throw new Error("Member not found");

  const isMember = await db
    .select()
    .from(groupMembers)
    .where(
      and(
        eq(groupMembers.groupId, data.groupId),
        eq(groupMembers.memberId, data.memberId)
      )
    )
    .limit(1);

  if (isMember.length > 0) {
    throw new Error("You are already a member of this group.");
  }

  const [result] = await db
    .insert(groupJoinRequests)
    .values({
      groupId: data.groupId,
      memberId: data.memberId,
      message: data.message || null,
      status: "pending",
    })
    .returning();

  const leaderEmail = group.leader?.user?.email;
  const church = member.church;
  if (!church) {
    throw new Error("Member church not found");
  }

  const adminUsers = await db.query.users.findMany({
    where: and(
      eq(users.churchId, church.churchId),
      eq(users.role, "church_admin")
    ),
  });
  const adminEmails = adminUsers.map((u) => u.email);

  const emails = [leaderEmail, ...adminEmails].filter((email): email is string => email !== undefined);

  const acceptLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/api/groups/requests/${result.requestId}/accept`;

  for (const email of emails) {
    await sendEmail(
      email,
      `New Group Join Request: ${group.name}`,
      `${member.fullName} has requested to join the group "${group.name}".\n\nMessage: ${data.message || "No message provided."}\n\nClick here to accept: ${acceptLink}`,
      `
        <h2>New Group Join Request</h2>
        <p><strong>Member:</strong> ${member.fullName} (${member.email})</p>
        <p><strong>Group:</strong> ${group.name}</p>
        <p><strong>Message:</strong> ${data.message || "No message provided."}</p>
        <p><a href="${acceptLink}" style="padding: 10px 20px; background: #1565C0; color: white; text-decoration: none; border-radius: 6px;">Accept Request</a></p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${acceptLink}</p>
      `
    );
  }

  return result;
};

export const getGroupJoinRequestsService = async (groupId: number) => {
  return await db
    .select({
      requestId: groupJoinRequests.requestId,
      groupId: groupJoinRequests.groupId,
      memberId: groupJoinRequests.memberId,
      message: groupJoinRequests.message,
      status: groupJoinRequests.status,
      createdAt: groupJoinRequests.createdAt,
      updatedAt: groupJoinRequests.updatedAt,
      memberName: users.fullName,
      memberEmail: users.email,
      groupName: groups.name,
    })
    .from(groupJoinRequests)
    .leftJoin(groups, eq(groupJoinRequests.groupId, groups.groupId))
    .leftJoin(members, eq(groupJoinRequests.memberId, members.memberId))
    .leftJoin(users, eq(members.userId, users.userId))
    .where(eq(groupJoinRequests.groupId, groupId))
    .orderBy(desc(groupJoinRequests.createdAt));
};

export const getMyJoinRequestsService = async (memberId: number) => {
  return await db
    .select({
      requestId: groupJoinRequests.requestId,
      groupId: groupJoinRequests.groupId,
      message: groupJoinRequests.message,
      status: groupJoinRequests.status,
      createdAt: groupJoinRequests.createdAt,
      updatedAt: groupJoinRequests.updatedAt,
      groupName: groups.name,
    })
    .from(groupJoinRequests)
    .leftJoin(groups, eq(groupJoinRequests.groupId, groups.groupId))
    .where(eq(groupJoinRequests.memberId, memberId))
    .orderBy(desc(groupJoinRequests.createdAt));
};

export const approveJoinRequestService = async (requestId: number) => {
  const [request] = await db
    .select()
    .from(groupJoinRequests)
    .where(eq(groupJoinRequests.requestId, requestId))
    .limit(1);

  if (!request) throw new Error("Request not found");
  if (request.status !== "pending") throw new Error("Request already processed");

  const [updated] = await db
    .update(groupJoinRequests)
    .set({ status: "approved", updatedAt: new Date() })
    .where(eq(groupJoinRequests.requestId, requestId))
    .returning();

  await db.insert(groupMembers).values({
    groupId: request.groupId,
    memberId: request.memberId,
    isActive: true,
    role: "member",
  });

  const member = await db.query.members.findFirst({
    where: eq(members.memberId, request.memberId),
    with: { user: true },
  });
  const group = await db.query.groups.findFirst({
    where: eq(groups.groupId, request.groupId),
  });

  if (member?.user?.email) {
    await sendEmail(
      member.user.email,
      `Group Join Request Approved: ${group?.name}`,
      `Your request to join "${group?.name}" has been approved. You are now a member.`,
      `<h2>Request Approved</h2><p>Your request to join <strong>${group?.name}</strong> has been approved.</p>`
    );
  }

  return updated;
};

export const rejectJoinRequestService = async (requestId: number) => {
  const [request] = await db
    .select()
    .from(groupJoinRequests)
    .where(eq(groupJoinRequests.requestId, requestId))
    .limit(1);

  if (!request) throw new Error("Request not found");
  if (request.status !== "pending") throw new Error("Request already processed");

  const [updated] = await db
    .update(groupJoinRequests)
    .set({ status: "rejected", updatedAt: new Date() })
    .where(eq(groupJoinRequests.requestId, requestId))
    .returning();

  const member = await db.query.members.findFirst({
    where: eq(members.memberId, request.memberId),
    with: { user: true },
  });
  const group = await db.query.groups.findFirst({
    where: eq(groups.groupId, request.groupId),
  });

  if (member?.user?.email) {
    await sendEmail(
      member.user.email,
      `Group Join Request Rejected: ${group?.name}`,
      `Your request to join "${group?.name}" has been rejected.`,
      `<h2>Request Rejected</h2><p>Your request to join <strong>${group?.name}</strong> has been rejected.</p>`
    );
  }

  return updated;
};