"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPledgesSummaryService = exports.fulfillPledgeService = exports.deletePledgeService = exports.updatePledgeService = exports.getUnfulfilledPledgesService = exports.getFulfilledPledgesService = exports.getPledgesByCategoryService = exports.getPledgesByMemberService = exports.getPledgesByChurchService = exports.getPledgeByIdService = exports.createPledgeService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createPledgeService = async (data) => {
    const pool = db_1.default.$client;
    const query = `
    INSERT INTO pledges (
      member_id,
      church_id,
      category_id,
      amount,
      currency,
      start_date,
      end_date,
      frequency,
      is_fulfilled,
      notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    )
    RETURNING *
  `;
    const values = [
        Number(data.memberId),
        Number(data.churchId),
        data.categoryId ? Number(data.categoryId) : null,
        data.amount || "0.00",
        data.currency || "USD",
        data.startDate || new Date().toISOString(),
        data.endDate || new Date().toISOString(),
        data.frequency || "monthly",
        data.isFulfilled !== undefined ? Boolean(data.isFulfilled) : false,
        data.notes || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};
exports.createPledgeService = createPledgeService;
const getPledgeByIdService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid pledge ID");
    }
    const [result] = await db_1.default
        .select()
        .from(schema_1.pledges)
        .where((0, drizzle_orm_1.eq)(schema_1.pledges.pledgeId, id));
    if (!result)
        throw new Error("Pledge not found");
    return result;
};
exports.getPledgeByIdService = getPledgeByIdService;
const getPledgesByChurchService = async (churchId) => {
    if (!churchId || isNaN(churchId)) {
        throw new Error("Invalid church ID");
    }
    return await db_1.default
        .select({
        pledgeId: schema_1.pledges.pledgeId,
        memberId: schema_1.pledges.memberId,
        fullName: schema_1.users.fullName,
        categoryName: schema_1.givingCategories.name,
        amount: schema_1.pledges.amount,
        currency: schema_1.pledges.currency,
        startDate: schema_1.pledges.startDate,
        endDate: schema_1.pledges.endDate,
        frequency: schema_1.pledges.frequency,
        isFulfilled: schema_1.pledges.isFulfilled,
        notes: schema_1.pledges.notes,
        createdAt: schema_1.pledges.createdAt,
        churchId: schema_1.pledges.churchId,
    })
        .from(schema_1.pledges)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.pledges.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .leftJoin(schema_1.givingCategories, (0, drizzle_orm_1.eq)(schema_1.pledges.categoryId, schema_1.givingCategories.categoryId))
        .where((0, drizzle_orm_1.eq)(schema_1.pledges.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.pledges.createdAt));
};
exports.getPledgesByChurchService = getPledgesByChurchService;
const getPledgesByMemberService = async (memberId) => {
    if (!memberId || isNaN(memberId)) {
        throw new Error("Invalid member ID");
    }
    return await db_1.default
        .select({
        pledgeId: schema_1.pledges.pledgeId,
        memberId: schema_1.pledges.memberId,
        churchId: schema_1.pledges.churchId,
        fullName: schema_1.users.fullName,
        categoryName: schema_1.givingCategories.name,
        amount: schema_1.pledges.amount,
        currency: schema_1.pledges.currency,
        startDate: schema_1.pledges.startDate,
        endDate: schema_1.pledges.endDate,
        frequency: schema_1.pledges.frequency,
        isFulfilled: schema_1.pledges.isFulfilled,
        notes: schema_1.pledges.notes,
        createdAt: schema_1.pledges.createdAt,
    })
        .from(schema_1.pledges)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.pledges.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .leftJoin(schema_1.givingCategories, (0, drizzle_orm_1.eq)(schema_1.pledges.categoryId, schema_1.givingCategories.categoryId))
        .where((0, drizzle_orm_1.eq)(schema_1.pledges.memberId, memberId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.pledges.createdAt));
};
exports.getPledgesByMemberService = getPledgesByMemberService;
const getPledgesByCategoryService = async (categoryId) => {
    if (!categoryId || isNaN(categoryId)) {
        throw new Error("Invalid category ID");
    }
    return await db_1.default
        .select({
        pledgeId: schema_1.pledges.pledgeId,
        memberId: schema_1.pledges.memberId,
        churchId: schema_1.pledges.churchId,
        fullName: schema_1.users.fullName,
        categoryName: schema_1.givingCategories.name,
        amount: schema_1.pledges.amount,
        currency: schema_1.pledges.currency,
        startDate: schema_1.pledges.startDate,
        endDate: schema_1.pledges.endDate,
        frequency: schema_1.pledges.frequency,
        isFulfilled: schema_1.pledges.isFulfilled,
        notes: schema_1.pledges.notes,
        createdAt: schema_1.pledges.createdAt,
    })
        .from(schema_1.pledges)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.pledges.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .leftJoin(schema_1.givingCategories, (0, drizzle_orm_1.eq)(schema_1.pledges.categoryId, schema_1.givingCategories.categoryId))
        .where((0, drizzle_orm_1.eq)(schema_1.pledges.categoryId, categoryId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.pledges.createdAt));
};
exports.getPledgesByCategoryService = getPledgesByCategoryService;
const getFulfilledPledgesService = async (churchId) => {
    if (!churchId || isNaN(churchId)) {
        throw new Error("Invalid church ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.pledges)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.pledges.isFulfilled, true), (0, drizzle_orm_1.eq)(schema_1.pledges.churchId, churchId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.pledges.createdAt));
};
exports.getFulfilledPledgesService = getFulfilledPledgesService;
const getUnfulfilledPledgesService = async (churchId) => {
    if (!churchId || isNaN(churchId)) {
        throw new Error("Invalid church ID");
    }
    return await db_1.default
        .select()
        .from(schema_1.pledges)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.pledges.isFulfilled, false), (0, drizzle_orm_1.eq)(schema_1.pledges.churchId, churchId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.pledges.createdAt));
};
exports.getUnfulfilledPledgesService = getUnfulfilledPledgesService;
const updatePledgeService = async (id, data) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid pledge ID");
    }
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.amount !== undefined) {
        updates.push(`amount = $${paramIndex}`);
        values.push(data.amount);
        paramIndex++;
    }
    if (data.currency !== undefined) {
        updates.push(`currency = $${paramIndex}`);
        values.push(data.currency);
        paramIndex++;
    }
    if (data.startDate !== undefined) {
        updates.push(`start_date = $${paramIndex}`);
        values.push(data.startDate);
        paramIndex++;
    }
    if (data.endDate !== undefined) {
        updates.push(`end_date = $${paramIndex}`);
        values.push(data.endDate);
        paramIndex++;
    }
    if (data.frequency !== undefined) {
        updates.push(`frequency = $${paramIndex}`);
        values.push(data.frequency);
        paramIndex++;
    }
    if (data.isFulfilled !== undefined) {
        updates.push(`is_fulfilled = $${paramIndex}`);
        values.push(Boolean(data.isFulfilled));
        paramIndex++;
    }
    if (data.fulfilledAt !== undefined) {
        updates.push(`fulfilled_at = $${paramIndex}`);
        values.push(data.fulfilledAt);
        paramIndex++;
    }
    if (data.notes !== undefined) {
        updates.push(`notes = $${paramIndex}`);
        values.push(data.notes);
        paramIndex++;
    }
    if (data.categoryId !== undefined) {
        updates.push(`category_id = $${paramIndex}`);
        values.push(data.categoryId ? Number(data.categoryId) : null);
        paramIndex++;
    }
    if (updates.length === 0) {
        throw new Error("No fields to update");
    }
    values.push(id);
    const query = `
    UPDATE pledges 
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE pledge_id = $${paramIndex}
    RETURNING *
  `;
    const result = await pool.query(query, values);
    if (!result.rows[0])
        throw new Error("Pledge not found");
    return result.rows[0];
};
exports.updatePledgeService = updatePledgeService;
const deletePledgeService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid pledge ID");
    }
    const [result] = await db_1.default
        .delete(schema_1.pledges)
        .where((0, drizzle_orm_1.eq)(schema_1.pledges.pledgeId, id))
        .returning({ id: schema_1.pledges.pledgeId });
    if (!result)
        throw new Error("Pledge not found");
    return result;
};
exports.deletePledgeService = deletePledgeService;
const fulfillPledgeService = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("Invalid pledge ID");
    }
    const pool = db_1.default.$client;
    const query = `
    UPDATE pledges 
    SET 
      is_fulfilled = true,
      fulfilled_at = NOW(),
      updated_at = NOW()
    WHERE pledge_id = $1
    RETURNING *
  `;
    const result = await pool.query(query, [id]);
    if (!result.rows[0])
        throw new Error("Pledge not found");
    return result.rows[0];
};
exports.fulfillPledgeService = fulfillPledgeService;
const getPledgesSummaryService = async (churchId) => {
    if (!churchId || isNaN(churchId)) {
        throw new Error("Invalid church ID");
    }
    const pool = db_1.default.$client;
    const query = `
    SELECT 
      COUNT(*) as total_pledges,
      COALESCE(SUM(amount::numeric), 0) as total_amount,
      COUNT(CASE WHEN is_fulfilled THEN 1 END) as fulfilled_count,
      COUNT(CASE WHEN NOT is_fulfilled THEN 1 END) as unfulfilled_count,
      COALESCE(SUM(CASE WHEN is_fulfilled THEN amount::numeric ELSE 0 END), 0) as fulfilled_amount,
      COALESCE(SUM(CASE WHEN NOT is_fulfilled THEN amount::numeric ELSE 0 END), 0) as unfulfilled_amount
    FROM pledges
    WHERE church_id = $1
  `;
    const result = await pool.query(query, [churchId]);
    return result.rows[0];
};
exports.getPledgesSummaryService = getPledgesSummaryService;
