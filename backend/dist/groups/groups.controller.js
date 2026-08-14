"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectJoinRequest = exports.approveJoinRequest = exports.getMyJoinRequests = exports.getGroupJoinRequests = exports.requestToJoinGroup = exports.removeMemberFromGroup = exports.updateGroupMember = exports.getMemberGroups = exports.getGroupMembers = exports.addMemberToGroup = exports.getActiveGroups = exports.deleteGroup = exports.updateGroup = exports.getGroupById = exports.getGroups = exports.createGroup = void 0;
const groups_service_1 = require("./groups.service");
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createGroup = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, groups_service_1.createGroupService)({ ...req.body, churchId });
        res.status(201).json({ success: true, data: result, message: "Group created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create group" });
    }
};
exports.createGroup = createGroup;
const getGroups = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, groups_service_1.getGroupsByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch groups" });
    }
};
exports.getGroups = getGroups;
const getGroupById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, groups_service_1.getGroupByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Group not found" });
    }
};
exports.getGroupById = getGroupById;
const updateGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, groups_service_1.getGroupByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, groups_service_1.updateGroupService)(id, req.body);
        res.json({ success: true, data: result, message: "Group updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update group" });
    }
};
exports.updateGroup = updateGroup;
const deleteGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, groups_service_1.getGroupByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, groups_service_1.deleteGroupService)(id);
        res.json({ success: true, message: "Group deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete group" });
    }
};
exports.deleteGroup = deleteGroup;
const getActiveGroups = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, groups_service_1.getActiveGroupsService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch active groups" });
    }
};
exports.getActiveGroups = getActiveGroups;
const addMemberToGroup = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        const { groupId } = req.body;
        const group = await (0, groups_service_1.getGroupByIdService)(groupId);
        if (group.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, groups_service_1.addMemberToGroupService)(req.body);
        res.status(201).json({ success: true, data: result, message: "Member added to group successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to add member to group" });
    }
};
exports.addMemberToGroup = addMemberToGroup;
const getGroupMembers = async (req, res) => {
    try {
        const groupId = parseInt(req.params.groupId);
        const churchId = req.user?.churchId;
        const group = await (0, groups_service_1.getGroupByIdService)(groupId);
        if (group.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, groups_service_1.getGroupMembersService)(groupId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch group members" });
    }
};
exports.getGroupMembers = getGroupMembers;
const getMemberGroups = async (req, res) => {
    try {
        const memberId = parseInt(req.params.memberId);
        const result = await (0, groups_service_1.getMemberGroupsService)(memberId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch member groups" });
    }
};
exports.getMemberGroups = getMemberGroups;
const updateGroupMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, groups_service_1.updateGroupMemberService)(id, req.body);
        res.json({ success: true, data: result, message: "Group member updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update group member" });
    }
};
exports.updateGroupMember = updateGroupMember;
const removeMemberFromGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, groups_service_1.removeMemberFromGroupService)(id);
        res.json({ success: true, message: "Member removed from group successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to remove member from group" });
    }
};
exports.removeMemberFromGroup = removeMemberFromGroup;
const requestToJoinGroup = async (req, res) => {
    try {
        const { groupId, memberId, message } = req.body;
        const userId = req.user?.userId;
        if (userId === undefined) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const member = await db_1.default.query.members.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.members.memberId, memberId), (0, drizzle_orm_1.eq)(schema_1.members.userId, userId)),
        });
        if (!member) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, groups_service_1.createJoinRequestService)({ groupId, memberId, message });
        res.status(201).json({ success: true, data: result, message: "Request sent successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.requestToJoinGroup = requestToJoinGroup;
const getGroupJoinRequests = async (req, res) => {
    try {
        const groupId = parseInt(req.params.groupId);
        const result = await (0, groups_service_1.getGroupJoinRequestsService)(groupId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getGroupJoinRequests = getGroupJoinRequests;
const getMyJoinRequests = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (userId === undefined) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const member = await db_1.default.query.members.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.members.userId, userId),
        });
        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }
        const result = await (0, groups_service_1.getMyJoinRequestsService)(member.memberId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getMyJoinRequests = getMyJoinRequests;
const approveJoinRequest = async (req, res) => {
    try {
        const requestId = parseInt(req.params.requestId);
        const result = await (0, groups_service_1.approveJoinRequestService)(requestId);
        res.json({ success: true, data: result, message: "Request approved. Member added to group." });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.approveJoinRequest = approveJoinRequest;
const rejectJoinRequest = async (req, res) => {
    try {
        const requestId = parseInt(req.params.requestId);
        const result = await (0, groups_service_1.rejectJoinRequestService)(requestId);
        res.json({ success: true, data: result, message: "Request rejected." });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.rejectJoinRequest = rejectJoinRequest;
