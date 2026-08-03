import { Request, Response } from "express";
import {
  registerService,
  verifyService,
  loginService,
  forgotPasswordService,
  verifyResetCodeService,
  resetPasswordService,
  resendVerificationService,
} from "./auth.service";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    await registerService(fullName, email, password);
    res.json({ success: true, message: "Verification code sent to your email" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyController = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    await verifyService(email, code);
    res.json({ success: true, message: "Email verified successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    res.json({ success: true, ...data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    res.json({ success: true, message: "Password reset code sent to your email" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyResetCodeController = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    await verifyResetCodeService(email, code);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    await resetPasswordService(email, newPassword);
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resendVerificationController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await resendVerificationService(email);
    res.json({ success: true, message: "Verification code resent to your email" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCurrentUserController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
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
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};