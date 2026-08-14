"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMemberFromDepartmentService = exports.updateDepartmentMemberService = exports.getDepartmentMembersService = exports.addMemberToDepartmentService = exports.deleteDepartmentService = exports.updateDepartmentService = exports.getSubDepartmentsService = exports.getDepartmentsByLargeOrganizationService = exports.getDepartmentsByOrganizationService = exports.getDepartmentsByChurchService = exports.getDepartmentByIdService = exports.createDepartmentService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createDepartmentService = async (data) => {
    const [result] = await db_1.default
        .insert(schema_1.departments)
        .values({
        name: data.name,
        description: data.description || null,
        type: data.type,
        largeOrganizationId: data.largeOrganizationId || null,
        organizationId: data.organizationId || null,
        churchId: data.churchId || null,
        parentDepartmentId: data.parentDepartmentId || null,
        leaderId: data.leaderId || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
    })
        .returning();
    return result;
};
exports.createDepartmentService = createDepartmentService;
const getDepartmentByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.departments)
        .where((0, drizzle_orm_1.eq)(schema_1.departments.departmentId, id));
    if (!result)
        throw new Error("Department not found");
    return result;
};
exports.getDepartmentByIdService = getDepartmentByIdService;
const getDepartmentsByChurchService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.departments)
        .where((0, drizzle_orm_1.eq)(schema_1.departments.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.departments.createdAt));
};
exports.getDepartmentsByChurchService = getDepartmentsByChurchService;
const getDepartmentsByOrganizationService = async (organizationId) => {
    return await db_1.default
        .select()
        .from(schema_1.departments)
        .where((0, drizzle_orm_1.eq)(schema_1.departments.organizationId, organizationId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.departments.createdAt));
};
exports.getDepartmentsByOrganizationService = getDepartmentsByOrganizationService;
const getDepartmentsByLargeOrganizationService = async (largeOrganizationId) => {
    return await db_1.default
        .select()
        .from(schema_1.departments)
        .where((0, drizzle_orm_1.eq)(schema_1.departments.largeOrganizationId, largeOrganizationId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.departments.createdAt));
};
exports.getDepartmentsByLargeOrganizationService = getDepartmentsByLargeOrganizationService;
const getSubDepartmentsService = async (parentDepartmentId) => {
    return await db_1.default
        .select()
        .from(schema_1.departments)
        .where((0, drizzle_orm_1.eq)(schema_1.departments.parentDepartmentId, parentDepartmentId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.departments.createdAt));
};
exports.getSubDepartmentsService = getSubDepartmentsService;
const updateDepartmentService = async (id, data) => {
    const [result] = await db_1.default
        .update(schema_1.departments)
        .set({ ...data, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.departments.departmentId, id))
        .returning();
    if (!result)
        throw new Error("Department not found");
    return result;
};
exports.updateDepartmentService = updateDepartmentService;
const deleteDepartmentService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.departments)
        .where((0, drizzle_orm_1.eq)(schema_1.departments.departmentId, id))
        .returning({ id: schema_1.departments.departmentId });
    if (!result)
        throw new Error("Department not found");
    return result;
};
exports.deleteDepartmentService = deleteDepartmentService;
const addMemberToDepartmentService = async (data) => {
    const existing = await db_1.default
        .select()
        .from(schema_1.departmentMembers)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.departmentMembers.departmentId, data.departmentId), (0, drizzle_orm_1.eq)(schema_1.departmentMembers.memberId, data.memberId)))
        .limit(1);
    if (existing.length > 0) {
        throw new Error("Member already in this department");
    }
    const [result] = await db_1.default
        .insert(schema_1.departmentMembers)
        .values({
        departmentId: data.departmentId,
        memberId: data.memberId,
        positionId: data.positionId || null,
        role: data.role || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        joinedAt: new Date(),
    })
        .returning();
    return result;
};
exports.addMemberToDepartmentService = addMemberToDepartmentService;
const getDepartmentMembersService = async (departmentId) => {
    return await db_1.default
        .select({
        departmentMemberId: schema_1.departmentMembers.departmentMemberId,
        departmentId: schema_1.departmentMembers.departmentId,
        memberId: schema_1.departmentMembers.memberId,
        fullName: schema_1.members.fullName,
        email: schema_1.members.email,
        positionId: schema_1.departmentMembers.positionId,
        positionName: schema_1.positions.name,
        role: schema_1.departmentMembers.role,
        isActive: schema_1.departmentMembers.isActive,
        joinedAt: schema_1.departmentMembers.joinedAt,
    })
        .from(schema_1.departmentMembers)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.departmentMembers.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.positions, (0, drizzle_orm_1.eq)(schema_1.departmentMembers.positionId, schema_1.positions.positionId))
        .where((0, drizzle_orm_1.eq)(schema_1.departmentMembers.departmentId, departmentId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.departmentMembers.joinedAt));
};
exports.getDepartmentMembersService = getDepartmentMembersService;
const updateDepartmentMemberService = async (id, data) => {
    const [result] = await db_1.default
        .update(schema_1.departmentMembers)
        .set({ ...data, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.departmentMembers.departmentMemberId, id))
        .returning();
    if (!result)
        throw new Error("Department member not found");
    return result;
};
exports.updateDepartmentMemberService = updateDepartmentMemberService;
const removeMemberFromDepartmentService = async (departmentMemberId) => {
    const [result] = await db_1.default
        .delete(schema_1.departmentMembers)
        .where((0, drizzle_orm_1.eq)(schema_1.departmentMembers.departmentMemberId, departmentMemberId))
        .returning({ id: schema_1.departmentMembers.departmentMemberId });
    if (!result)
        throw new Error("Department member not found");
    return result;
};
exports.removeMemberFromDepartmentService = removeMemberFromDepartmentService;
