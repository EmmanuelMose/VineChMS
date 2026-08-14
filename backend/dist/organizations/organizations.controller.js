"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganization = exports.updateOrganization = exports.getOrganizationById = exports.getOrganizations = exports.createOrganization = exports.deleteLargeOrganization = exports.updateLargeOrganization = exports.getLargeOrganizationById = exports.getLargeOrganizations = exports.createLargeOrganization = void 0;
const organizations_service_1 = require("./organizations.service");
// LARGE ORGANIZATIONS
const createLargeOrganization = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await (0, organizations_service_1.createLargeOrganizationService)(userId, req.body);
        res.status(201).json({ success: true, data: result, message: "Large organization created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create large organization" });
    }
};
exports.createLargeOrganization = createLargeOrganization;
const getLargeOrganizations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user?.role;
        let result;
        if (userRole === "super_admin") {
            result = await (0, organizations_service_1.getLargeOrganizationsService)();
        }
        else {
            result = await (0, organizations_service_1.getLargeOrganizationsService)(userId);
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch large organizations" });
    }
};
exports.getLargeOrganizations = getLargeOrganizations;
const getLargeOrganizationById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, organizations_service_1.getLargeOrganizationByIdService)(id);
        const userId = req.user.userId;
        const userRole = req.user?.role;
        if (userRole !== "super_admin" && result.createdBy !== userId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Large organization not found" });
    }
};
exports.getLargeOrganizationById = getLargeOrganizationById;
const updateLargeOrganization = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const userRole = req.user?.role;
        const existing = await (0, organizations_service_1.getLargeOrganizationByIdService)(id);
        if (userRole !== "super_admin" && existing.createdBy !== userId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, organizations_service_1.updateLargeOrganizationService)(id, req.body);
        res.json({ success: true, data: result, message: "Large organization updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update large organization" });
    }
};
exports.updateLargeOrganization = updateLargeOrganization;
const deleteLargeOrganization = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const userRole = req.user?.role;
        const existing = await (0, organizations_service_1.getLargeOrganizationByIdService)(id);
        if (userRole !== "super_admin" && existing.createdBy !== userId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, organizations_service_1.deleteLargeOrganizationService)(id);
        res.json({ success: true, message: "Large organization deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete large organization" });
    }
};
exports.deleteLargeOrganization = deleteLargeOrganization;
// SMALL ORGANIZATIONS
const createOrganization = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { largeOrganizationId } = req.body;
        // Verify access to the large organization
        const largeOrg = await (0, organizations_service_1.getLargeOrganizationByIdService)(largeOrganizationId);
        if (largeOrg.createdBy !== userId && req.user?.role !== "super_admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, organizations_service_1.createOrganizationService)(userId, req.body);
        res.status(201).json({ success: true, data: result, message: "Organization created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create organization" });
    }
};
exports.createOrganization = createOrganization;
const getOrganizations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user?.role;
        const largeOrganizationId = req.user?.largeOrganizationId;
        let result;
        if (userRole === "super_admin") {
            result = await (0, organizations_service_1.getOrganizationsByLargeOrganizationService)(largeOrganizationId);
        }
        else if (userRole === "large_org_admin" || userRole === "large_org_member") {
            result = await (0, organizations_service_1.getOrganizationsByLargeOrganizationService)(largeOrganizationId);
        }
        else {
            result = await (0, organizations_service_1.getOrganizationsService)(userId);
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch organizations" });
    }
};
exports.getOrganizations = getOrganizations;
const getOrganizationById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, organizations_service_1.getOrganizationByIdService)(id);
        const userId = req.user.userId;
        const userRole = req.user?.role;
        const largeOrganizationId = req.user?.largeOrganizationId;
        if (userRole !== "super_admin" &&
            result.createdBy !== userId &&
            result.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Organization not found" });
    }
};
exports.getOrganizationById = getOrganizationById;
const updateOrganization = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const userRole = req.user?.role;
        const largeOrganizationId = req.user?.largeOrganizationId;
        const existing = await (0, organizations_service_1.getOrganizationByIdService)(id);
        if (userRole !== "super_admin" &&
            existing.createdBy !== userId &&
            existing.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, organizations_service_1.updateOrganizationService)(id, req.body);
        res.json({ success: true, data: result, message: "Organization updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update organization" });
    }
};
exports.updateOrganization = updateOrganization;
const deleteOrganization = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const userRole = req.user?.role;
        const largeOrganizationId = req.user?.largeOrganizationId;
        const existing = await (0, organizations_service_1.getOrganizationByIdService)(id);
        if (userRole !== "super_admin" &&
            existing.createdBy !== userId &&
            existing.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, organizations_service_1.deleteOrganizationService)(id);
        res.json({ success: true, message: "Organization deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete organization" });
    }
};
exports.deleteOrganization = deleteOrganization;
