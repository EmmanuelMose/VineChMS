"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(" Auth header received:", authHeader);
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.warn("No Bearer token found");
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }
        const token = authHeader.split(" ")[1];
        console.log("Token extracted:", token?.substring(0, 20) + "...");
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            console.log(" Token verified for user:", decoded.userId, decoded.role);
            req.user = decoded;
            next();
        }
        catch (jwtError) {
            console.error(" JWT verification failed:", jwtError.name, jwtError.message);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
    }
    catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
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
exports.authorize = authorize;
