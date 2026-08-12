import { Request, Response } from "express";
import {
  registerService,
  verifyService,
  loginService,
  forgotPasswordService,
  verifyResetCodeService,
  resetPasswordService,
  resendVerificationService,
  createMemberAndInviteService,
  refreshUserService,
} from "./auth.service";
import { AuthRequest } from "../middleware/auth.middleware";
import db from "../Drizzle/db";
import { users } from "../Drizzle/schema";
import { eq } from "drizzle-orm";

export const createMemberAndInviteController = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, email, role, organizationId, churchId, largeOrganizationId } = req.body;
    const invitedById = req.user!.userId;

    if (!fullName || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "fullName, email, and role are required",
      });
    }

    await createMemberAndInviteService(
      fullName,
      email,
      role,
      invitedById,
      organizationId,
      churchId,
      largeOrganizationId
    );

    res.json({
      success: true,
      message: `Member created and invitation sent to ${email} for role: ${role}`,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const registerController = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, invitationToken } = req.body;

    if (!fullName || !email || !password || !invitationToken) {
      return res.status(400).json({
        success: false,
        message: "fullName, email, password, and invitationToken are required",
      });
    }

    await registerService(fullName, email, password, invitationToken);
    res.json({ success: true, message: "Verification code sent to your email" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyController = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "email and code are required",
      });
    }

    await verifyService(email, code);
    res.json({ success: true, message: "Email verified successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    const data = await loginService(email, password);
    res.json({ success: true, ...data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }

    await forgotPasswordService(email);
    res.json({ success: true, message: "Reset code sent to your email" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyResetCodeController = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "email and code are required",
      });
    }

    await verifyResetCodeService(email, code);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
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

    await resetPasswordService(email, newPassword);
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resendVerificationController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }

    await resendVerificationService(email);
    res.json({ success: true, message: "Verification code resent to your email" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCurrentUserController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await db.query.users.findFirst({
      where: eq(users.userId, userId),
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
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const refreshUserController = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await refreshUserService(user.userId);
    res.json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};