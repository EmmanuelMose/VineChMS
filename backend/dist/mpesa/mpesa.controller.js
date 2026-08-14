"use strict";
// File: backend/src/mpesa/mpesa.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryMpesaStatusController = exports.mpesaCallback = void 0;
const expenses_service_1 = require("../expenses/expenses.service");
const giving_service_1 = require("../giving/giving.service");
const mpesa_service_1 = require("./mpesa.service");
const mpesaCallback = async (req, res) => {
    try {
        const { Body } = req.body;
        if (!Body || !Body.stkCallback) {
            return res.status(400).json({ success: false, message: "Invalid callback" });
        }
        const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;
        let status = "failed";
        if (ResultCode === 0)
            status = "completed";
        const givingResult = await (0, giving_service_1.updateGivingStatusFromMpesa)(CheckoutRequestID, status, ResultDesc);
        if (!givingResult) {
            await (0, expenses_service_1.updateExpenseStatusFromMpesa)(CheckoutRequestID, status, ResultDesc);
        }
        res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
    }
    catch (error) {
        console.error("M-Pesa callback error:", error);
        res.status(200).json({ ResultCode: 1, ResultDesc: "Internal error" });
    }
};
exports.mpesaCallback = mpesaCallback;
const queryMpesaStatusController = async (req, res) => {
    try {
        const { checkoutRequestID } = req.params;
        if (!checkoutRequestID) {
            return res.status(400).json({ success: false, message: "CheckoutRequestID is required" });
        }
        const result = await (0, mpesa_service_1.queryMpesaStatus)(checkoutRequestID);
        res.json({
            success: true,
            data: result,
            message: "M-Pesa status queried successfully"
        });
    }
    catch (error) {
        console.error("M-Pesa query error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to query M-Pesa status"
        });
    }
};
exports.queryMpesaStatusController = queryMpesaStatusController;
