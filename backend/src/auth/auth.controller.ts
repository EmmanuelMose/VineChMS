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
} from "./auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

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
    const user = req.user;
    res.json({
      success: true,
      data: {
        userId: user!.userId,
        email: user!.email,
        fullName: user!.fullName,
        role: user!.role,
        churchId: user!.churchId,
        organizationId: user!.organizationId,
        largeOrganizationId: user!.largeOrganizationId,
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};