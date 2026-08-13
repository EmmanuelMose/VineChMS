// File: backend/src/mpesa/mpesa.controller.ts

import { Request, Response } from "express";
import { updateExpenseStatusFromMpesa } from "../expenses/expenses.service";
import { updateGivingStatusFromMpesa } from "../giving/giving.service";
import { queryMpesaStatus } from "./mpesa.service";

export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    const { Body } = req.body;
    if (!Body || !Body.stkCallback) {
      return res.status(400).json({ success: false, message: "Invalid callback" });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;

    let status = "failed";
    if (ResultCode === 0) status = "completed";

    const givingResult = await updateGivingStatusFromMpesa(CheckoutRequestID, status, ResultDesc);
    
    if (!givingResult) {
      await updateExpenseStatusFromMpesa(CheckoutRequestID, status, ResultDesc);
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    res.status(200).json({ ResultCode: 1, ResultDesc: "Internal error" });
  }
};

export const queryMpesaStatusController = async (req: Request, res: Response) => {
  try {
    const { checkoutRequestID } = req.params;
    
    if (!checkoutRequestID) {
      return res.status(400).json({ success: false, message: "CheckoutRequestID is required" });
    }

    const result = await queryMpesaStatus(checkoutRequestID);
    
    res.json({
      success: true,
      data: result,
      message: "M-Pesa status queried successfully"
    });
  } catch (error: any) {
    console.error("M-Pesa query error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to query M-Pesa status"
    });
  }
};