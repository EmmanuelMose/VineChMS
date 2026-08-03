"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserController = exports.resetPasswordController = exports.verifyResetCodeController = exports.forgotPasswordController = exports.loginController = exports.verifyController = exports.registerController = void 0;
const auth_service_1 = require("./auth.service");
const registerController = async (req, res) => {
    try {
        const { fullName, email, password, invitationToken } = req.body;
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
        await (0, auth_service_1.forgotPasswordService)(req.body.email);
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
        const { email, password } = req.body;
        await (0, auth_service_1.resetPasswordService)(email, password);
        res.json({ success: true, message: "Password reset successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.resetPasswordController = resetPasswordController;
const getCurrentUserController = async (req, res) => {
    try {
        const user = req.user;
        res.json({
            success: true,
            data: {
                userId: user.userId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                churchId: user.churchId,
                organizationId: user.organizationId,
                largeOrganizationId: user.largeOrganizationId,
            },
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getCurrentUserController = getCurrentUserController;
