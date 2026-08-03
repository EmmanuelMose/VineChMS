import db from "../Drizzle/db";
import { users, unregisteredUsers } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../mailer/mailer";

export type UserRole =
  | "church_member"
  | "super_admin"
  | "large_org_admin"
  | "large_org_member"
  | "small_org_admin"
  | "small_org_member"
  | "church_admin"
  | "pastor"
  | "elder"
  | "treasurer"
  | "secretary";

const JWT_SECRET = process.env.JWT_SECRET!;

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const registerService = async (
  fullName: string,
  email: string,
  password: string
) => {
  const unregisteredUser = await db.query.unregisteredUsers.findFirst({
    where: eq(unregisteredUsers.email, email),
  });

  if (!unregisteredUser) {
    throw new Error("You are not authorized to register. Please contact your administrator.");
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser && existingUser.isVerified) {
    throw new Error("User already registered");
  }

  const verificationCode = generateCode();
  const passwordHash = await bcrypt.hash(password, 10);

  const userData: any = {
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
    await db
      .update(users)
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
      .where(eq(users.userId, existingUser.userId));
  } else {
    await db.insert(users).values(userData);
  }

  await sendEmail(
    email,
    "Verify Your Account - VineChMS",
    `Your verification code is ${verificationCode}`,
    `
    <h2 style="color: #2E7D32;">Welcome to VineChMS!</h2>
    <p>Your verification code is:</p>
    <h1 style="color: #1565C0; font-size: 32px;">${verificationCode}</h1>
    <p>Enter this code to verify your account.</p>
    <p style="color: #FFC107;">VineChMS - Church Management Platform</p>
    `
  );
};

export const verifyService = async (email: string, code: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
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

  await db
    .update(users)
    .set({ isVerified: true, verificationCode: null })
    .where(eq(users.userId, user.userId));
};

export const loginService = async (email: string, password: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
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

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user.userId,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
      churchId: user.churchId,
      organizationId: user.organizationId,
      largeOrganizationId: user.largeOrganizationId,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

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

export const forgotPasswordService = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isVerified) {
    throw new Error("Account not verified");
  }

  const resetCode = generateCode();

  await db
    .update(users)
    .set({
      verificationCode: resetCode,
    })
    .where(eq(users.userId, user.userId));

  await sendEmail(
    email,
    "Password Reset - VineChMS",
    `Your password reset code is ${resetCode}`,
    `
    <h2 style="color: #2E7D32;">Password Reset Request</h2>
    <p>We received a request to reset your password.</p>
    <p>Your password reset code is:</p>
    <h1 style="color: #1565C0; font-size: 32px;">${resetCode}</h1>
    <p>Enter this code to reset your password.</p>
    <p><strong>Note:</strong> This code expires in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <p style="color: #FFC107;">VineChMS - Church Management Platform</p>
    `
  );
};

export const verifyResetCodeService = async (email: string, code: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isVerified) {
    throw new Error("Account not verified");
  }

  if (user.verificationCode !== code) {
    throw new Error("Invalid reset code");
  }
};

export const resetPasswordService = async (email: string, newPassword: string) => {
  if (!email) throw new Error("Email is required");
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) throw new Error("User not found");

  if (!user.isVerified) {
    throw new Error("Account not verified");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db
    .update(users)
    .set({
      passwordHash,
      verificationCode: null,
    })
    .where(eq(users.userId, user.userId));

  await sendEmail(
    email,
    "Password Reset Successful - VineChMS",
    `Your password has been successfully reset.`,
    `
    <h2 style="color: #2E7D32;">Password Reset Successful</h2>
    <p>Your password has been successfully reset.</p>
    <p>If you didn't perform this action, please contact support immediately.</p>
    <p style="color: #FFC107;">VineChMS - Church Management Platform</p>
    `
  );
};

export const resendVerificationService = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email already verified");
  }

  const verificationCode = generateCode();

  await db
    .update(users)
    .set({ verificationCode })
    .where(eq(users.userId, user.userId));

  await sendEmail(
    email,
    "Resend Verification - VineChMS",
    `Your new verification code is ${verificationCode}`,
    `
    <h2 style="color: #2E7D32;">Resend Verification Code</h2>
    <p>Your new verification code is:</p>
    <h1 style="color: #1565C0; font-size: 32px;">${verificationCode}</h1>
    <p>Enter this code to verify your account.</p>
    <p style="color: #FFC107;">VineChMS - Church Management Platform</p>
    `
  );
};