"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrayerInteractionsService = exports.prayForRequestService = exports.deletePrayerRequestService = exports.updatePrayerRequestService = exports.getPrayerRequestsByChurchService = exports.getPrayerRequestByIdService = exports.createPrayerRequestService = exports.getOrCreateMember = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getOrCreateMember = async (userId, churchId) => {
    const [existing] = await db_1.default
        .select({ memberId: schema_1.members.memberId })
        .from(schema_1.members)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.members.userId, userId), (0, drizzle_orm_1.eq)(schema_1.members.churchId, churchId)));
    if (existing)
        return existing.memberId;
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.userId, userId),
    });
    if (!user)
        throw new Error("User not found");
    const [newMember] = await db_1.default
        .insert(schema_1.members)
        .values({
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        churchId: churchId,
        role: user.role,
        isActive: true,
    })
        .returning({ memberId: schema_1.members.memberId });
    return newMember.memberId;
};
exports.getOrCreateMember = getOrCreateMember;
const createPrayerRequestService = async (data) => {
    const [result] = await db_1.default
        .insert(schema_1.prayerRequests)
        .values(data)
        .returning();
    return result;
};
exports.createPrayerRequestService = createPrayerRequestService;
const getPrayerRequestByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.prayerRequests)
        .where((0, drizzle_orm_1.eq)(schema_1.prayerRequests.prayerRequestId, id));
    if (!result)
        throw new Error("Prayer request not found");
    return result;
};
exports.getPrayerRequestByIdService = getPrayerRequestByIdService;
const getPrayerRequestsByChurchService = async (churchId) => {
    return await db_1.default
        .select({
        prayerRequestId: schema_1.prayerRequests.prayerRequestId,
        churchId: schema_1.prayerRequests.churchId,
        memberId: schema_1.prayerRequests.memberId,
        title: schema_1.prayerRequests.title,
        description: schema_1.prayerRequests.description,
        fullName: schema_1.users.fullName,
        status: schema_1.prayerRequests.status,
        visibility: schema_1.prayerRequests.visibility,
        prayerCount: schema_1.prayerRequests.prayerCount,
        createdAt: schema_1.prayerRequests.createdAt,
    })
        .from(schema_1.prayerRequests)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.prayerRequests.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .where((0, drizzle_orm_1.eq)(schema_1.prayerRequests.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.prayerRequests.createdAt));
};
exports.getPrayerRequestsByChurchService = getPrayerRequestsByChurchService;
const updatePrayerRequestService = async (id, data) => {
    const [result] = await db_1.default
        .update(schema_1.prayerRequests)
        .set({ ...data, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.prayerRequests.prayerRequestId, id))
        .returning();
    if (!result)
        throw new Error("Prayer request not found");
    return result;
};
exports.updatePrayerRequestService = updatePrayerRequestService;
const deletePrayerRequestService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.prayerRequests)
        .where((0, drizzle_orm_1.eq)(schema_1.prayerRequests.prayerRequestId, id))
        .returning({ id: schema_1.prayerRequests.prayerRequestId });
    if (!result)
        throw new Error("Prayer request not found");
    return result;
};
exports.deletePrayerRequestService = deletePrayerRequestService;
const prayForRequestService = async (prayerRequestId, memberId) => {
    const [result] = await db_1.default
        .insert(schema_1.prayerInteractions)
        .values({
        prayerRequestId,
        memberId,
        type: "prayed",
    })
        .returning();
    await db_1.default
        .update(schema_1.prayerRequests)
        .set({
        prayerCount: (0, drizzle_orm_1.sql) `${schema_1.prayerRequests.prayerCount} + 1`,
    })
        .where((0, drizzle_orm_1.eq)(schema_1.prayerRequests.prayerRequestId, prayerRequestId));
    return result;
};
exports.prayForRequestService = prayForRequestService;
const getPrayerInteractionsService = async (prayerRequestId) => {
    return await db_1.default
        .select({
        interactionId: schema_1.prayerInteractions.interactionId,
        fullName: schema_1.users.fullName,
        type: schema_1.prayerInteractions.type,
        notes: schema_1.prayerInteractions.notes,
        createdAt: schema_1.prayerInteractions.createdAt,
    })
        .from(schema_1.prayerInteractions)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.prayerInteractions.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .where((0, drizzle_orm_1.eq)(schema_1.prayerInteractions.prayerRequestId, prayerRequestId));
};
exports.getPrayerInteractionsService = getPrayerInteractionsService;
