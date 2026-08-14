"use strict";
// File: backend/src/mpesa/mpesa.router.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mpesa_controller_1 = require("./mpesa.controller");
const mpesaRouter = (0, express_1.Router)();
mpesaRouter.post("/callback", mpesa_controller_1.mpesaCallback);
mpesaRouter.get("/status/:checkoutRequestID", mpesa_controller_1.queryMpesaStatusController);
exports.default = mpesaRouter;
