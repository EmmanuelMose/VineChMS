"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.verifyResetCodeService = exports.forgotPasswordService = exports.loginService = exports.verifyService = exports.registerService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_1 = require("../mailer/mailer");
const JWT_SECRET = process.env.JWT_SECRET;
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
// Register
const registerService = async (fullName, email, password, role = "church_member") => {
    // Check if user already exists
    const existingUser = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (existingUser && existingUser.isVerified) {
        throw new Error("User already registered");
    }
    const verificationCode = generateCode();
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    if (existingUser && !existingUser.isVerified) {
        // Update existing unverified user
        await db_1.default
            .update(schema_1.users)
            .set({
            fullName,
            passwordHash,
            verificationCode,
            role,
            isActive: true,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.userId, existingUser.userId));
    }
    else {
        // Create new user
        await db_1.default.insert(schema_1.users).values({
            email,
            fullName,
            passwordHash,
            role: role,
            verificationCode,
            isVerified: false,
            isActive: true,
        });
    }
    // Send verification email
    await (0, mailer_1.sendEmail)(email, "Verify Your Account - VineChMS", `Your verification code is ${verificationCode}`, `
    <h2>Welcome to VineChMS!</h2>
    <p>Your verification code is:</p>
    <h1 style="color: #1E3A8A; font-size: 32px;">${verificationCode}</h1>
    <p>Enter this code to verify your account.</p>
    `);
};
exports.registerService = registerService;
// Verify Email
const verifyService = async (email, code) => {
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (!user || user.verificationCode !== code) {
        throw new Error("Invalid verification code");
    }
    await db_1.default
        .update(schema_1.users)
        .set({ isVerified: true, verificationCode: null })
        .where((0, drizzle_orm_1.eq)(schema_1.users.userId, user.userId));
};
exports.verifyService = verifyService;
// Login
const loginService = async (email, password) => {
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (!user)
        throw new Error("User not registered");
    if (!user.isVerified)
        throw new Error("Account not verified");
    if (!user.isActive)
        throw new Error("Account is deactivated");
    const match = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!match)
        throw new Error("Invalid credentials");
    const token = jsonwebtoken_1.default.sign({ userId: user.userId, role: user.role, email: user.email, fullName: user.fullName }, JWT_SECRET, { expiresIn: "7d" });
    return {
        token,
        user: {
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            isVerified: user.isVerified,
            profilePicture: user.profilePicture,
            phone: user.phone,
            organizationId: user.organizationId,
            churchId: user.churchId,
            largeOrganizationId: user.largeOrganizationId,
        },
    };
};
exports.loginService = loginService;
// Forgot Password
const forgotPasswordService = async (email) => {
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (!user || !user.isVerified) {
        throw new Error("User not found or not verified");
    }
    const resetCode = generateCode();
    await db_1.default
        .update(schema_1.users)
        .set({ verificationCode: resetCode })
        .where((0, drizzle_orm_1.eq)(schema_1.users.userId, user.userId));
    await (0, mailer_1.sendEmail)(email, "Password Reset - VineChMS", `Your password reset code is ${resetCode}`, `
    <h2>Password Reset Request</h2>
    <p>Your password reset code is:</p>
    <h1 style="color: #1E3A8A; font-size: 32px;">${resetCode}</h1>
    <p>This code expires in 1 hour.</p>
    `);
};
exports.forgotPasswordService = forgotPasswordService;
// Verify Reset Code
const verifyResetCodeService = async (email, code) => {
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (!user || user.verificationCode !== code) {
        throw new Error("Invalid reset code");
    }
};
exports.verifyResetCodeService = verifyResetCodeService;
// Reset Password
const resetPasswordService = async (email, password) => {
    if (!email)
        throw new Error("Email is required");
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (!user)
        throw new Error("User not found");
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    await db_1.default
        .update(schema_1.users)
        .set({
        passwordHash,
        verificationCode: null,
    })
        .where((0, drizzle_orm_1.eq)(schema_1.users.userId, user.userId));
};
exports.resetPasswordService = resetPasswordService;
