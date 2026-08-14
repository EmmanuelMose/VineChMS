"use strict";
// File: backend/src/giving/giving.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectGiving = exports.approveGiving = exports.getGivingByDateRange = exports.getGivingTotal = exports.getGivingSummary = exports.getGivingByType = exports.getGivingByMember = exports.deleteGiving = exports.updateGiving = exports.getGivingById = exports.getGiving = exports.createGiving = exports.deleteGivingCategory = exports.updateGivingCategory = exports.getGivingCategoryById = exports.getGivingCategories = exports.createGivingCategory = void 0;
const giving_service_1 = require("./giving.service");
const createGivingCategory = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, giving_service_1.createGivingCategoryService)({ ...req.body, churchId });
        res.status(201).json({ success: true, data: result, message: "Category created" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createGivingCategory = createGivingCategory;
const getGivingCategories = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, giving_service_1.getGivingCategoriesByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getGivingCategories = getGivingCategories;
const getGivingCategoryById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, giving_service_1.getGivingCategoryByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getGivingCategoryById = getGivingCategoryById;
const updateGivingCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, giving_service_1.getGivingCategoryByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, giving_service_1.updateGivingCategoryService)(id, req.body);
        res.json({ success: true, data: result, message: "Category updated" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateGivingCategory = updateGivingCategory;
const deleteGivingCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, giving_service_1.getGivingCategoryByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, giving_service_1.deleteGivingCategoryService)(id);
        res.json({ success: true, message: "Category deleted" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteGivingCategory = deleteGivingCategory;
const createGiving = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, giving_service_1.createGivingService)({ ...req.body, churchId });
        res.status(201).json({ success: true, data: result, message: "Giving recorded" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createGiving = createGiving;
const getGiving = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, giving_service_1.getGivingByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getGiving = getGiving;
const getGivingById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, giving_service_1.getGivingByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getGivingById = getGivingById;
const updateGiving = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, giving_service_1.getGivingByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, giving_service_1.updateGivingService)(id, req.body);
        res.json({ success: true, data: result, message: "Giving updated" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateGiving = updateGiving;
const deleteGiving = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, giving_service_1.getGivingByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, giving_service_1.deleteGivingService)(id);
        res.json({ success: true, message: "Giving deleted" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteGiving = deleteGiving;
const getGivingByMember = async (req, res) => {
    try {
        const memberId = parseInt(req.params.memberId);
        const result = await (0, giving_service_1.getGivingByMemberService)(memberId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getGivingByMember = getGivingByMember;
const getGivingByType = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        const type = req.params.type;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, giving_service_1.getGivingByTypeService)(churchId, type);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getGivingByType = getGivingByType;
const getGivingSummary = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, giving_service_1.getGivingSummaryService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getGivingSummary = getGivingSummary;
const getGivingTotal = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, giving_service_1.getGivingTotalService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getGivingTotal = getGivingTotal;
const getGivingByDateRange = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        const { startDate, endDate } = req.query;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: "startDate and endDate are required" });
        }
        const result = await (0, giving_service_1.getGivingByDateRangeService)(churchId, startDate, endDate);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getGivingByDateRange = getGivingByDateRange;
const approveGiving = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const churchId = req.user?.churchId;
        const { amount } = req.body;
        const existing = await (0, giving_service_1.getGivingByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const allowedRoles = ["treasurer", "church_admin", "pastor", "elder"];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Insufficient permissions" });
        }
        let finalAmount = existing.amount;
        if (amount !== undefined && amount !== null && amount !== "") {
            const numAmount = parseFloat(amount);
            if (!isNaN(numAmount) && numAmount > 0) {
                finalAmount = numAmount.toString();
            }
            else {
                return res.status(400).json({ success: false, message: "Invalid amount value" });
            }
        }
        const result = await (0, giving_service_1.approveGivingService)(id, userId, finalAmount);
        res.json({ success: true, data: result, message: "Giving approved" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.approveGiving = approveGiving;
const rejectGiving = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const churchId = req.user?.churchId;
        const existing = await (0, giving_service_1.getGivingByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const allowedRoles = ["treasurer", "church_admin", "pastor", "elder"];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Insufficient permissions" });
        }
        const result = await (0, giving_service_1.rejectGivingService)(id, userId);
        res.json({ success: true, data: result, message: "Giving rejected" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.rejectGiving = rejectGiving;
