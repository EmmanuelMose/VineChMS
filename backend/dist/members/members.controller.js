"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMember = exports.upgradeMemberRole = exports.updateMember = exports.getMemberByUserId = exports.getMemberById = exports.getMembers = void 0;
const members_service_1 = require("./members.service");
const getMembers = async (req, res) => {
    try {
        const userRole = req.user.role;
        const churchId = req.user.churchId;
        const organizationId = req.user.organizationId;
        const largeOrganizationId = req.user.largeOrganizationId;
        let result;
        if (userRole === "super_admin") {
            result = await (0, members_service_1.getMembersService)();
        }
        else if (userRole === "church_admin" || userRole === "pastor" || userRole === "elder" || userRole === "secretary") {
            if (!churchId) {
                return res.status(400).json({
                    success: false,
                    message: "User is not associated with a church",
                });
            }
            result = await (0, members_service_1.getMembersByChurchService)(churchId);
        }
        else if (userRole === "church_member") {
            const member = await (0, members_service_1.getMemberByUserIdService)(req.user.userId);
            result = [member];
        }
        else if (userRole === "small_org_admin" || userRole === "small_org_member") {
            if (!organizationId) {
                return res.status(400).json({
                    success: false,
                    message: "User is not associated with an organization",
                });
            }
            result = await (0, members_service_1.getMembersByOrganizationService)(organizationId);
        }
        else if (userRole === "large_org_admin" || userRole === "large_org_member") {
            if (!largeOrganizationId) {
                return res.status(400).json({
                    success: false,
                    message: "User is not associated with a large organization",
                });
            }
            result = await (0, members_service_1.getMembersByLargeOrganizationService)(largeOrganizationId);
        }
        else {
            result = await (0, members_service_1.getMembersByChurchService)(churchId);
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getMembers = getMembers;
const getMemberById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, members_service_1.getMemberByIdService)(id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getMemberById = getMemberById;
const getMemberByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const result = await (0, members_service_1.getMemberByUserIdService)(userId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getMemberByUserId = getMemberByUserId;
const updateMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await (0, members_service_1.updateMemberService)(id, req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateMember = updateMember;
const upgradeMemberRole = async (req, res) => {
    try {
        const memberId = parseInt(req.params.id);
        const { role } = req.body;
        const userRole = req.user.role;
        if (userRole !== "church_admin" && userRole !== "super_admin") {
            return res.status(403).json({
                success: false,
                message: "Only Church Admin or Super Admin can upgrade members",
            });
        }
        const validRoles = ["pastor", "elder", "treasurer", "secretary", "church_member"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Valid roles: pastor, elder, treasurer, secretary, church_member",
            });
        }
        const result = await (0, members_service_1.upgradeMemberRoleService)(memberId, role, req.user.userId);
        const responseData = {
            success: true,
            data: {
                member: result.member,
                user: result.user,
            },
            message: `✅ Member upgraded to ${role} successfully!`,
        };
        if (result.newToken && result.updatedUser) {
            responseData.newToken = result.newToken;
            responseData.updatedUser = result.updatedUser;
            responseData.message = `✅ Member upgraded to ${role} successfully! Your session has been refreshed.`;
        }
        res.json(responseData);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.upgradeMemberRole = upgradeMemberRole;
const deleteMember = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, members_service_1.deleteMemberService)(id);
        res.json({ success: true, message: "Member deleted" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteMember = deleteMember;
