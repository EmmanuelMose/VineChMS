import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRouter from "./auth/auth.router";

const initializeApp = () => {
  const app = express();

  app.use(express.json());

  const allowedOrigins = [
    "https://vinechms.vercel.app",
    "http://localhost:5173",
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

  // Auth Routes
  app.use("/api/auth", authRouter);

  return app;
};

const app: express.Express = initializeApp();
export default app;