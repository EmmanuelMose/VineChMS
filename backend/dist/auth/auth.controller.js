"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserController = exports.resetPasswordController = exports.verifyResetCodeController = exports.forgotPasswordController = exports.loginController = exports.verifyController = exports.registerController = void 0;
const auth_service_1 = require("./auth.service");
// Register
const registerController = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        await (0, auth_service_1.registerService)(fullName, email, password, role);
        res.json({ success: true, message: "Verification code sent to your email" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.registerController = registerController;
// Verify Email
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
// Login
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
// Forgot Password
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
// Verify Reset Code
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
// Reset Password
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
// Get Current User
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
            },
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getCurrentUserController = getCurrentUserController;
