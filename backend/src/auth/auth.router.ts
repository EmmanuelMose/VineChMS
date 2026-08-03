import { Router } from "express";
import {
  registerController,
  verifyController,
  loginController,
  forgotPasswordController,
  verifyResetCodeController,
  resetPasswordController,
  getCurrentUserController,
  createUnregisteredUserController,
} from "./auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/verify", verifyController);
authRouter.post("/login", loginController);
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/verify-reset-code", verifyResetCodeController);
authRouter.post("/reset-password", resetPasswordController);
authRouter.get("/me", authenticate, getCurrentUserController);
authRouter.post("/invite", authenticate, createUnregisteredUserController);

export default authRouter;