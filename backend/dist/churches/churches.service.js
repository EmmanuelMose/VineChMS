"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChurchMembersService = exports.deleteChurchService = exports.updateChurchService = exports.getChurchByIdService = exports.getChurchesByOrganizationIdsService = exports.getChurchesByOrganizationService = exports.getChurchesService = exports.createChurchService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createChurchService = async (userId, data) => {
    const [result] = await db_1.default
        .insert(schema_1.churches)
        .values({ ...data, createdBy: userId })
        .returning();
    return result;
};
exports.createChurchService = createChurchService;
const getChurchesService = async (userId) => {
    if (userId) {
        return await db_1.default
            .select()
            .from(schema_1.churches)
            .where((0, drizzle_orm_1.eq)(schema_1.churches.createdBy, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.churches.createdAt));
    }
    return await db_1.default
        .select()
        .from(schema_1.churches)
        .orderBy((0, drizzle_orm_1.desc)(schema_1.churches.createdAt));
};
exports.getChurchesService = getChurchesService;
const getChurchesByOrganizationService = async (organizationId) => {
    return await db_1.default
        .select()
        .from(schema_1.churches)
        .where((0, drizzle_orm_1.eq)(schema_1.churches.organizationId, organizationId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.churches.createdAt));
};
exports.getChurchesByOrganizationService = getChurchesByOrganizationService;
const getChurchesByOrganizationIdsService = async (organizationIds) => {
    if (organizationIds.length === 0) {
        return [];
    }
    return await db_1.default
        .select()
        .from(schema_1.churches)
        .where((0, drizzle_orm_1.inArray)(schema_1.churches.organizationId, organizationIds))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.churches.createdAt));
};
exports.getChurchesByOrganizationIdsService = getChurchesByOrganizationIdsService;
const getChurchByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.churches)
        .where((0, drizzle_orm_1.eq)(schema_1.churches.churchId, id));
    if (!result)
        throw new Error("Church not found");
    return result;
};
exports.getChurchByIdService = getChurchByIdService;
const updateChurchService = async (id, data) => {
    const [result] = await db_1.default
        .update(schema_1.churches)
        .set({ ...data, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.churches.churchId, id))
        .returning();
    if (!result)
        throw new Error("Church not found");
    return result;
};
exports.updateChurchService = updateChurchService;
const deleteChurchService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.churches)
        .where((0, drizzle_orm_1.eq)(schema_1.churches.churchId, id))
        .returning({ id: schema_1.churches.churchId });
    if (!result)
        throw new Error("Church not found");
    return result;
};
exports.deleteChurchService = deleteChurchService;
const getChurchMembersService = async (churchId) => {
    return await db_1.default
        .select({
        memberId: schema_1.members.memberId,
        userId: schema_1.members.userId,
        email: schema_1.users.email,
        fullName: schema_1.users.fullName,
        membershipNumber: schema_1.members.membershipNumber,
        isActive: schema_1.members.isActive,
        isBaptized: schema_1.members.isBaptized,
        isLeader: schema_1.members.isLeader,
        role: schema_1.members.role,
        createdAt: schema_1.members.createdAt,
    })
        .from(schema_1.members)
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .where((0, drizzle_orm_1.eq)(schema_1.members.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.members.createdAt));
};
exports.getChurchMembersService = getChurchMembersService;
