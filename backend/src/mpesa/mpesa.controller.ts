import { Request, Response } from "express";
import { updateGivingStatusFromMpesa } from "../giving/giving.service";

export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    const { Body } = req.body;
    if (!Body || !Body.stkCallback) {
      return res.status(400).json({ success: false, message: "Invalid callback" });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;

    let status = "failed";
    if (ResultCode === 0) status = "completed";

    await updateGivingStatusFromMpesa(CheckoutRequestID, status, ResultDesc);

    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    res.status(200).json({ ResultCode: 1, ResultDesc: "Internal error" });
  }
};