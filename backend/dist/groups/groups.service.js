"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectJoinRequestService = exports.approveJoinRequestService = exports.getMyJoinRequestsService = exports.getGroupJoinRequestsService = exports.createJoinRequestService = exports.removeMemberFromGroupService = exports.updateGroupMemberService = exports.getMemberGroupsService = exports.getGroupMembersService = exports.addMemberToGroupService = exports.deleteGroupService = exports.updateGroupService = exports.getActiveGroupsService = exports.getGroupsByChurchService = exports.getGroupByIdService = exports.createGroupService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const mailer_1 = require("../mailer/mailer");
const createGroupService = async (data) => {
    const pool = db_1.default.$client;
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
exports.createGroupService = createGroupService;
const getGroupByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.groups)
        .where((0, drizzle_orm_1.eq)(schema_1.groups.groupId, id));
    if (!result)
        throw new Error("Group not found");
    return result;
};
exports.getGroupByIdService = getGroupByIdService;
const getGroupsByChurchService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.groups)
        .where((0, drizzle_orm_1.eq)(schema_1.groups.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.groups.createdAt));
};
exports.getGroupsByChurchService = getGroupsByChurchService;
const getActiveGroupsService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.groups)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groups.isActive, true), (0, drizzle_orm_1.eq)(schema_1.groups.churchId, churchId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.groups.createdAt));
};
exports.getActiveGroupsService = getActiveGroupsService;
const updateGroupService = async (id, data) => {
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
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
    if (!result.rows[0])
        throw new Error("Group not found");
    return result.rows[0];
};
exports.updateGroupService = updateGroupService;
const deleteGroupService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.groups)
        .where((0, drizzle_orm_1.eq)(schema_1.groups.groupId, id))
        .returning({ id: schema_1.groups.groupId });
    if (!result)
        throw new Error("Group not found");
    return result;
};
exports.deleteGroupService = deleteGroupService;
const addMemberToGroupService = async (data) => {
    const groupId = Number(data.groupId);
    const memberId = Number(data.memberId);
    const pool = db_1.default.$client;
    const existingCheck = await pool.query('SELECT group_member_id FROM group_members WHERE group_id = $1 AND member_id = $2', [groupId, memberId]);
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
exports.addMemberToGroupService = addMemberToGroupService;
const getGroupMembersService = async (groupId) => {
    return await db_1.default
        .select({
        groupMemberId: schema_1.groupMembers.groupMemberId,
        memberId: schema_1.groupMembers.memberId,
        fullName: schema_1.users.fullName,
        email: schema_1.users.email,
        role: schema_1.groupMembers.role,
        joinedAt: schema_1.groupMembers.joinedAt,
        isActive: schema_1.groupMembers.isActive,
    })
        .from(schema_1.groupMembers)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.groupMembers.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .where((0, drizzle_orm_1.eq)(schema_1.groupMembers.groupId, groupId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.groupMembers.joinedAt));
};
exports.getGroupMembersService = getGroupMembersService;
const getMemberGroupsService = async (memberId) => {
    return await db_1.default
        .select({
        groupMemberId: schema_1.groupMembers.groupMemberId,
        groupId: schema_1.groupMembers.groupId,
        groupName: schema_1.groups.name,
        groupType: schema_1.groups.type,
        role: schema_1.groupMembers.role,
        joinedAt: schema_1.groupMembers.joinedAt,
        isActive: schema_1.groupMembers.isActive,
    })
        .from(schema_1.groupMembers)
        .leftJoin(schema_1.groups, (0, drizzle_orm_1.eq)(schema_1.groupMembers.groupId, schema_1.groups.groupId))
        .where((0, drizzle_orm_1.eq)(schema_1.groupMembers.memberId, memberId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.groupMembers.joinedAt));
};
exports.getMemberGroupsService = getMemberGroupsService;
const updateGroupMemberService = async (id, data) => {
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
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
    if (!result.rows[0])
        throw new Error("Group member not found");
    return result.rows[0];
};
exports.updateGroupMemberService = updateGroupMemberService;
const removeMemberFromGroupService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.groupMembers)
        .where((0, drizzle_orm_1.eq)(schema_1.groupMembers.groupMemberId, id))
        .returning({ id: schema_1.groupMembers.groupMemberId });
    if (!result)
        throw new Error("Group member not found");
    return result;
};
exports.removeMemberFromGroupService = removeMemberFromGroupService;
const createJoinRequestService = async (data) => {
    const existing = await db_1.default
        .select()
        .from(schema_1.groupJoinRequests)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.groupId, data.groupId), (0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.memberId, data.memberId), (0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.status, "pending")))
        .limit(1);
    if (existing.length > 0) {
        throw new Error("You already have a pending request for this group.");
    }
    const member = await db_1.default.query.members.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.members.memberId, data.memberId),
        with: {
            user: true,
            church: true,
        },
    });
    const group = await db_1.default.query.groups.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.groups.groupId, data.groupId),
        with: {
            leader: {
                with: {
                    user: true,
                },
            },
        },
    });
    if (!group)
        throw new Error("Group not found");
    if (!member)
        throw new Error("Member not found");
    const isMember = await db_1.default
        .select()
        .from(schema_1.groupMembers)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.groupMembers.groupId, data.groupId), (0, drizzle_orm_1.eq)(schema_1.groupMembers.memberId, data.memberId)))
        .limit(1);
    if (isMember.length > 0) {
        throw new Error("You are already a member of this group.");
    }
    const [result] = await db_1.default
        .insert(schema_1.groupJoinRequests)
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
    const adminUsers = await db_1.default.query.users.findMany({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.churchId, church.churchId), (0, drizzle_orm_1.eq)(schema_1.users.role, "church_admin")),
    });
    const adminEmails = adminUsers.map((u) => u.email);
    const emails = [leaderEmail, ...adminEmails].filter((email) => email !== undefined);
    const acceptLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/api/groups/requests/${result.requestId}/accept`;
    for (const email of emails) {
        await (0, mailer_1.sendEmail)(email, `New Group Join Request: ${group.name}`, `${member.fullName} has requested to join the group "${group.name}".\n\nMessage: ${data.message || "No message provided."}\n\nClick here to accept: ${acceptLink}`, `
        <h2>New Group Join Request</h2>
        <p><strong>Member:</strong> ${member.fullName} (${member.email})</p>
        <p><strong>Group:</strong> ${group.name}</p>
        <p><strong>Message:</strong> ${data.message || "No message provided."}</p>
        <p><a href="${acceptLink}" style="padding: 10px 20px; background: #1565C0; color: white; text-decoration: none; border-radius: 6px;">Accept Request</a></p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${acceptLink}</p>
      `);
    }
    return result;
};
exports.createJoinRequestService = createJoinRequestService;
const getGroupJoinRequestsService = async (groupId) => {
    return await db_1.default
        .select({
        requestId: schema_1.groupJoinRequests.requestId,
        groupId: schema_1.groupJoinRequests.groupId,
        memberId: schema_1.groupJoinRequests.memberId,
        message: schema_1.groupJoinRequests.message,
        status: schema_1.groupJoinRequests.status,
        createdAt: schema_1.groupJoinRequests.createdAt,
        updatedAt: schema_1.groupJoinRequests.updatedAt,
        memberName: schema_1.users.fullName,
        memberEmail: schema_1.users.email,
        groupName: schema_1.groups.name,
    })
        .from(schema_1.groupJoinRequests)
        .leftJoin(schema_1.groups, (0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.groupId, schema_1.groups.groupId))
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .where((0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.groupId, groupId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.groupJoinRequests.createdAt));
};
exports.getGroupJoinRequestsService = getGroupJoinRequestsService;
const getMyJoinRequestsService = async (memberId) => {
    return await db_1.default
        .select({
        requestId: schema_1.groupJoinRequests.requestId,
        groupId: schema_1.groupJoinRequests.groupId,
        message: schema_1.groupJoinRequests.message,
        status: schema_1.groupJoinRequests.status,
        createdAt: schema_1.groupJoinRequests.createdAt,
        updatedAt: schema_1.groupJoinRequests.updatedAt,
        groupName: schema_1.groups.name,
    })
        .from(schema_1.groupJoinRequests)
        .leftJoin(schema_1.groups, (0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.groupId, schema_1.groups.groupId))
        .where((0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.memberId, memberId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.groupJoinRequests.createdAt));
};
exports.getMyJoinRequestsService = getMyJoinRequestsService;
const approveJoinRequestService = async (requestId) => {
    const [request] = await db_1.default
        .select()
        .from(schema_1.groupJoinRequests)
        .where((0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.requestId, requestId))
        .limit(1);
    if (!request)
        throw new Error("Request not found");
    if (request.status !== "pending")
        throw new Error("Request already processed");
    const [updated] = await db_1.default
        .update(schema_1.groupJoinRequests)
        .set({ status: "approved", updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.requestId, requestId))
        .returning();
    await db_1.default.insert(schema_1.groupMembers).values({
        groupId: request.groupId,
        memberId: request.memberId,
        isActive: true,
        role: "member",
    });
    const member = await db_1.default.query.members.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.members.memberId, request.memberId),
        with: { user: true },
    });
    const group = await db_1.default.query.groups.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.groups.groupId, request.groupId),
    });
    if (member?.user?.email) {
        await (0, mailer_1.sendEmail)(member.user.email, `Group Join Request Approved: ${group?.name}`, `Your request to join "${group?.name}" has been approved. You are now a member.`, `<h2>Request Approved</h2><p>Your request to join <strong>${group?.name}</strong> has been approved.</p>`);
    }
    return updated;
};
exports.approveJoinRequestService = approveJoinRequestService;
const rejectJoinRequestService = async (requestId) => {
    const [request] = await db_1.default
        .select()
        .from(schema_1.groupJoinRequests)
        .where((0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.requestId, requestId))
        .limit(1);
    if (!request)
        throw new Error("Request not found");
    if (request.status !== "pending")
        throw new Error("Request already processed");
    const [updated] = await db_1.default
        .update(schema_1.groupJoinRequests)
        .set({ status: "rejected", updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.groupJoinRequests.requestId, requestId))
        .returning();
    const member = await db_1.default.query.members.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.members.memberId, request.memberId),
        with: { user: true },
    });
    const group = await db_1.default.query.groups.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.groups.groupId, request.groupId),
    });
    if (member?.user?.email) {
        await (0, mailer_1.sendEmail)(member.user.email, `Group Join Request Rejected: ${group?.name}`, `Your request to join "${group?.name}" has been rejected.`, `<h2>Request Rejected</h2><p>Your request to join <strong>${group?.name}</strong> has been rejected.</p>`);
    }
    return updated;
};
exports.rejectJoinRequestService = rejectJoinRequestService;
