import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRouter from "./auth/auth.router";
import organizationsRouter from "./organizations/organizations.router";
import churchesRouter from "./churches/churches.router";
import membersRouter from "./members/members.router";
import positionsRouter from "./positions/positions.router";
import departmentsRouter from "./departments/departments.router";
import leadersRouter from "./leaders/leaders.router";
import servicesRouter from "./services/services.router";
import attendanceRouter from "./attendance/attendance.router";
import givingRouter from "./giving/giving.router";
import expensesRouter from "./expenses/expenses.router";
import eventsRouter from "./events/events.router";
import prayerRouter from "./prayer/prayer.router";
import announcementsRouter from "./announcements/announcements.router";
import groupsRouter from "./groups/groups.router";
import sermonsRouter from "./sermons/sermons.router";
import visitorsRouter from "./visitors/visitors.router";
import invitationsRouter from "./invitations/invitations.router";
import pledgesRouter from "./pledges/pledges.router";
import budgetsRouter from "./budgets/budgets.router";
import auditLogsRouter from "./audit-logs/audit-logs.router";
import documentsRouter from "./documents/documents.router";
import cloudinaryRouter from "./cloudinary/cloudinary.router";
import mpesaRouter from "./mpesa/mpesa.router";

const initializeApp = () => {
  const app = express();

  app.use(express.json());

  const allowedOrigins = [
    "http://localhost:5173",
    "https://vinechms.vercel.app",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  app.get("/", (_req, res) => {
    res.send("VineChMS Backend server running successfully!");
  });

  app.use("/api/auth", authRouter);
  app.use("/api/organizations", organizationsRouter);
  app.use("/api/churches", churchesRouter);
  app.use("/api/members", membersRouter);
  app.use("/api/positions", positionsRouter);
  app.use("/api/departments", departmentsRouter);
  app.use("/api/leaders", leadersRouter);
  app.use("/api/services", servicesRouter);
  app.use("/api/attendance", attendanceRouter);
  app.use("/api/giving", givingRouter);
  app.use("/api/expenses", expensesRouter);
  app.use("/api/events", eventsRouter);
  app.use("/api/prayer", prayerRouter);
  app.use("/api/announcements", announcementsRouter);
  app.use("/api/groups", groupsRouter);
  app.use("/api/sermons", sermonsRouter);
  app.use("/api/visitors", visitorsRouter);
  app.use("/api/invitations", invitationsRouter);
  app.use("/api/pledges", pledgesRouter);
  app.use("/api/budgets", budgetsRouter);
  app.use("/api/audit-logs", auditLogsRouter);
  app.use("/api/documents", documentsRouter);
  app.use("/api/cloudinary", cloudinaryRouter);
  app.use("/api/mpesa", mpesaRouter);

  return app;
};

const app: express.Express = initializeApp();
export default app;