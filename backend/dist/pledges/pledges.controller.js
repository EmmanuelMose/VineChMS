"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPledgesSummary = exports.fulfillPledge = exports.getUnfulfilledPledges = exports.getFulfilledPledges = exports.getPledgesByCategory = exports.getPledgesByMember = exports.deletePledge = exports.updatePledge = exports.getPledgeById = exports.getPledges = exports.createPledge = void 0;
const pledges_service_1 = require("./pledges.service");
const createPledge = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({
                success: false,
                message: "Church ID is required"
            });
        }
        const result = await (0, pledges_service_1.createPledgeService)({ ...req.body, churchId });
        res.status(201).json({
            success: true,
            data: result,
            message: "Pledge created successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create pledge"
        });
    }
};
exports.createPledge = createPledge;
const getPledges = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({
                success: false,
                message: "Church ID is required"
            });
        }
        const result = await (0, pledges_service_1.getPledgesByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch pledges"
        });
    }
};
exports.getPledges = getPledges;
const getPledgeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, pledges_service_1.getPledgeByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Pledge not found"
        });
    }
};
exports.getPledgeById = getPledgeById;
const updatePledge = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, pledges_service_1.getPledgeByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        const result = await (0, pledges_service_1.updatePledgeService)(id, req.body);
        res.json({
            success: true,
            data: result,
            message: "Pledge updated successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update pledge"
        });
    }
};
exports.updatePledge = updatePledge;
const deletePledge = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, pledges_service_1.getPledgeByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        await (0, pledges_service_1.deletePledgeService)(id);
        res.json({
            success: true,
            message: "Pledge deleted successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to delete pledge"
        });
    }
};
exports.deletePledge = deletePledge;
const getPledgesByMember = async (req, res) => {
    try {
        const memberId = parseInt(req.params.memberId);
        const churchId = req.user?.churchId;
        const result = await (0, pledges_service_1.getPledgesByMemberService)(memberId);
        // Filter by church to ensure data isolation
        const filtered = result.filter(pledge => pledge.churchId === churchId);
        res.json({ success: true, data: filtered });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch pledges"
        });
    }
};
exports.getPledgesByMember = getPledgesByMember;
const getPledgesByCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const churchId = req.user?.churchId;
        const result = await (0, pledges_service_1.getPledgesByCategoryService)(categoryId);
        // Filter by church to ensure data isolation
        const filtered = result.filter(pledge => pledge.churchId === churchId);
        res.json({ success: true, data: filtered });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch pledges"
        });
    }
};
exports.getPledgesByCategory = getPledgesByCategory;
const getFulfilledPledges = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({
                success: false,
                message: "Church ID is required"
            });
        }
        const result = await (0, pledges_service_1.getFulfilledPledgesService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch fulfilled pledges"
        });
    }
};
exports.getFulfilledPledges = getFulfilledPledges;
const getUnfulfilledPledges = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({
                success: false,
                message: "Church ID is required"
            });
        }
        const result = await (0, pledges_service_1.getUnfulfilledPledgesService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch unfulfilled pledges"
        });
    }
};
exports.getUnfulfilledPledges = getUnfulfilledPledges;
const fulfillPledge = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, pledges_service_1.getPledgeByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        const result = await (0, pledges_service_1.fulfillPledgeService)(id);
        res.json({
            success: true,
            data: result,
            message: "Pledge fulfilled successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fulfill pledge"
        });
    }
};
exports.fulfillPledge = fulfillPledge;
const getPledgesSummary = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({
                success: false,
                message: "Church ID is required"
            });
        }
        const result = await (0, pledges_service_1.getPledgesSummaryService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch pledges summary"
        });
    }
};
exports.getPledgesSummary = getPledgesSummary;
