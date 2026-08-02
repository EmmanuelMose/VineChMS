import { Request, Response } from "express";
import {
  registerService,
  verifyService,
  loginService,
  forgotPasswordService,
  verifyResetCodeService,
  resetPasswordService,
} from "./auth.service";

// Register
export const registerController = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role } = req.body;
    await registerService(fullName, email, password, role);
    res.json({ success: true, message: "Verification code sent to your email" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Verify Email
export const verifyController = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    await verifyService(email, code);
    res.json({ success: true, message: "Email verified successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    res.json({ success: true, ...data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Forgot Password
export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    await forgotPasswordService(req.body.email);
    res.json({ success: true, message: "Reset code sent to your email" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Verify Reset Code
export const verifyResetCodeController = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    await verifyResetCodeService(email, code);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Reset Password
export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    await resetPasswordService(email, password);
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get Current User
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
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};