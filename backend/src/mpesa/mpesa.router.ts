import { Router } from "express";
import { mpesaCallback } from "./mpesa.controller";

const mpesaRouter = Router();

mpesaRouter.post("/callback", mpesaCallback);

export default mpesaRouter;