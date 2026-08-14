"use strict";
// File: backend/src/chatbot/chatbot.router.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatbot_controller_1 = require("./chatbot.controller");
const chatbotRouter = (0, express_1.Router)();
chatbotRouter.post("/chat", chatbot_controller_1.handleChat);
exports.default = chatbotRouter;
