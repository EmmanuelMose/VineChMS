"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePositionService = exports.updatePositionService = exports.getPositionsByLargeOrganizationService = exports.getPositionsByOrganizationService = exports.getPositionsByChurchService = exports.getPositionByIdService = exports.createPositionService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createPositionService = async (data) => {
    const [result] = await db_1.default
        .insert(schema_1.positions)
        .values({
        name: data.name,
        description: data.description || null,
        churchId: data.churchId || null,
        organizationId: data.organizationId || null,
        largeOrganizationId: data.largeOrganizationId || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
    })
        .returning();
    return result;
};
exports.createPositionService = createPositionService;
const getPositionByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.positions)
        .where((0, drizzle_orm_1.eq)(schema_1.positions.positionId, id));
    if (!result)
        throw new Error("Position not found");
    return result;
};
exports.getPositionByIdService = getPositionByIdService;
const getPositionsByChurchService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.positions)
        .where((0, drizzle_orm_1.eq)(schema_1.positions.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.positions.createdAt));
};
exports.getPositionsByChurchService = getPositionsByChurchService;
const getPositionsByOrganizationService = async (organizationId) => {
    return await db_1.default
        .select()
        .from(schema_1.positions)
        .where((0, drizzle_orm_1.eq)(schema_1.positions.organizationId, organizationId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.positions.createdAt));
};
exports.getPositionsByOrganizationService = getPositionsByOrganizationService;
const getPositionsByLargeOrganizationService = async (largeOrganizationId) => {
    return await db_1.default
        .select()
        .from(schema_1.positions)
        .where((0, drizzle_orm_1.eq)(schema_1.positions.largeOrganizationId, largeOrganizationId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.positions.createdAt));
};
exports.getPositionsByLargeOrganizationService = getPositionsByLargeOrganizationService;
const updatePositionService = async (id, data) => {
    const [result] = await db_1.default
        .update(schema_1.positions)
        .set({ ...data, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.positions.positionId, id))
        .returning();
    if (!result)
        throw new Error("Position not found");
    return result;
};
exports.updatePositionService = updatePositionService;
const deletePositionService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.positions)
        .where((0, drizzle_orm_1.eq)(schema_1.positions.positionId, id))
        .returning({ id: schema_1.positions.positionId });
    if (!result)
        throw new Error("Position not found");
    return result;
};
exports.deletePositionService = deletePositionService;
