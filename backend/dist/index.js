"use strict";
// File: backend/src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = __importDefault(require("./auth/auth.router"));
const organizations_router_1 = __importDefault(require("./organizations/organizations.router"));
const churches_router_1 = __importDefault(require("./churches/churches.router"));
const members_router_1 = __importDefault(require("./members/members.router"));
const positions_router_1 = __importDefault(require("./positions/positions.router"));
const departments_router_1 = __importDefault(require("./departments/departments.router"));
const leaders_router_1 = __importDefault(require("./leaders/leaders.router"));
const services_router_1 = __importDefault(require("./services/services.router"));
const attendance_router_1 = __importDefault(require("./attendance/attendance.router"));
const giving_router_1 = __importDefault(require("./giving/giving.router"));
const expenses_router_1 = __importDefault(require("./expenses/expenses.router"));
const events_router_1 = __importDefault(require("./events/events.router"));
const prayer_router_1 = __importDefault(require("./prayer/prayer.router"));
const announcements_router_1 = __importDefault(require("./announcements/announcements.router"));
const groups_router_1 = __importDefault(require("./groups/groups.router"));
const sermons_router_1 = __importDefault(require("./sermons/sermons.router"));
const visitors_router_1 = __importDefault(require("./visitors/visitors.router"));
const invitations_router_1 = __importDefault(require("./invitations/invitations.router"));
const pledges_router_1 = __importDefault(require("./pledges/pledges.router"));
const budgets_router_1 = __importDefault(require("./budgets/budgets.router"));
const audit_logs_router_1 = __importDefault(require("./audit-logs/audit-logs.router"));
const documents_router_1 = __importDefault(require("./documents/documents.router"));
const cloudinary_router_1 = __importDefault(require("./cloudinary/cloudinary.router"));
const mpesa_router_1 = __importDefault(require("./mpesa/mpesa.router"));
const chatbot_router_1 = __importDefault(require("./chatbot/chatbot.router"));
const initializeApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const allowedOrigins = [
        "http://localhost:5173",
        "https://vinechms.vercel.app",
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
    app.use("/api/auth", auth_router_1.default);
    app.use("/api/organizations", organizations_router_1.default);
    app.use("/api/churches", churches_router_1.default);
    app.use("/api/members", members_router_1.default);
    app.use("/api/positions", positions_router_1.default);
    app.use("/api/departments", departments_router_1.default);
    app.use("/api/leaders", leaders_router_1.default);
    app.use("/api/services", services_router_1.default);
    app.use("/api/attendance", attendance_router_1.default);
    app.use("/api/giving", giving_router_1.default);
    app.use("/api/expenses", expenses_router_1.default);
    app.use("/api/events", events_router_1.default);
    app.use("/api/prayer", prayer_router_1.default);
    app.use("/api/announcements", announcements_router_1.default);
    app.use("/api/groups", groups_router_1.default);
    app.use("/api/sermons", sermons_router_1.default);
    app.use("/api/visitors", visitors_router_1.default);
    app.use("/api/invitations", invitations_router_1.default);
    app.use("/api/pledges", pledges_router_1.default);
    app.use("/api/budgets", budgets_router_1.default);
    app.use("/api/audit-logs", audit_logs_router_1.default);
    app.use("/api/documents", documents_router_1.default);
    app.use("/api/cloudinary", cloudinary_router_1.default);
    app.use("/api/mpesa", mpesa_router_1.default);
    app.use("/api/chatbot", chatbot_router_1.default);
    return app;
};
const app = initializeApp();
exports.default = app;
