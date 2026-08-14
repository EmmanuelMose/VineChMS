"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertVisitorToMemberService = exports.deleteVisitorService = exports.updateVisitorService = exports.getVisitorsByDateRangeService = exports.getVisitorsByServiceService = exports.getVisitorsByChurchService = exports.getVisitorByIdService = exports.createVisitorService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createVisitorService = async (data) => {
    const pool = db_1.default.$client;
    const query = `
    INSERT INTO visitors (
      church_id,
      full_name,
      email,
      phone,
      address,
      profile_picture,
      visited_date,
      service_id,
      is_member,
      member_id,
      notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    )
    RETURNING *
  `;
    const values = [
        Number(data.churchId),
        data.fullName,
        data.email || null,
        data.phone || null,
        data.address || null,
        data.profilePicture || null,
        data.visitedDate || new Date().toISOString(),
        data.serviceId ? Number(data.serviceId) : null,
        data.isMember !== undefined ? Boolean(data.isMember) : false,
        data.memberId ? Number(data.memberId) : null,
        data.notes || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};
exports.createVisitorService = createVisitorService;
const getVisitorByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.visitors)
        .where((0, drizzle_orm_1.eq)(schema_1.visitors.visitorId, id));
    if (!result)
        throw new Error("Visitor not found");
    return result;
};
exports.getVisitorByIdService = getVisitorByIdService;
const getVisitorsByChurchService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.visitors)
        .where((0, drizzle_orm_1.eq)(schema_1.visitors.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.visitors.visitedDate));
};
exports.getVisitorsByChurchService = getVisitorsByChurchService;
const getVisitorsByServiceService = async (serviceId) => {
    return await db_1.default
        .select()
        .from(schema_1.visitors)
        .where((0, drizzle_orm_1.eq)(schema_1.visitors.serviceId, serviceId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.visitors.visitedDate));
};
exports.getVisitorsByServiceService = getVisitorsByServiceService;
const getVisitorsByDateRangeService = async (churchId, startDate, endDate) => {
    const pool = db_1.default.$client;
    const query = `
    SELECT *
    FROM visitors
    WHERE church_id = $1
      AND visited_date::date >= $2::date
      AND visited_date::date <= $3::date
    ORDER BY visited_date DESC
  `;
    const result = await pool.query(query, [churchId, startDate, endDate]);
    return result.rows;
};
exports.getVisitorsByDateRangeService = getVisitorsByDateRangeService;
const updateVisitorService = async (id, data) => {
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.fullName !== undefined) {
        updates.push(`full_name = $${paramIndex}`);
        values.push(data.fullName);
        paramIndex++;
    }
    if (data.email !== undefined) {
        updates.push(`email = $${paramIndex}`);
        values.push(data.email);
        paramIndex++;
    }
    if (data.phone !== undefined) {
        updates.push(`phone = $${paramIndex}`);
        values.push(data.phone);
        paramIndex++;
    }
    if (data.address !== undefined) {
        updates.push(`address = $${paramIndex}`);
        values.push(data.address);
        paramIndex++;
    }
    if (data.profilePicture !== undefined) {
        updates.push(`profile_picture = $${paramIndex}`);
        values.push(data.profilePicture);
        paramIndex++;
    }
    if (data.visitedDate !== undefined) {
        updates.push(`visited_date = $${paramIndex}`);
        values.push(data.visitedDate);
        paramIndex++;
    }
    if (data.serviceId !== undefined) {
        updates.push(`service_id = $${paramIndex}`);
        values.push(data.serviceId ? Number(data.serviceId) : null);
        paramIndex++;
    }
    if (data.isMember !== undefined) {
        updates.push(`is_member = $${paramIndex}`);
        values.push(Boolean(data.isMember));
        paramIndex++;
    }
    if (data.memberId !== undefined) {
        updates.push(`member_id = $${paramIndex}`);
        values.push(data.memberId ? Number(data.memberId) : null);
        paramIndex++;
    }
    if (data.notes !== undefined) {
        updates.push(`notes = $${paramIndex}`);
        values.push(data.notes);
        paramIndex++;
    }
    if (updates.length === 0) {
        throw new Error("No fields to update");
    }
    values.push(id);
    const query = `
    UPDATE visitors 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE visitor_id = $${paramIndex}
    RETURNING *
  `;
    const result = await pool.query(query, values);
    if (!result.rows[0])
        throw new Error("Visitor not found");
    return result.rows[0];
};
exports.updateVisitorService = updateVisitorService;
const deleteVisitorService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.visitors)
        .where((0, drizzle_orm_1.eq)(schema_1.visitors.visitorId, id))
        .returning({ id: schema_1.visitors.visitorId });
    if (!result)
        throw new Error("Visitor not found");
    return result;
};
exports.deleteVisitorService = deleteVisitorService;
const convertVisitorToMemberService = async (id, data) => {
    const pool = db_1.default.$client;
    const visitorResult = await pool.query('SELECT * FROM visitors WHERE visitor_id = $1', [id]);
    if (visitorResult.rows.length === 0) {
        throw new Error("Visitor not found");
    }
    const visitor = visitorResult.rows[0];
    if (visitor.is_member) {
        throw new Error("Visitor has already been converted to a member");
    }
    const existingMember = await pool.query('SELECT member_id FROM members WHERE email = $1 AND church_id = $2', [visitor.email, visitor.church_id]);
    if (existingMember.rows.length > 0) {
        throw new Error("A member with this email already exists in the church");
    }
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const membershipNumber = `CH${visitor.church_id}-${year}-${random}`;
    const memberQuery = `
    INSERT INTO members (
      church_id,
      email,
      full_name,
      role,
      membership_number,
      is_active,
      notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    )
    RETURNING *
  `;
    const memberValues = [
        visitor.church_id,
        visitor.email || null,
        visitor.full_name,
        data.role || 'church_member',
        membershipNumber,
        data.isActive !== undefined ? Boolean(data.isActive) : true,
        data.notes || null
    ];
    const memberResult = await pool.query(memberQuery, memberValues);
    const member = memberResult.rows[0];
    await pool.query('UPDATE visitors SET is_member = true, member_id = $1, updated_at = NOW() WHERE visitor_id = $2', [member.member_id, id]);
    return {
        member,
        visitor: { ...visitor, is_member: true, member_id: member.member_id }
    };
};
exports.convertVisitorToMemberService = convertVisitorToMemberService;
