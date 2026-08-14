"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMemberService = exports.upgradeMemberRoleService = exports.updateMemberService = exports.getMemberByUserIdService = exports.getMemberByIdService = exports.getMembersByLargeOrganizationService = exports.getMembersByOrganizationService = exports.getMembersByChurchService = exports.getMembersService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const getMembersService = async () => {
    return await db_1.default
        .select()
        .from(schema_1.members)
        .orderBy((0, drizzle_orm_1.desc)(schema_1.members.createdAt));
};
exports.getMembersService = getMembersService;
const getMembersByChurchService = async (churchId) => {
    return await db_1.default
        .select()
        .from(schema_1.members)
        .where((0, drizzle_orm_1.eq)(schema_1.members.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.members.createdAt));
};
exports.getMembersByChurchService = getMembersByChurchService;
const getMembersByOrganizationService = async (organizationId) => {
    return await db_1.default
        .select()
        .from(schema_1.members)
        .where((0, drizzle_orm_1.eq)(schema_1.members.organizationId, organizationId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.members.createdAt));
};
exports.getMembersByOrganizationService = getMembersByOrganizationService;
const getMembersByLargeOrganizationService = async (largeOrganizationId) => {
    return await db_1.default
        .select()
        .from(schema_1.members)
        .where((0, drizzle_orm_1.eq)(schema_1.members.largeOrganizationId, largeOrganizationId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.members.createdAt));
};
exports.getMembersByLargeOrganizationService = getMembersByLargeOrganizationService;
const getMemberByIdService = async (id) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.members)
        .where((0, drizzle_orm_1.eq)(schema_1.members.memberId, id));
    if (!result)
        throw new Error("Member not found");
    return result;
};
exports.getMemberByIdService = getMemberByIdService;
const getMemberByUserIdService = async (userId) => {
    const [result] = await db_1.default
        .select()
        .from(schema_1.members)
        .where((0, drizzle_orm_1.eq)(schema_1.members.userId, userId));
    if (!result)
        throw new Error("Member not found");
    return result;
};
exports.getMemberByUserIdService = getMemberByUserIdService;
const updateMemberService = async (id, data) => {
    const [existingMember] = await db_1.default
        .select()
        .from(schema_1.members)
        .where((0, drizzle_orm_1.eq)(schema_1.members.memberId, id));
    if (!existingMember) {
        throw new Error("Member not found");
    }
    const memberFields = {};
    if (data.fullName !== undefined)
        memberFields.fullName = data.fullName;
    if (data.email !== undefined)
        memberFields.email = data.email;
    if (data.membershipNumber !== undefined)
        memberFields.membershipNumber = data.membershipNumber;
    if (data.isActive !== undefined)
        memberFields.isActive = data.isActive;
    if (data.isBaptized !== undefined)
        memberFields.isBaptized = data.isBaptized;
    if (data.isConfirmed !== undefined)
        memberFields.isConfirmed = data.isConfirmed;
    if (data.isLeader !== undefined)
        memberFields.isLeader = data.isLeader;
    if (data.notes !== undefined)
        memberFields.notes = data.notes;
    if (data.role !== undefined)
        memberFields.role = data.role;
    const userFields = {};
    if (data.fullName !== undefined)
        userFields.fullName = data.fullName;
    if (data.email !== undefined)
        userFields.email = data.email;
    if (data.phone !== undefined)
        userFields.phone = data.phone;
    if (data.gender !== undefined)
        userFields.gender = data.gender;
    // 🔥 FIX: Safe date conversion – avoid "toISOString is not a function"
    if (data.dateOfBirth !== undefined) {
        if (data.dateOfBirth === "" || data.dateOfBirth === null) {
            userFields.dateOfBirth = null;
        }
        else {
            const date = new Date(data.dateOfBirth);
            if (!isNaN(date.getTime())) {
                userFields.dateOfBirth = date;
            }
            else {
                userFields.dateOfBirth = null; // fallback to null if invalid
            }
        }
    }
    if (data.maritalStatus !== undefined)
        userFields.maritalStatus = data.maritalStatus;
    if (data.occupation !== undefined)
        userFields.occupation = data.occupation;
    if (data.address !== undefined)
        userFields.address = data.address;
    if (data.profilePicture !== undefined)
        userFields.profilePicture = data.profilePicture;
    if (data.profilePicturePublicId !== undefined)
        userFields.profilePicturePublicId = data.profilePicturePublicId;
    if (data.role !== undefined)
        userFields.role = data.role;
    if (Object.keys(memberFields).length > 0) {
        await db_1.default
            .update(schema_1.members)
            .set({ ...memberFields, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.members.memberId, id));
    }
    if (Object.keys(userFields).length > 0) {
        if (existingMember.userId == null) {
            throw new Error("Member has no associated user");
        }
        await db_1.default
            .update(schema_1.users)
            .set({ ...userFields, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.users.userId, existingMember.userId));
    }
    const [updatedMember] = await db_1.default
        .select()
        .from(schema_1.members)
        .where((0, drizzle_orm_1.eq)(schema_1.members.memberId, id));
    return updatedMember;
};
exports.updateMemberService = updateMemberService;
const upgradeMemberRoleService = async (memberId, newRole, updatedBy) => {
    const [member] = await db_1.default
        .select()
        .from(schema_1.members)
        .where((0, drizzle_orm_1.eq)(schema_1.members.memberId, memberId));
    if (!member)
        throw new Error("Member not found");
    const validRoles = ["pastor", "elder", "treasurer", "secretary", "church_member"];
    if (!validRoles.includes(newRole)) {
        throw new Error("Invalid role. Valid roles: pastor, elder, treasurer, secretary, church_member");
    }
    const [updatedMember] = await db_1.default
        .update(schema_1.members)
        .set({
        role: newRole,
        updatedAt: new Date(),
        isLeader: newRole !== "church_member"
    })
        .where((0, drizzle_orm_1.eq)(schema_1.members.memberId, memberId))
        .returning();
    let updatedUser = null;
    let newToken = null;
    if (member.userId) {
        const [existingUser] = await db_1.default
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.userId, member.userId));
        if (existingUser) {
            [updatedUser] = await db_1.default
                .update(schema_1.users)
                .set({
                role: newRole,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(schema_1.users.userId, member.userId))
                .returning();
            newToken = jsonwebtoken_1.default.sign({
                userId: updatedUser.userId,
                role: updatedUser.role,
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                churchId: updatedUser.churchId,
                organizationId: updatedUser.organizationId,
                largeOrganizationId: updatedUser.largeOrganizationId,
            }, process.env.JWT_SECRET, { expiresIn: "7d" });
        }
    }
    return {
        member: updatedMember,
        user: updatedUser,
        newToken: newToken,
        updatedUser: updatedUser ? {
            userId: updatedUser.userId,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            role: updatedUser.role,
            churchId: updatedUser.churchId,
            organizationId: updatedUser.organizationId,
            largeOrganizationId: updatedUser.largeOrganizationId,
            isActive: updatedUser.isActive,
            isVerified: updatedUser.isVerified,
        } : null
    };
};
exports.upgradeMemberRoleService = upgradeMemberRoleService;
const deleteMemberService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.members)
        .where((0, drizzle_orm_1.eq)(schema_1.members.memberId, id))
        .returning({ id: schema_1.members.memberId });
    if (!result)
        throw new Error("Member not found");
    return result;
};
exports.deleteMemberService = deleteMemberService;
