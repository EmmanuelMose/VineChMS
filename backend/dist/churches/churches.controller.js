"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChurchMembers = exports.deleteChurch = exports.updateChurch = exports.getChurchById = exports.getChurches = exports.createChurch = void 0;
const churches_service_1 = require("./churches.service");
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../Drizzle/db"));
const createChurch = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user?.role;
        const { organizationId } = req.body;
        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is required"
            });
        }
        // Verify user has access to the organization
        if (userRole !== "super_admin") {
            const organization = await db_1.default.query.organizations.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.organizations.organizationId, organizationId),
            });
            if (!organization) {
                return res.status(404).json({
                    success: false,
                    message: "Organization not found"
                });
            }
            if (organization.createdBy !== userId && userRole !== "large_org_admin") {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        const result = await (0, churches_service_1.createChurchService)(userId, req.body);
        res.status(201).json({
            success: true,
            data: result,
            message: "Church created successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create church"
        });
    }
};
exports.createChurch = createChurch;
const getChurches = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user?.role;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        let result;
        if (userRole === "super_admin") {
            result = await (0, churches_service_1.getChurchesService)();
        }
        else if (userRole === "large_org_admin" || userRole === "large_org_member") {
            // Get all organizations under this large org
            const orgs = await db_1.default.query.organizations.findMany({
                where: (0, drizzle_orm_1.eq)(schema_1.organizations.largeOrganizationId, largeOrganizationId),
            });
            const orgIds = orgs.map(o => o.organizationId);
            result = await (0, churches_service_1.getChurchesByOrganizationIdsService)(orgIds);
        }
        else if (userRole === "small_org_admin" || userRole === "small_org_member") {
            result = await (0, churches_service_1.getChurchesByOrganizationService)(organizationId);
        }
        else if (userRole === "church_admin" || userRole === "church_member" || userRole === "pastor") {
            const churchId = req.user?.churchId;
            const church = await (0, churches_service_1.getChurchByIdService)(churchId);
            result = [church];
        }
        else {
            result = await (0, churches_service_1.getChurchesByOrganizationService)(organizationId);
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch churches"
        });
    }
};
exports.getChurches = getChurches;
const getChurchById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, churches_service_1.getChurchByIdService)(id);
        const userId = req.user.userId;
        const userRole = req.user?.role;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        // Check access based on role
        if (userRole === "super_admin") {
            // Super admin can access any church
        }
        else if (userRole === "large_org_admin" || userRole === "large_org_member") {
            // Check if church belongs to an organization under this large org
            const org = await db_1.default.query.organizations.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.organizations.organizationId, result.organizationId),
            });
            if (org?.largeOrganizationId !== largeOrganizationId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        else if (userRole === "small_org_admin" || userRole === "small_org_member") {
            if (result.organizationId !== organizationId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        else if (userRole === "church_admin" || userRole === "church_member" || userRole === "pastor") {
            if (result.churchId !== req.user?.churchId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        else {
            if (result.createdBy !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Church not found"
        });
    }
};
exports.getChurchById = getChurchById;
const updateChurch = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const userRole = req.user?.role;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        const existing = await (0, churches_service_1.getChurchByIdService)(id);
        // Check access based on role
        if (userRole === "super_admin") {
            // Super admin can update any church
        }
        else if (userRole === "large_org_admin" || userRole === "large_org_member") {
            const org = await db_1.default.query.organizations.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.organizations.organizationId, existing.organizationId),
            });
            if (org?.largeOrganizationId !== largeOrganizationId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        else if (userRole === "small_org_admin" || userRole === "small_org_member") {
            if (existing.organizationId !== organizationId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        else if (userRole === "church_admin") {
            if (existing.churchId !== req.user?.churchId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        else {
            if (existing.createdBy !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        const result = await (0, churches_service_1.updateChurchService)(id, req.body);
        res.json({
            success: true,
            data: result,
            message: "Church updated successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update church"
        });
    }
};
exports.updateChurch = updateChurch;
const deleteChurch = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.userId;
        const userRole = req.user?.role;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        const existing = await (0, churches_service_1.getChurchByIdService)(id);
        // Only super admin or the creator can delete
        if (userRole !== "super_admin") {
            const org = await db_1.default.query.organizations.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.organizations.organizationId, existing.organizationId),
            });
            if (userRole === "large_org_admin" || userRole === "large_org_member") {
                if (org?.largeOrganizationId !== largeOrganizationId) {
                    return res.status(403).json({
                        success: false,
                        message: "Access denied"
                    });
                }
            }
            else if (userRole === "small_org_admin" || userRole === "small_org_member") {
                if (existing.organizationId !== organizationId) {
                    return res.status(403).json({
                        success: false,
                        message: "Access denied"
                    });
                }
            }
            else {
                if (existing.createdBy !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: "Access denied"
                    });
                }
            }
        }
        await (0, churches_service_1.deleteChurchService)(id);
        res.json({
            success: true,
            message: "Church deleted successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to delete church"
        });
    }
};
exports.deleteChurch = deleteChurch;
const getChurchMembers = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const church = await (0, churches_service_1.getChurchByIdService)(id);
        const userRole = req.user?.role;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        const churchId = req.user?.churchId;
        // Check access
        if (userRole === "super_admin") {
            // Super admin can access any church members
        }
        else if (userRole === "large_org_admin" || userRole === "large_org_member") {
            const org = await db_1.default.query.organizations.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.organizations.organizationId, church.organizationId),
            });
            if (org?.largeOrganizationId !== largeOrganizationId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        else if (userRole === "small_org_admin" || userRole === "small_org_member") {
            if (church.organizationId !== organizationId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        else if (userRole === "church_admin" || userRole === "pastor") {
            if (church.churchId !== churchId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        else if (userRole === "church_member") {
            if (church.churchId !== churchId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        const result = await (0, churches_service_1.getChurchMembersService)(id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch church members"
        });
    }
};
exports.getChurchMembers = getChurchMembers;
