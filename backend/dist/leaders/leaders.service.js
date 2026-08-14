"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadersSummaryService = exports.getApprovedLeadersService = exports.getActiveLeadersService = exports.revokeApprovalService = exports.approveLeaderService = exports.deleteLeaderService = exports.updateLeaderService = exports.getLeadersByChurchService = exports.getLeadersByPositionService = exports.getLeadersByMemberService = exports.getLeaderByIdService = exports.getLeadersService = exports.createLeaderService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const toDate = (value) => {
    if (!value)
        return null;
    if (value instanceof Date)
        return value;
    if (typeof value === 'string') {
        const date = new Date(value);
        if (isNaN(date.getTime()))
            return null;
        return date;
    }
    if (typeof value === 'number')
        return new Date(value);
    return null;
};
const toDateOrNow = (value) => {
    if (!value)
        return new Date();
    if (value instanceof Date)
        return value;
    if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime()))
            return date;
    }
    if (typeof value === 'number')
        return new Date(value);
    return new Date();
};
const createLeaderService = async (data) => {
    const processedData = {
        ...data,
        startDate: toDateOrNow(data.startDate),
        endDate: toDate(data.endDate),
        approvedAt: data.approvedAt ? toDate(data.approvedAt) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        isApproved: data.isApproved !== undefined ? data.isApproved : false,
    };
    Object.keys(processedData).forEach(key => {
        if (processedData[key] === undefined) {
            delete processedData[key];
        }
    });
    const [result] = await db_1.default
        .insert(schema_1.leaders)
        .values(processedData)
        .returning();
    return result;
};
exports.createLeaderService = createLeaderService;
const getLeadersService = async () => {
    return await db_1.default
        .select({
        leaderId: schema_1.leaders.leaderId,
        memberId: schema_1.leaders.memberId,
        positionId: schema_1.leaders.positionId,
        positionName: schema_1.positions.name,
        fullName: schema_1.users.fullName,
        email: schema_1.users.email,
        startDate: schema_1.leaders.startDate,
        endDate: schema_1.leaders.endDate,
        isActive: schema_1.leaders.isActive,
        isApproved: schema_1.leaders.isApproved,
        approvedBy: schema_1.leaders.approvedBy,
        approvedAt: schema_1.leaders.approvedAt,
        notes: schema_1.leaders.notes,
        profilePicture: schema_1.leaders.profilePicture,
        createdAt: schema_1.leaders.createdAt,
        updatedAt: schema_1.leaders.updatedAt,
    })
        .from(schema_1.leaders)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.leaders.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .leftJoin(schema_1.positions, (0, drizzle_orm_1.eq)(schema_1.leaders.positionId, schema_1.positions.positionId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.leaders.createdAt));
};
exports.getLeadersService = getLeadersService;
const getLeaderByIdService = async (id) => {
    const [result] = await db_1.default
        .select({
        leaderId: schema_1.leaders.leaderId,
        memberId: schema_1.leaders.memberId,
        positionId: schema_1.leaders.positionId,
        startDate: schema_1.leaders.startDate,
        endDate: schema_1.leaders.endDate,
        isActive: schema_1.leaders.isActive,
        isApproved: schema_1.leaders.isApproved,
        approvedBy: schema_1.leaders.approvedBy,
        approvedAt: schema_1.leaders.approvedAt,
        notes: schema_1.leaders.notes,
        profilePicture: schema_1.leaders.profilePicture,
        createdAt: schema_1.leaders.createdAt,
        updatedAt: schema_1.leaders.updatedAt,
    })
        .from(schema_1.leaders)
        .where((0, drizzle_orm_1.eq)(schema_1.leaders.leaderId, id));
    if (!result) {
        throw new Error("Leader not found");
    }
    return result;
};
exports.getLeaderByIdService = getLeaderByIdService;
const getLeadersByMemberService = async (memberId) => {
    return await db_1.default
        .select({
        leaderId: schema_1.leaders.leaderId,
        positionId: schema_1.leaders.positionId,
        positionName: schema_1.positions.name,
        startDate: schema_1.leaders.startDate,
        endDate: schema_1.leaders.endDate,
        isActive: schema_1.leaders.isActive,
        isApproved: schema_1.leaders.isApproved,
        notes: schema_1.leaders.notes,
    })
        .from(schema_1.leaders)
        .leftJoin(schema_1.positions, (0, drizzle_orm_1.eq)(schema_1.leaders.positionId, schema_1.positions.positionId))
        .where((0, drizzle_orm_1.eq)(schema_1.leaders.memberId, memberId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.leaders.createdAt));
};
exports.getLeadersByMemberService = getLeadersByMemberService;
const getLeadersByPositionService = async (positionId) => {
    return await db_1.default
        .select({
        leaderId: schema_1.leaders.leaderId,
        memberId: schema_1.leaders.memberId,
        fullName: schema_1.users.fullName,
        email: schema_1.users.email,
        startDate: schema_1.leaders.startDate,
        endDate: schema_1.leaders.endDate,
        isActive: schema_1.leaders.isActive,
        isApproved: schema_1.leaders.isApproved,
    })
        .from(schema_1.leaders)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.leaders.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .where((0, drizzle_orm_1.eq)(schema_1.leaders.positionId, positionId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.leaders.createdAt));
};
exports.getLeadersByPositionService = getLeadersByPositionService;
const getLeadersByChurchService = async (churchId) => {
    return await db_1.default
        .select({
        leaderId: schema_1.leaders.leaderId,
        memberId: schema_1.leaders.memberId,
        positionId: schema_1.leaders.positionId,
        positionName: schema_1.positions.name,
        fullName: schema_1.users.fullName,
        email: schema_1.users.email,
        startDate: schema_1.leaders.startDate,
        endDate: schema_1.leaders.endDate,
        isActive: schema_1.leaders.isActive,
        isApproved: schema_1.leaders.isApproved,
    })
        .from(schema_1.leaders)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.leaders.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .leftJoin(schema_1.positions, (0, drizzle_orm_1.eq)(schema_1.leaders.positionId, schema_1.positions.positionId))
        .where((0, drizzle_orm_1.eq)(schema_1.members.churchId, churchId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.leaders.createdAt));
};
exports.getLeadersByChurchService = getLeadersByChurchService;
const updateLeaderService = async (id, data) => {
    const processedData = {
        ...data,
        updatedAt: new Date(),
    };
    if (data.startDate !== undefined) {
        processedData.startDate = data.startDate ? toDate(data.startDate) : null;
    }
    if (data.endDate !== undefined) {
        processedData.endDate = data.endDate ? toDate(data.endDate) : null;
    }
    if (data.approvedAt !== undefined) {
        processedData.approvedAt = data.approvedAt ? toDate(data.approvedAt) : null;
    }
    Object.keys(processedData).forEach(key => {
        if (processedData[key] === undefined) {
            delete processedData[key];
        }
    });
    const [result] = await db_1.default
        .update(schema_1.leaders)
        .set(processedData)
        .where((0, drizzle_orm_1.eq)(schema_1.leaders.leaderId, id))
        .returning();
    if (!result) {
        throw new Error("Leader not found");
    }
    return result;
};
exports.updateLeaderService = updateLeaderService;
const deleteLeaderService = async (id) => {
    const [result] = await db_1.default
        .delete(schema_1.leaders)
        .where((0, drizzle_orm_1.eq)(schema_1.leaders.leaderId, id))
        .returning({ id: schema_1.leaders.leaderId });
    if (!result) {
        throw new Error("Leader not found");
    }
    return result;
};
exports.deleteLeaderService = deleteLeaderService;
const approveLeaderService = async (id, userId) => {
    const [result] = await db_1.default
        .update(schema_1.leaders)
        .set({
        isApproved: true,
        approvedBy: userId,
        approvedAt: new Date(),
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(schema_1.leaders.leaderId, id))
        .returning();
    if (!result) {
        throw new Error("Leader not found");
    }
    return result;
};
exports.approveLeaderService = approveLeaderService;
const revokeApprovalService = async (id) => {
    const [result] = await db_1.default
        .update(schema_1.leaders)
        .set({
        isApproved: false,
        approvedBy: null,
        approvedAt: null,
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(schema_1.leaders.leaderId, id))
        .returning();
    if (!result) {
        throw new Error("Leader not found");
    }
    return result;
};
exports.revokeApprovalService = revokeApprovalService;
const getActiveLeadersService = async () => {
    return await db_1.default
        .select({
        leaderId: schema_1.leaders.leaderId,
        memberId: schema_1.leaders.memberId,
        positionId: schema_1.leaders.positionId,
        positionName: schema_1.positions.name,
        fullName: schema_1.users.fullName,
        email: schema_1.users.email,
        startDate: schema_1.leaders.startDate,
        endDate: schema_1.leaders.endDate,
        isActive: schema_1.leaders.isActive,
        isApproved: schema_1.leaders.isApproved,
    })
        .from(schema_1.leaders)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.leaders.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .leftJoin(schema_1.positions, (0, drizzle_orm_1.eq)(schema_1.leaders.positionId, schema_1.positions.positionId))
        .where((0, drizzle_orm_1.eq)(schema_1.leaders.isActive, true))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.leaders.createdAt));
};
exports.getActiveLeadersService = getActiveLeadersService;
const getApprovedLeadersService = async () => {
    return await db_1.default
        .select({
        leaderId: schema_1.leaders.leaderId,
        memberId: schema_1.leaders.memberId,
        positionId: schema_1.leaders.positionId,
        positionName: schema_1.positions.name,
        fullName: schema_1.users.fullName,
        email: schema_1.users.email,
        startDate: schema_1.leaders.startDate,
        endDate: schema_1.leaders.endDate,
        isActive: schema_1.leaders.isActive,
        isApproved: schema_1.leaders.isApproved,
    })
        .from(schema_1.leaders)
        .leftJoin(schema_1.members, (0, drizzle_orm_1.eq)(schema_1.leaders.memberId, schema_1.members.memberId))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.members.userId, schema_1.users.userId))
        .leftJoin(schema_1.positions, (0, drizzle_orm_1.eq)(schema_1.leaders.positionId, schema_1.positions.positionId))
        .where((0, drizzle_orm_1.eq)(schema_1.leaders.isApproved, true))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.leaders.createdAt));
};
exports.getApprovedLeadersService = getApprovedLeadersService;
const getLeadersSummaryService = async () => {
    const allLeaders = await db_1.default
        .select()
        .from(schema_1.leaders);
    const total = allLeaders.length;
    const active = allLeaders.filter(l => l.isActive).length;
    const approved = allLeaders.filter(l => l.isApproved).length;
    const pending = allLeaders.filter(l => !l.isApproved && l.isActive).length;
    const inactive = allLeaders.filter(l => !l.isActive).length;
    return {
        total,
        active,
        approved,
        pending,
        inactive,
    };
};
exports.getLeadersSummaryService = getLeadersSummaryService;
