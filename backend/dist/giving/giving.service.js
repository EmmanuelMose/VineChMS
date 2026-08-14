"use strict";
// File: backend/src/giving/giving.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGivingStatusFromMpesa = exports.rejectGivingService = exports.approveGivingService = exports.getGivingByDateRangeService = exports.deleteGivingService = exports.updateGivingService = exports.getGivingTotalService = exports.getGivingSummaryService = exports.getGivingByTypeService = exports.getGivingByMemberService = exports.getGivingByChurchService = exports.getGivingByIdService = exports.createGivingService = exports.deleteGivingCategoryService = exports.updateGivingCategoryService = exports.getGivingCategoryByIdService = exports.getGivingCategoriesByChurchService = exports.createGivingCategoryService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const mpesa_service_1 = require("../mpesa/mpesa.service");
const createGivingCategoryService = async (data) => {
    const pool = db_1.default.$client;
    const query = `
    INSERT INTO giving_categories (
      church_id, name, description, type, is_active, image, image_public_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
    const values = [
        Number(data.churchId),
        data.name,
        data.description || null,
        data.type,
        data.isActive !== undefined ? Boolean(data.isActive) : true,
        data.image || null,
        data.imagePublicId || null,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};
exports.createGivingCategoryService = createGivingCategoryService;
const getGivingCategoriesByChurchService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.givingCategories)
        .where((0, drizzle_orm_1.eq)(schema_1.givingCategories.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.givingCategories.createdAt));
};
exports.getGivingCategoriesByChurchService = getGivingCategoriesByChurchService;
const getGivingCategoryByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.givingCategories)
        .where((0, drizzle_orm_1.eq)(schema_1.givingCategories.categoryId, id));
    if (!result)
        throw new Error("Category not found");
    return result;
};
exports.getGivingCategoryByIdService = getGivingCategoryByIdService;
const updateGivingCategoryService = async (id, data) => {
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
    if (data.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex}`);
        values.push(Boolean(data.isActive));
        paramIndex++;
    }
    if (data.image !== undefined) {
        updates.push(`image = $${paramIndex}`);
        values.push(data.image);
        paramIndex++;
    }
    if (data.imagePublicId !== undefined) {
        updates.push(`image_public_id = $${paramIndex}`);
        values.push(data.imagePublicId);
        paramIndex++;
    }
    if (updates.length === 0)
        throw new Error("No fields to update");
    values.push(id);
    const query = `
    UPDATE giving_categories
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE category_id = $${paramIndex}
    RETURNING *
  `;
    const result = await pool.query(query, values);
    if (!result.rows[0])
        throw new Error("Category not found");
    return result.rows[0];
};
exports.updateGivingCategoryService = updateGivingCategoryService;
const deleteGivingCategoryService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.givingCategories)
        .where((0, drizzle_orm_1.eq)(schema_1.givingCategories.categoryId, id))
        .returning({ id: schema_1.givingCategories.categoryId });
    if (!result)
        throw new Error("Category not found");
    return result;
};
exports.deleteGivingCategoryService = deleteGivingCategoryService;
const createGivingService = async (data) => {
    const pool = db_1.default.$client;
    let mpesaCheckoutRequestID = null;
    let mpesaMerchantRequestID = null;
    if (data.paymentMethod === "mpesa" && data.memberId) {
        let phoneNumber = data.phoneNumber;
        if (!phoneNumber) {
            const [member] = await db_1.default
                .select({ phone: schema_1.users.phone })
                .from(schema_1.members)
                .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
                .where((0, drizzle_orm_1.eq)(schema_1.members.memberId, data.memberId))
                .limit(1);
            if (!member || !member.phone) {
                throw new Error("Member phone number is required for M-Pesa. Please add a phone number.");
            }
            phoneNumber = member.phone;
        }
        try {
            const stkResult = await (0, mpesa_service_1.initiateStkPush)(phoneNumber, parseFloat(data.amount), `GIV-${Date.now()}`, "Church Giving");
            mpesaCheckoutRequestID = stkResult.CheckoutRequestID;
            mpesaMerchantRequestID = stkResult.MerchantRequestID;
            if (stkResult.ResponseCode !== "0") {
                throw new Error(stkResult.ResponseDescription || "STK push failed");
            }
        }
        catch (error) {
            console.error("STK push error:", error.message);
        }
    }
    const query = `
    INSERT INTO giving (
      member_id, church_id, category_id, amount, currency, type, status, date,
      payment_method, transaction_id, notes, is_anonymous, receipt_number,
      receipt_file, receipt_file_public_id,
      mpesa_checkout_request_id, mpesa_merchant_request_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    )
    RETURNING *
  `;
    const values = [
        Number(data.memberId),
        Number(data.churchId),
        data.categoryId ? Number(data.categoryId) : null,
        data.amount || "0.00",
        data.currency || "KES",
        data.type || "offering",
        data.status || "pending",
        data.date || new Date().toISOString(),
        data.paymentMethod || null,
        data.transactionId || null,
        data.notes || null,
        data.isAnonymous !== undefined ? Boolean(data.isAnonymous) : false,
        data.receiptNumber || null,
        data.receiptFile || null,
        data.receiptFilePublicId || null,
        mpesaCheckoutRequestID,
        mpesaMerchantRequestID,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};
exports.createGivingService = createGivingService;
const getGivingByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.giving)
        .where((0, drizzle_orm_1.eq)(schema_1.giving.givingId, id));
    if (!result)
        throw new Error("Giving record not found");
    return result;
};
exports.getGivingByIdService = getGivingByIdService;
const getGivingByChurchService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.giving)
        .where((0, drizzle_orm_1.eq)(schema_1.giving.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.giving.date));
};
exports.getGivingByChurchService = getGivingByChurchService;
const getGivingByMemberService = async (memberId) => {
    return await db_1.default
        .select()
        .from(schema_1.giving)
        .where((0, drizzle_orm_1.eq)(schema_1.giving.memberId, memberId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.giving.date));
};
exports.getGivingByMemberService = getGivingByMemberService;
const getGivingByTypeService = async (churchId, type) => {
    return await db_1.default
        .select()
        .from(schema_1.giving)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.giving.churchId, churchId), (0, drizzle_orm_1.eq)(schema_1.giving.type, type)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.giving.date));
};
exports.getGivingByTypeService = getGivingByTypeService;
const getGivingSummaryService = async (churchId) => {
    const pool = db_1.default.$client;
    const query = `
    SELECT COALESCE(SUM(amount::numeric), 0) as total_amount, type, COUNT(*) as count
    FROM giving WHERE church_id = $1 GROUP BY type
  `;
    const result = await pool.query(query, [churchId]);
    return result.rows;
};
exports.getGivingSummaryService = getGivingSummaryService;
const getGivingTotalService = async (churchId) => {
    const pool = db_1.default.$client;
    const query = `SELECT COALESCE(SUM(amount::numeric), 0) as total FROM giving WHERE church_id = $1`;
    const result = await pool.query(query, [churchId]);
    return result.rows[0];
};
exports.getGivingTotalService = getGivingTotalService;
const updateGivingService = async (id, data) => {
    const pool = db_1.default.$client;
    const updates = [];
    const values = [];
    let paramIndex = 1;
    if (data.memberId !== undefined) {
        updates.push(`member_id = $${paramIndex}`);
        values.push(Number(data.memberId));
        paramIndex++;
    }
    if (data.categoryId !== undefined) {
        updates.push(`category_id = $${paramIndex}`);
        values.push(data.categoryId ? Number(data.categoryId) : null);
        paramIndex++;
    }
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
    if (data.type !== undefined) {
        updates.push(`type = $${paramIndex}`);
        values.push(data.type);
        paramIndex++;
    }
    if (data.status !== undefined) {
        updates.push(`status = $${paramIndex}`);
        values.push(data.status);
        paramIndex++;
    }
    if (data.date !== undefined) {
        updates.push(`date = $${paramIndex}`);
        values.push(data.date);
        paramIndex++;
    }
    if (data.paymentMethod !== undefined) {
        updates.push(`payment_method = $${paramIndex}`);
        values.push(data.paymentMethod);
        paramIndex++;
    }
    if (data.transactionId !== undefined) {
        updates.push(`transaction_id = $${paramIndex}`);
        values.push(data.transactionId);
        paramIndex++;
    }
    if (data.notes !== undefined) {
        updates.push(`notes = $${paramIndex}`);
        values.push(data.notes);
        paramIndex++;
    }
    if (data.isAnonymous !== undefined) {
        updates.push(`is_anonymous = $${paramIndex}`);
        values.push(Boolean(data.isAnonymous));
        paramIndex++;
    }
    if (data.receiptNumber !== undefined) {
        updates.push(`receipt_number = $${paramIndex}`);
        values.push(data.receiptNumber);
        paramIndex++;
    }
    if (data.receiptFile !== undefined) {
        updates.push(`receipt_file = $${paramIndex}`);
        values.push(data.receiptFile);
        paramIndex++;
    }
    if (data.receiptFilePublicId !== undefined) {
        updates.push(`receipt_file_public_id = $${paramIndex}`);
        values.push(data.receiptFilePublicId);
        paramIndex++;
    }
    if (data.approvedBy !== undefined) {
        updates.push(`approved_by = $${paramIndex}`);
        values.push(data.approvedBy);
        paramIndex++;
    }
    if (data.approvedAt !== undefined) {
        updates.push(`approved_at = $${paramIndex}`);
        values.push(data.approvedAt);
        paramIndex++;
    }
    if (updates.length === 0)
        throw new Error("No fields to update");
    values.push(id);
    const query = `
    UPDATE giving SET ${updates.join(', ')}, updated_at = NOW()
    WHERE giving_id = $${paramIndex} RETURNING *
  `;
    const result = await pool.query(query, values);
    if (!result.rows[0])
        throw new Error("Giving record not found");
    return result.rows[0];
};
exports.updateGivingService = updateGivingService;
const deleteGivingService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.giving)
        .where((0, drizzle_orm_1.eq)(schema_1.giving.givingId, id))
        .returning({ id: schema_1.giving.givingId });
    if (!result)
        throw new Error("Giving record not found");
    return result;
};
exports.deleteGivingService = deleteGivingService;
const getGivingByDateRangeService = async (churchId, startDate, endDate) => {
    const pool = db_1.default.$client;
    const query = `
    SELECT * FROM giving
    WHERE church_id = $1 AND date::date >= $2::date AND date::date <= $3::date
    ORDER BY date DESC
  `;
    const result = await pool.query(query, [churchId, startDate, endDate]);
    return result.rows;
};
exports.getGivingByDateRangeService = getGivingByDateRangeService;
const approveGivingService = async (id, approvedBy, amount) => {
    const pool = db_1.default.$client;
    let query = `
    UPDATE giving
    SET status = 'completed', approved_by = $1, approved_at = NOW(), updated_at = NOW()
  `;
    const params = [approvedBy];
    if (amount !== undefined && amount !== null && amount !== "") {
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount > 0) {
            query += `, amount = $2`;
            params.push(numAmount.toString());
        }
    }
    query += ` WHERE giving_id = $${params.length + 1} RETURNING *`;
    params.push(id);
    const result = await pool.query(query, params);
    if (!result.rows[0])
        throw new Error("Giving record not found");
    return result.rows[0];
};
exports.approveGivingService = approveGivingService;
const rejectGivingService = async (id, approvedBy) => {
    const pool = db_1.default.$client;
    const query = `
    UPDATE giving SET status = 'failed', approved_by = $1, approved_at = NOW(), updated_at = NOW()
    WHERE giving_id = $2 RETURNING *
  `;
    const result = await pool.query(query, [approvedBy, id]);
    if (!result.rows[0])
        throw new Error("Giving record not found");
    return result.rows[0];
};
exports.rejectGivingService = rejectGivingService;
const updateGivingStatusFromMpesa = async (checkoutRequestID, status, resultDesc) => {
    const pool = db_1.default.$client;
    const query = `
    UPDATE giving SET status = $1, notes = COALESCE(notes, '') || ' | M-Pesa: ' || COALESCE($2, ''),
    updated_at = NOW() WHERE mpesa_checkout_request_id = $3 RETURNING *
  `;
    const result = await pool.query(query, [status, resultDesc, checkoutRequestID]);
    return result.rows[0];
};
exports.updateGivingStatusFromMpesa = updateGivingStatusFromMpesa;
