"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshUserController = exports.getCurrentUserController = exports.resendVerificationController = exports.resetPasswordController = exports.verifyResetCodeController = exports.forgotPasswordController = exports.loginController = exports.verifyController = exports.registerController = exports.createMemberAndInviteController = void 0;
const auth_service_1 = require("./auth.service");
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createMemberAndInviteController = async (req, res) => {
    try {
        const { fullName, email, role, organizationId, churchId, largeOrganizationId } = req.body;
        const invitedById = req.user.userId;
        if (!fullName || !email || !role) {
            return res.status(400).json({
                success: false,
                message: "fullName, email, and role are required",
            });
        }
        await (0, auth_service_1.createMemberAndInviteService)(fullName, email, role, invitedById, organizationId, churchId, largeOrganizationId);
        res.json({
            success: true,
            message: `Member created and invitation sent to ${email} for role: ${role}`,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createMemberAndInviteController = createMemberAndInviteController;
const registerController = async (req, res) => {
    try {
        const { fullName, email, password, invitationToken } = req.body;
        if (!fullName || !email || !password || !invitationToken) {
            return res.status(400).json({
                success: false,
                message: "fullName, email, password, and invitationToken are required",
            });
        }
        await (0, auth_service_1.registerService)(fullName, email, password, invitationToken);
        res.json({ success: true, message: "Verification code sent to your email" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.registerController = registerController;
const verifyController = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: "email and code are required",
            });
        }
        await (0, auth_service_1.verifyService)(email, code);
        res.json({ success: true, message: "Email verified successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.verifyController = verifyController;
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required",
            });
        }
        const data = await (0, auth_service_1.loginService)(email, password);
        res.json({ success: true, ...data });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.loginController = loginController;
const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email is required",
            });
        }
        await (0, auth_service_1.forgotPasswordService)(email);
        res.json({ success: true, message: "Reset code sent to your email" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.forgotPasswordController = forgotPasswordController;
const verifyResetCodeController = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: "email and code are required",
            });
        }
        await (0, auth_service_1.verifyResetCodeService)(email, code);
        res.json({ success: true });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.verifyResetCodeController = verifyResetCodeController;
const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "email and newPassword are required",
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }
        await (0, auth_service_1.resetPasswordService)(email, newPassword);
        res.json({ success: true, message: "Password reset successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.resetPasswordController = resetPasswordController;
const resendVerificationController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email is required",
            });
        }
        await (0, auth_service_1.resendVerificationService)(email);
        res.json({ success: true, message: "Verification code resent to your email" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.resendVerificationController = resendVerificationController;
const getCurrentUserController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await db_1.default.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.userId, userId),
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            data: {
                userId: user.userId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isVerified: user.isVerified,
                isActive: user.isActive,
                profilePicture: user.profilePicture,
                profilePicturePublicId: user.profilePicturePublicId,
                phone: user.phone,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                maritalStatus: user.maritalStatus,
                occupation: user.occupation,
                address: user.address,
                organizationId: user.organizationId,
                churchId: user.churchId,
                largeOrganizationId: user.largeOrganizationId,
            },
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getCurrentUserController = getCurrentUserController;
const refreshUserController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const result = await (0, auth_service_1.refreshUserService)(user.userId);
        res.json({
            success: true,
            token: result.token,
            user: result.user,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.refreshUserController = refreshUserController;
