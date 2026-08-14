"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertVisitorToMember = exports.getVisitorsByDateRange = exports.getVisitorsByService = exports.deleteVisitor = exports.updateVisitor = exports.getVisitorById = exports.getVisitors = exports.createVisitor = void 0;
const visitors_service_1 = require("./visitors.service");
const createVisitor = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, visitors_service_1.createVisitorService)({ ...req.body, churchId });
        res.status(201).json({ success: true, data: result, message: "Visitor created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create visitor" });
    }
};
exports.createVisitor = createVisitor;
const getVisitors = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, visitors_service_1.getVisitorsByChurchService)(churchId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch visitors" });
    }
};
exports.getVisitors = getVisitors;
const getVisitorById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const result = await (0, visitors_service_1.getVisitorByIdService)(id);
        if (result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Visitor not found" });
    }
};
exports.getVisitorById = getVisitorById;
const updateVisitor = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, visitors_service_1.getVisitorByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, visitors_service_1.updateVisitorService)(id, req.body);
        res.json({ success: true, data: result, message: "Visitor updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update visitor" });
    }
};
exports.updateVisitor = updateVisitor;
const deleteVisitor = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, visitors_service_1.getVisitorByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, visitors_service_1.deleteVisitorService)(id);
        res.json({ success: true, message: "Visitor deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || "Failed to delete visitor" });
    }
};
exports.deleteVisitor = deleteVisitor;
const getVisitorsByService = async (req, res) => {
    try {
        const serviceId = parseInt(req.params.serviceId);
        const churchId = req.user?.churchId;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        const result = await (0, visitors_service_1.getVisitorsByServiceService)(serviceId);
        const filtered = result.filter(v => v.churchId === churchId);
        res.json({ success: true, data: filtered });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch visitors" });
    }
};
exports.getVisitorsByService = getVisitorsByService;
const getVisitorsByDateRange = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        const { startDate, endDate } = req.query;
        if (!churchId) {
            return res.status(400).json({ success: false, message: "Church ID is required" });
        }
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "startDate and endDate are required query parameters"
            });
        }
        const result = await (0, visitors_service_1.getVisitorsByDateRangeService)(churchId, startDate, endDate);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch visitors" });
    }
};
exports.getVisitorsByDateRange = getVisitorsByDateRange;
const convertVisitorToMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const churchId = req.user?.churchId;
        const existing = await (0, visitors_service_1.getVisitorByIdService)(id);
        if (existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (existing.isMember) {
            return res.status(400).json({
                success: false,
                message: "This visitor has already been converted to a member"
            });
        }
        const result = await (0, visitors_service_1.convertVisitorToMemberService)(id, req.body);
        res.json({
            success: true,
            data: result,
            message: "Visitor converted to member successfully"
        });
    }
    catch (error) {
        console.error("Error converting visitor:", error);
        let message = "Failed to convert visitor to member";
        if (error.message) {
            if (error.message.includes("already exists")) {
                message = "A member with this email already exists in the church";
            }
            else if (error.message.includes("not found")) {
                message = "Visitor not found";
            }
            else {
                message = error.message;
            }
        }
        res.status(400).json({ success: false, message: message });
    }
};
exports.convertVisitorToMember = convertVisitorToMember;
