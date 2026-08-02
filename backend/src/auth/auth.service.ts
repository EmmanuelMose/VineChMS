import db from "../Drizzle/db";
import { users } from "../Drizzle/schema";
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

// Register
export const registerService = async (
  fullName: string,
  email: string,
  password: string,
  role: UserRole = "church_member"
) => {
  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser && existingUser.isVerified) {
    throw new Error("User already registered");
  }

  const verificationCode = generateCode();
  const passwordHash = await bcrypt.hash(password, 10);

  if (existingUser && !existingUser.isVerified) {
    // Update existing unverified user
    await db
      .update(users)
      .set({
        fullName,
        passwordHash,
        verificationCode,
        role,
        isActive: true,
      })
      .where(eq(users.userId, existingUser.userId));
  } else {
    // Create new user
    await db.insert(users).values({
      email,
      fullName,
      passwordHash,
      role: role as "church_member" | "super_admin" | "large_org_admin" | "large_org_member" | "small_org_admin" | "small_org_member" | "church_admin" | "pastor" | "elder" | "treasurer" | "secretary",
      verificationCode,
      isVerified: false,
      isActive: true,
    });
  }

  // Send verification email
  await sendEmail(
    email,
    "Verify Your Account - VineChMS",
    `Your verification code is ${verificationCode}`,
    `
    <h2>Welcome to VineChMS!</h2>
    <p>Your verification code is:</p>
    <h1 style="color: #1E3A8A; font-size: 32px;">${verificationCode}</h1>
    <p>Enter this code to verify your account.</p>
    `
  );
};

// Verify Email
export const verifyService = async (email: string, code: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || user.verificationCode !== code) {
    throw new Error("Invalid verification code");
  }

  await db
    .update(users)
    .set({ isVerified: true, verificationCode: null })
    .where(eq(users.userId, user.userId));
};

// Login
export const loginService = async (email: string, password: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) throw new Error("User not registered");
  if (!user.isVerified) throw new Error("Account not verified");
  if (!user.isActive) throw new Error("Account is deactivated");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.userId, role: user.role, email: user.email, fullName: user.fullName },
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
      profilePicture: user.profilePicture,
      phone: user.phone,
      organizationId: user.organizationId,
      churchId: user.churchId,
      largeOrganizationId: user.largeOrganizationId,
    },
  };
};

// Forgot Password
export const forgotPasswordService = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !user.isVerified) {
    throw new Error("User not found or not verified");
  }

  const resetCode = generateCode();

  await db
    .update(users)
    .set({ verificationCode: resetCode })
    .where(eq(users.userId, user.userId));

  await sendEmail(
    email,
    "Password Reset - VineChMS",
    `Your password reset code is ${resetCode}`,
    `
    <h2>Password Reset Request</h2>
    <p>Your password reset code is:</p>
    <h1 style="color: #1E3A8A; font-size: 32px;">${resetCode}</h1>
    <p>This code expires in 1 hour.</p>
    `
  );
};

// Verify Reset Code
export const verifyResetCodeService = async (email: string, code: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || user.verificationCode !== code) {
    throw new Error("Invalid reset code");
  }
};

// Reset Password
export const resetPasswordService = async (email: string, password: string) => {
  if (!email) throw new Error("Email is required");

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) throw new Error("User not found");

  const passwordHash = await bcrypt.hash(password, 10);

  await db
    .update(users)
    .set({
      passwordHash,
      verificationCode: null,
    })
    .where(eq(users.userId, user.userId));
};