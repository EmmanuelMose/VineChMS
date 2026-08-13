// File: backend/src/mpesa/mpesa.router.ts

import { Router } from "express";
import { mpesaCallback, queryMpesaStatusController } from "./mpesa.controller";

const mpesaRouter = Router();

mpesaRouter.post("/callback", mpesaCallback);
mpesaRouter.get("/status/:checkoutRequestID", queryMpesaStatusController);

export default mpesaRouter;