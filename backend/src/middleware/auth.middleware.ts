import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    fullName: string;
    role: string;
    churchId?: number;
    organizationId?: number;
    largeOrganizationId?: number;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("📨 Auth header received:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("⚠️ No Bearer token found");
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔑 Token extracted:", token?.substring(0, 20) + "...");

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
        fullName: string;
        role: string;
        churchId?: number;
        organizationId?: number;
        largeOrganizationId?: number;
      };
      console.log("✅ Token verified for user:", decoded.userId, decoded.role);
      req.user = decoded;
      next();
    } catch (jwtError: any) {
      console.error("❌ JWT verification failed:", jwtError.name, jwtError.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error("❌ Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions",
      });
    }

    next();
  };
};