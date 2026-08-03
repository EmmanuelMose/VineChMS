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

  await db
    .delete(unregisteredUsers)
    .where(eq(unregisteredUsers.unregisteredUserId, unregisteredUser.unregisteredUserId));

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

  if (!user || user.verificationCode !== code) {
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

  if (!user) throw new Error("User not registered");
  if (!user.isVerified) throw new Error("Account not verified");
  if (!user.isActive) throw new Error("Account is deactivated");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("Invalid credentials");

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
    <h2 style="color: #2E7D32;">Password Reset Request</h2>
    <p>Your password reset code is:</p>
    <h1 style="color: #1565C0; font-size: 32px;">${resetCode}</h1>
    <p>This code expires in 1 hour.</p>
    <p style="color: #FFC107;">VineChMS - Church Management Platform</p>
    `
  );
};

export const verifyResetCodeService = async (email: string, code: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || user.verificationCode !== code) {
    throw new Error("Invalid reset code");
  }
};

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