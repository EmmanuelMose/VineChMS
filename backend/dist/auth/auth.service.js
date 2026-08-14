"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationService = exports.resetPasswordService = exports.verifyResetCodeService = exports.forgotPasswordService = exports.refreshUserService = exports.loginService = exports.verifyService = exports.registerService = exports.createMemberAndInviteService = void 0;
const db_1 = __importDefault(require("../Drizzle/db"));
const schema_1 = require("../Drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_1 = require("../mailer/mailer");
const JWT_SECRET = process.env.JWT_SECRET;
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const generateMembershipNumber = (churchId) => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CH${churchId}-${year}-${random}`;
};
const adminRoles = ["super_admin", "large_org_admin", "small_org_admin", "church_admin"];
const memberRoles = ["church_member", "pastor", "treasurer", "secretary", "elder"];
const createMemberAndInviteService = async (fullName, email, role, invitedById, organizationId, churchId, largeOrganizationId) => {
    const existingInvite = await db_1.default.query.unregisteredUsers.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.unregisteredUsers.email, email),
    });
    if (existingInvite) {
        throw new Error("User already invited");
    }
    const existingUser = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (existingUser) {
        throw new Error("User already registered");
    }
    const existingMember = await db_1.default.query.members.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.members.email, email),
    });
    if (existingMember) {
        throw new Error("Member already exists");
    }
    const invitationToken = generateCode() + generateCode() + generateCode();
    const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    if (churchId) {
        const membershipNumber = generateMembershipNumber(churchId);
        const memberData = {
            email: email,
            fullName: fullName,
            churchId: churchId,
            organizationId: organizationId || null,
            largeOrganizationId: largeOrganizationId || null,
            membershipNumber: membershipNumber,
            isActive: false,
            isBaptized: false,
            isConfirmed: false,
            isLeader: false,
            role: role,
        };
        await db_1.default.insert(schema_1.members).values(memberData);
    }
    await db_1.default.insert(schema_1.unregisteredUsers).values({
        email,
        fullName,
        role,
        invitationToken,
        tokenExpiresAt,
        invitedById,
        organizationId: organizationId || null,
        churchId: churchId || null,
        largeOrganizationId: largeOrganizationId || null,
    });
    const invitationLink = `${process.env.FRONTEND_URL}/register?token=${invitationToken}`;
    const emailHtml = `
    <h2>Welcome to VineChMS!</h2>
    <p>Hello ${fullName},</p>
    <p>You have been invited to join VineChMS as a <strong>${role}</strong>.</p>
    <p>Your invitation token is:</p>
    <h1 style="color: #1565C0; font-size: 32px; background: #f0f4ff; padding: 15px; border-radius: 8px; text-align: center;">${invitationToken}</h1>
    <p>Click the button below to complete your registration:</p>
    <p style="text-align: center; margin-top: 20px;">
      <a href="${invitationLink}" style="display: inline-block; padding: 12px 24px; background: #1565C0; color: #fff; text-decoration: none; border-radius: 6px;">Complete Registration</a>
    </p>
    <p>Or copy and paste this link in your browser:</p>
    <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">${invitationLink}</p>
    <p><strong>Your token:</strong> ${invitationToken}</p>
    <p>This invitation expires in 7 days.</p>
    <p>VineChMS - Church Management Platform</p>
  `;
    console.log("=======================================");
    console.log(`INVITATION TOKEN FOR ${email}: ${invitationToken}`);
    console.log(`Register Link: ${invitationLink}`);
    console.log("=======================================");
    await (0, mailer_1.sendEmail)(email, "You've Been Invited to VineChMS", `You have been invited to join VineChMS as a ${role}. Your invitation token is: ${invitationToken}. Click the link to register: ${invitationLink}`, emailHtml);
};
exports.createMemberAndInviteService = createMemberAndInviteService;
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
    let organizationId = unregisteredUser.organizationId || null;
    let churchId = unregisteredUser.churchId || null;
    let largeOrganizationId = unregisteredUser.largeOrganizationId || null;
    if (!churchId && (unregisteredUser.role === "church_admin" || unregisteredUser.role === "church_member" || unregisteredUser.role === "pastor" || unregisteredUser.role === "elder" || unregisteredUser.role === "treasurer" || unregisteredUser.role === "secretary")) {
        const churchRecord = await db_1.default.query.churches.findFirst({
            where: (churches) => (0, drizzle_orm_1.eq)(churches.organizationId, organizationId || 0),
        });
        if (churchRecord) {
            churchId = churchRecord.churchId;
        }
    }
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
        organizationId: organizationId,
        churchId: churchId,
        largeOrganizationId: largeOrganizationId,
    };
    let userId;
    if (existingUser && !existingUser.isVerified) {
        await db_1.default
            .update(schema_1.users)
            .set({
            fullName,
            passwordHash,
            verificationCode,
            role: unregisteredUser.role,
            isActive: true,
            organizationId: organizationId,
            churchId: churchId,
            largeOrganizationId: largeOrganizationId,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.userId, existingUser.userId));
        userId = existingUser.userId;
    }
    else {
        const [newUser] = await db_1.default.insert(schema_1.users).values(userData).returning();
        userId = newUser.userId;
    }
    if (churchId) {
        const membershipNumber = generateMembershipNumber(churchId);
        const existingMember = await db_1.default.query.members.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.members.email, email),
        });
        if (existingMember) {
            await db_1.default
                .update(schema_1.members)
                .set({
                userId: userId,
                isActive: true,
                fullName: fullName,
                membershipNumber: membershipNumber,
                membershipDate: new Date(),
                churchId: churchId,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.members.email, email));
        }
        else {
            await db_1.default.insert(schema_1.members).values({
                userId: userId,
                email: email,
                fullName: fullName,
                churchId: churchId,
                organizationId: organizationId,
                largeOrganizationId: largeOrganizationId,
                membershipNumber: membershipNumber,
                isActive: true,
                isBaptized: false,
                isConfirmed: false,
                isLeader: false,
                role: unregisteredUser.role,
                membershipDate: new Date(),
            });
        }
    }
    await db_1.default
        .delete(schema_1.unregisteredUsers)
        .where((0, drizzle_orm_1.eq)(schema_1.unregisteredUsers.unregisteredUserId, unregisteredUser.unregisteredUserId));
    const verificationHtml = `
    <h2>Welcome to VineChMS!</h2>
    <p>Your verification code is:</p>
    <h1 style="color: #1565C0; font-size: 32px; background: #f0f4ff; padding: 15px; border-radius: 8px; text-align: center;">${verificationCode}</h1>
    <p>Enter this code to verify your account.</p>
    <p>VineChMS - Church Management Platform</p>
  `;
    await (0, mailer_1.sendEmail)(email, "Verify Your Account - VineChMS", `Your verification code is ${verificationCode}`, verificationHtml);
};
exports.registerService = registerService;
const verifyService = async (email, code) => {
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.isVerified) {
        throw new Error("Email already verified");
    }
    if (user.verificationCode !== code) {
        throw new Error("Invalid verification code");
    }
    await db_1.default
        .update(schema_1.users)
        .set({ isVerified: true, verificationCode: null })
        .where((0, drizzle_orm_1.eq)(schema_1.users.userId, user.userId));
    if (memberRoles.includes(user.role)) {
        await db_1.default
            .update(schema_1.members)
            .set({ isActive: true })
            .where((0, drizzle_orm_1.eq)(schema_1.members.userId, user.userId));
    }
};
exports.verifyService = verifyService;
const loginService = async (email, password) => {
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (!user) {
        throw new Error("User not registered");
    }
    if (!user.isVerified) {
        throw new Error("Account not verified. Please verify your email before logging in.");
    }
    if (!user.isActive) {
        throw new Error("Account is deactivated");
    }
    const match = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!match) {
        throw new Error("Invalid credentials");
    }
    if (!adminRoles.includes(user.role)) {
        const member = await db_1.default.query.members.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.members.userId, user.userId),
        });
        if (!member || !member.isActive) {
            throw new Error("Member account is not active");
        }
    }
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
    };
};
exports.loginService = loginService;
const refreshUserService = async (userId) => {
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.userId, userId),
    });
    if (!user) {
        throw new Error("User not found");
    }
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
    };
};
exports.refreshUserService = refreshUserService;
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
        .set({
        verificationCode: resetCode,
    })
        .where((0, drizzle_orm_1.eq)(schema_1.users.userId, user.userId));
    const resetHtml = `
    <h2>Password Reset Request</h2>
    <p>Your password reset code is:</p>
    <h1 style="color: #1565C0; font-size: 32px; background: #f0f4ff; padding: 15px; border-radius: 8px; text-align: center;">${resetCode}</h1>
    <p>Enter this code to reset your password.</p>
    <p><strong>Note:</strong> This code expires in 1 hour.</p>
    <p>VineChMS - Church Management Platform</p>
  `;
    await (0, mailer_1.sendEmail)(email, "Password Reset - VineChMS", `Your password reset code is ${resetCode}`, resetHtml);
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
const resetPasswordService = async (email, newPassword) => {
    if (!email)
        throw new Error("Email is required");
    if (!newPassword || newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (!user)
        throw new Error("User not found");
    if (!user.isVerified) {
        throw new Error("Account not verified");
    }
    const passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
    await db_1.default
        .update(schema_1.users)
        .set({
        passwordHash,
        verificationCode: null,
    })
        .where((0, drizzle_orm_1.eq)(schema_1.users.userId, user.userId));
    const resetSuccessHtml = `
    <h2>Password Reset Successful</h2>
    <p>Your password has been successfully reset.</p>
    <p>VineChMS - Church Management Platform</p>
  `;
    await (0, mailer_1.sendEmail)(email, "Password Reset Successful - VineChMS", `Your password has been successfully reset.`, resetSuccessHtml);
};
exports.resetPasswordService = resetPasswordService;
const resendVerificationService = async (email) => {
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.isVerified) {
        throw new Error("Email already verified");
    }
    const verificationCode = generateCode();
    await db_1.default
        .update(schema_1.users)
        .set({ verificationCode })
        .where((0, drizzle_orm_1.eq)(schema_1.users.userId, user.userId));
    const resendHtml = `
    <h2>Resend Verification Code</h2>
    <p>Your new verification code is:</p>
    <h1 style="color: #1565C0; font-size: 32px; background: #f0f4ff; padding: 15px; border-radius: 8px; text-align: center;">${verificationCode}</h1>
    <p>Enter this code to verify your account.</p>
    <p>VineChMS - Church Management Platform</p>
  `;
    await (0, mailer_1.sendEmail)(email, "Resend Verification - VineChMS", `Your new verification code is ${verificationCode}`, resendHtml);
};
exports.resendVerificationService = resendVerificationService;
