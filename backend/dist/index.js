"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = __importDefault(require("./auth/auth.router"));
const initializeApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const allowedOrigins = [
        "https://vinechms.vercel.app",
        "http://localhost:5173",
    ];
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }));
    app.get("/", (_req, res) => {
        res.send("VineChMS Backend server running successfully!");
    });
    // Auth Routes
    app.use("/api/auth", auth_router_1.default);
    return app;
};
const app = initializeApp();
exports.default = app;
