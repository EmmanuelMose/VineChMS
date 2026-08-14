"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganizationService = exports.updateOrganizationService = exports.getOrganizationByIdService = exports.getOrganizationsByLargeOrganizationService = exports.getOrganizationsService = exports.createOrganizationService = exports.deleteLargeOrganizationService = exports.updateLargeOrganizationService = exports.getLargeOrganizationByIdService = exports.getLargeOrganizationsService = exports.createLargeOrganizationService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
// LARGE ORGANIZATIONS
const createLargeOrganizationService = async (userId, data) => {
    const [result] = await db_1.default
        .insert(schema_1.largeOrganizations)
        .values({ ...data, createdBy: userId })
        .returning();
    return result;
};
exports.createLargeOrganizationService = createLargeOrganizationService;
const getLargeOrganizationsService = async (userId) => {
    if (userId) {
        return await db_1.default
            .select()
            .from(schema_1.largeOrganizations)
            .where((0, drizzle_orm_1.eq)(schema_1.largeOrganizations.createdBy, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.largeOrganizations.createdAt));
    }
    return await db_1.default
        .select()
        .from(schema_1.largeOrganizations)
        .orderBy((0, drizzle_orm_1.desc)(schema_1.largeOrganizations.createdAt));
};
exports.getLargeOrganizationsService = getLargeOrganizationsService;
const getLargeOrganizationByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.largeOrganizations)
        .where((0, drizzle_orm_1.eq)(schema_1.largeOrganizations.largeOrganizationId, id));
    if (!result)
        throw new Error("Large organization not found");
    return result;
};
exports.getLargeOrganizationByIdService = getLargeOrganizationByIdService;
const updateLargeOrganizationService = async (id, data) => {
    const [result] = await db_1.default
        .update(schema_1.largeOrganizations)
        .set({ ...data, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.largeOrganizations.largeOrganizationId, id))
        .returning();
    if (!result)
        throw new Error("Large organization not found");
    return result;
};
exports.updateLargeOrganizationService = updateLargeOrganizationService;
const deleteLargeOrganizationService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.largeOrganizations)
        .where((0, drizzle_orm_1.eq)(schema_1.largeOrganizations.largeOrganizationId, id))
        .returning({ id: schema_1.largeOrganizations.largeOrganizationId });
    if (!result)
        throw new Error("Large organization not found");
    return result;
};
exports.deleteLargeOrganizationService = deleteLargeOrganizationService;
// SMALL ORGANIZATIONS
const createOrganizationService = async (userId, data) => {
    const [result] = await db_1.default
        .insert(schema_1.organizations)
        .values({ ...data, createdBy: userId })
        .returning();
    return result;
};
exports.createOrganizationService = createOrganizationService;
const getOrganizationsService = async (userId) => {
    return await db_1.default
        .select()
        .from(schema_1.organizations)
        .where((0, drizzle_orm_1.eq)(schema_1.organizations.createdBy, userId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.organizations.createdAt));
};
exports.getOrganizationsService = getOrganizationsService;
const getOrganizationsByLargeOrganizationService = async (largeOrganizationId) => {
    return await db_1.default
        .select()
        .from(schema_1.organizations)
        .where((0, drizzle_orm_1.eq)(schema_1.organizations.largeOrganizationId, largeOrganizationId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.organizations.createdAt));
};
exports.getOrganizationsByLargeOrganizationService = getOrganizationsByLargeOrganizationService;
const getOrganizationByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.organizations)
        .where((0, drizzle_orm_1.eq)(schema_1.organizations.organizationId, id));
    if (!result)
        throw new Error("Organization not found");
    return result;
};
exports.getOrganizationByIdService = getOrganizationByIdService;
const updateOrganizationService = async (id, data) => {
    const [result] = await db_1.default
        .update(schema_1.organizations)
        .set({ ...data, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.organizations.organizationId, id))
        .returning();
    if (!result)
        throw new Error("Organization not found");
    return result;
};
exports.updateOrganizationService = updateOrganizationService;
const deleteOrganizationService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.organizations)
        .where((0, drizzle_orm_1.eq)(schema_1.organizations.organizationId, id))
        .returning({ id: schema_1.organizations.organizationId });
    if (!result)
        throw new Error("Organization not found");
    return result;
};
exports.deleteOrganizationService = deleteOrganizationService;
