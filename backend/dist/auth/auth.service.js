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
const registerService = async (fullName, email, password, invitationToken) => {
    const unregisteredUser = await db_1.default.query.unregisteredUsers.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.unregisteredUsers.invitationToken, invitationToken),
    });
    if (!unregisteredUser) {
        throw new Error("Invalid invitation token");
    }
    if (new Date() > new Date(unregisteredUser.tokenExpiresAt)) {
        throw new Error("Invitation token has expired");
    }
    if (unregisteredUser.email !== email) {
        throw new Error("Email does not match invitation");
    }
    const existingUser = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (existingUser && existingUser.isVerified) {
        throw new Error("User already registered");
    }
    const verificationCode = generateCode();
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const userData = {
        email,
        fullName,
        passwordHash,
        role: unregisteredUser.role,
        verificationCode,
        isVerified: false,
        isActive: true,
        phone: null,
        profilePicture: null,
        organizationId: unregisteredUser.organizationId || null,
        churchId: unregisteredUser.churchId || null,
        largeOrganizationId: unregisteredUser.largeOrganizationId || null,
    };
    if (existingUser && !existingUser.isVerified) {
        await db_1.default
            .update(schema_1.users)
            .set({
            fullName,
            passwordHash,
            verificationCode,
            role: unregisteredUser.role,
            isActive: true,
            organizationId: userData.organizationId || null,
            churchId: userData.churchId || null,
            largeOrganizationId: userData.largeOrganizationId || null,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.userId, existingUser.userId));
    }
    else {
        await db_1.default.insert(schema_1.users).values(userData);
    }
    await db_1.default
        .delete(schema_1.unregisteredUsers)
        .where((0, drizzle_orm_1.eq)(schema_1.unregisteredUsers.unregisteredUserId, unregisteredUser.unregisteredUserId));
    await (0, mailer_1.sendEmail)(email, "Verify Your Account - VineChMS", `Your verification code is ${verificationCode}`, `
    <h2 style="color: #2E7D32;">Welcome to VineChMS!</h2>
    <p>Your verification code is:</p>
    <h1 style="color: #1565C0; font-size: 32px;">${verificationCode}</h1>
    <p>Enter this code to verify your account.</p>
    <p style="color: #FFC107;">VineChMS - Church Management Platform</p>
    `);
};
exports.registerService = registerService;
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
    const token = jsonwebtoken_1.default.sign({
        userId: user.userId,
        role: user.role,
        email: user.email,
        fullName: user.fullName,
        churchId: user.churchId,
        organizationId: user.organizationId,
        largeOrganizationId: user.largeOrganizationId,
    }, JWT_SECRET, { expiresIn: "7d" });
    return {
        token,
        user: {
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            isVerified: user.isVerified,
            isActive: user.isActive,
            profilePicture: user.profilePicture,
            phone: user.phone,
            organizationId: user.organizationId,
            churchId: user.churchId,
            largeOrganizationId: user.largeOrganizationId,
        },
    };
};
exports.loginService = loginService;
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
    <h2 style="color: #2E7D32;">Password Reset Request</h2>
    <p>Your password reset code is:</p>
    <h1 style="color: #1565C0; font-size: 32px;">${resetCode}</h1>
    <p>This code expires in 1 hour.</p>
    <p style="color: #FFC107;">VineChMS - Church Management Platform</p>
    `);
};
exports.forgotPasswordService = forgotPasswordService;
const verifyResetCodeService = async (email, code) => {
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (!user || user.verificationCode !== code) {
        throw new Error("Invalid reset code");
    }
};
exports.verifyResetCodeService = verifyResetCodeService;
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
