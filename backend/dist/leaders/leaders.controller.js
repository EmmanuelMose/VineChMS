"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadersSummary = exports.getApprovedLeaders = exports.getActiveLeaders = exports.revokeApproval = exports.approveLeader = exports.deleteLeader = exports.updateLeader = exports.getLeadersByChurch = exports.getLeadersByPosition = exports.getLeadersByMember = exports.getLeaderById = exports.getLeaders = exports.createLeader = void 0;
const leaders_service_1 = require("./leaders.service");
const createLeader = async (req, res) => {
    try {
        const result = await (0, leaders_service_1.createLeaderService)(req.body);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createLeader = createLeader;
const getLeaders = async (req, res) => {
    try {
        const result = await (0, leaders_service_1.getLeadersService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getLeaders = getLeaders;
const getLeaderById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, leaders_service_1.getLeaderByIdService)(id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getLeaderById = getLeaderById;
const getLeadersByMember = async (req, res) => {
    try {
        const memberId = parseInt(req.params.memberId);
        const result = await (0, leaders_service_1.getLeadersByMemberService)(memberId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getLeadersByMember = getLeadersByMember;
const getLeadersByPosition = async (req, res) => {
    try {
        const positionId = parseInt(req.params.positionId);
        const result = await (0, leaders_service_1.getLeadersByPositionService)(positionId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getLeadersByPosition = getLeadersByPosition;
const getLeadersByChurch = async (req, res) => {
    try {
        const churchId = parseInt(req.params.churchId);
        const result = await (0, leaders_service_1.getLeadersByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getLeadersByChurch = getLeadersByChurch;
const updateLeader = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, leaders_service_1.updateLeaderService)(id, req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateLeader = updateLeader;
const deleteLeader = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, leaders_service_1.deleteLeaderService)(id);
        res.json({ success: true, message: "Leader deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteLeader = deleteLeader;
const approveLeader = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const result = await (0, leaders_service_1.approveLeaderService)(id, userId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.approveLeader = approveLeader;
const revokeApproval = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, leaders_service_1.revokeApprovalService)(id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.revokeApproval = revokeApproval;
const getActiveLeaders = async (req, res) => {
    try {
        const result = await (0, leaders_service_1.getActiveLeadersService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getActiveLeaders = getActiveLeaders;
const getApprovedLeaders = async (req, res) => {
    try {
        const result = await (0, leaders_service_1.getApprovedLeadersService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getApprovedLeaders = getApprovedLeaders;
const getLeadersSummary = async (req, res) => {
    try {
        const result = await (0, leaders_service_1.getLeadersSummaryService)();
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getLeadersSummary = getLeadersSummary;
