"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMemberFromDepartment = exports.updateDepartmentMember = exports.getDepartmentMembers = exports.addMemberToDepartment = exports.getSubDepartments = exports.deleteDepartment = exports.updateDepartment = exports.getDepartmentById = exports.getDepartments = exports.createDepartment = void 0;
const departments_service_1 = require("./departments.service");
const createDepartment = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { type, churchId, organizationId, largeOrganizationId } = req.body;
        if (!type) {
            return res.status(400).json({ success: false, message: "Department type is required" });
        }
        // Validate based on type
        if (type === "church_department" && !churchId) {
            return res.status(400).json({ success: false, message: "churchId is required for church_department" });
        }
        if (type === "org_department" && !organizationId) {
            return res.status(400).json({ success: false, message: "organizationId is required for org_department" });
        }
        if (type === "large_org_department" && !largeOrganizationId) {
            return res.status(400).json({ success: false, message: "largeOrganizationId is required for large_org_department" });
        }
        // Verify user has access to the church/organization
        const userChurchId = req.user?.churchId;
        if (type === "church_department" && churchId !== userChurchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, departments_service_1.createDepartmentService)({ ...req.body, createdBy: userId });
        res.status(201).json({ success: true, data: result, message: "Department created successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to create department" });
    }
};
exports.createDepartment = createDepartment;
const getDepartments = async (req, res) => {
    try {
        const churchId = req.user?.churchId;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        const userRole = req.user?.role;
        let result;
        if (userRole === "church_admin" || userRole === "church_member" || userRole === "pastor") {
            result = await (0, departments_service_1.getDepartmentsByChurchService)(churchId);
        }
        else if (userRole === "small_org_admin" || userRole === "small_org_member") {
            result = await (0, departments_service_1.getDepartmentsByOrganizationService)(organizationId);
        }
        else if (userRole === "large_org_admin" || userRole === "large_org_member") {
            result = await (0, departments_service_1.getDepartmentsByLargeOrganizationService)(largeOrganizationId);
        }
        else if (userRole === "super_admin") {
            result = await (0, departments_service_1.getDepartmentsByChurchService)(churchId);
        }
        else {
            result = await (0, departments_service_1.getDepartmentsByChurchService)(churchId);
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch departments" });
    }
};
exports.getDepartments = getDepartments;
const getDepartmentById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, departments_service_1.getDepartmentByIdService)(id);
        // Check access based on department type
        const churchId = req.user?.churchId;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        if (result.type === "church_department" && result.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (result.type === "org_department" && result.organizationId !== organizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (result.type === "large_org_department" && result.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: "Department not found" });
    }
};
exports.getDepartmentById = getDepartmentById;
const updateDepartment = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await (0, departments_service_1.getDepartmentByIdService)(id);
        const churchId = req.user?.churchId;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        if (existing.type === "church_department" && existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (existing.type === "org_department" && existing.organizationId !== organizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (existing.type === "large_org_department" && existing.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, departments_service_1.updateDepartmentService)(id, req.body);
        res.json({ success: true, data: result, message: "Department updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update department" });
    }
};
exports.updateDepartment = updateDepartment;
const deleteDepartment = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await (0, departments_service_1.getDepartmentByIdService)(id);
        const churchId = req.user?.churchId;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        if (existing.type === "church_department" && existing.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (existing.type === "org_department" && existing.organizationId !== organizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (existing.type === "large_org_department" && existing.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        await (0, departments_service_1.deleteDepartmentService)(id);
        res.json({ success: true, message: "Department deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete department" });
    }
};
exports.deleteDepartment = deleteDepartment;
const getSubDepartments = async (req, res) => {
    try {
        const parentId = parseInt(req.params.parentId);
        const parent = await (0, departments_service_1.getDepartmentByIdService)(parentId);
        const churchId = req.user?.churchId;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        if (parent.type === "church_department" && parent.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (parent.type === "org_department" && parent.organizationId !== organizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (parent.type === "large_org_department" && parent.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, departments_service_1.getSubDepartmentsService)(parentId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch sub-departments" });
    }
};
exports.getSubDepartments = getSubDepartments;
const addMemberToDepartment = async (req, res) => {
    try {
        const { departmentId, memberId } = req.body;
        const department = await (0, departments_service_1.getDepartmentByIdService)(departmentId);
        const churchId = req.user?.churchId;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        if (department.type === "church_department" && department.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (department.type === "org_department" && department.organizationId !== organizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (department.type === "large_org_department" && department.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, departments_service_1.addMemberToDepartmentService)(req.body);
        res.status(201).json({ success: true, data: result, message: "Member added to department successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to add member to department" });
    }
};
exports.addMemberToDepartment = addMemberToDepartment;
const getDepartmentMembers = async (req, res) => {
    try {
        const departmentId = parseInt(req.params.departmentId);
        const department = await (0, departments_service_1.getDepartmentByIdService)(departmentId);
        const churchId = req.user?.churchId;
        const organizationId = req.user?.organizationId;
        const largeOrganizationId = req.user?.largeOrganizationId;
        if (department.type === "church_department" && department.churchId !== churchId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (department.type === "org_department" && department.organizationId !== organizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (department.type === "large_org_department" && department.largeOrganizationId !== largeOrganizationId) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const result = await (0, departments_service_1.getDepartmentMembersService)(departmentId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch department members" });
    }
};
exports.getDepartmentMembers = getDepartmentMembers;
const updateDepartmentMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, departments_service_1.updateDepartmentMemberService)(id, req.body);
        res.json({ success: true, data: result, message: "Department member updated successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to update department member" });
    }
};
exports.updateDepartmentMember = updateDepartmentMember;
const removeMemberFromDepartment = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, departments_service_1.removeMemberFromDepartmentService)(id);
        res.json({ success: true, message: "Member removed from department successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to remove member from department" });
    }
};
exports.removeMemberFromDepartment = removeMemberFromDepartment;
