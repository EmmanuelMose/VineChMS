// File: backend/src/chatbot/chatbot.router.ts

import { Router } from "express";
import { handleChat } from "./chatbot.controller";

const chatbotRouter = Router();

chatbotRouter.post("/chat", handleChat);

export default chatbotRouter;