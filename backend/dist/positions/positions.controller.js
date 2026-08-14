"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePosition = exports.updatePosition = exports.getPositionById = exports.getPositions = exports.createPosition = void 0;
const positions_service_1 = require("./positions.service");
const createPosition = async (req, res) => {
    try {
        const { churchId, organizationId, largeOrganizationId } = req.body;
        const userChurchId = req.user?.churchId;
        const userOrganizationId = req.user?.organizationId;
        const userLargeOrganizationId = req.user?.largeOrganizationId;
        if (churchId && churchId !== userChurchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (organizationId && organizationId !== userOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (largeOrganizationId && largeOrganizationId !== userLargeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, positions_service_1.createPositionService)(req.body);
        res.status(201).json({ success: true, data: result, message: "Position created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create position" });
    }
};
exports.createPosition = createPosition;
const getPositions = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        const userRole = req.user?.role;
        let result;
        if (userRole === "church_admin" || userRole === "church_member" || userRole === "pastor") {
            result = await (0, positions_service_1.getPositionsByChurchService)(churchId);
        }
        else if (userRole === "small_org_admin" || userRole === "small_org_member") {
            result = await (0, positions_service_1.getPositionsByOrganizationService)(organizationId);
        }
        else if (userRole === "large_org_admin" || userRole === "large_org_member") {
            result = await (0, positions_service_1.getPositionsByLargeOrganizationService)(largeOrganizationId);
        }
        else {
            result = await (0, positions_service_1.getPositionsByChurchService)(churchId);
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch positions" });
    }
};
exports.getPositions = getPositions;
const getPositionById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, positions_service_1.getPositionByIdService)(id);
        const churchId = req.user?.churchId;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        if (result.churchId && result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (result.organizationId && result.organizationId !== organizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (result.largeOrganizationId && result.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Position not found" });
    }
};
exports.getPositionById = getPositionById;
const updatePosition = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await (0, positions_service_1.getPositionByIdService)(id);
        const churchId = req.user?.churchId;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        if (existing.churchId && existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (existing.organizationId && existing.organizationId !== organizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (existing.largeOrganizationId && existing.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, positions_service_1.updatePositionService)(id, req.body);
        res.json({ success: true, data: result, message: "Position updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update position" });
    }
};
exports.updatePosition = updatePosition;
const deletePosition = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await (0, positions_service_1.getPositionByIdService)(id);
        const churchId = req.user?.churchId;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        if (existing.churchId && existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (existing.organizationId && existing.organizationId !== organizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (existing.largeOrganizationId && existing.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, positions_service_1.deletePositionService)(id);
        res.json({ success: true, message: "Position deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete position" });
    }
};
exports.deletePosition = deletePosition;
