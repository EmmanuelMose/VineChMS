"use strict";
// File: backend/src/mpesa/mpesa.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryMpesaStatus = exports.initiateStkPush = exports.getMpesaAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_SHORT_CODE = process.env.MPESA_SHORT_CODE;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;
const MPESA_ENVIRONMENT = process.env.MPESA_ENVIRONMENT;
let accessToken = null;
let tokenExpiry = null;
const getMpesaAccessToken = async () => {
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return accessToken;
    }
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");
    const url = MPESA_ENVIRONMENT === "sandbox"
        ? "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        : "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const response = await axios_1.default.get(url, {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in || 3600) * 1000;
    return accessToken;
};
exports.getMpesaAccessToken = getMpesaAccessToken;
const initiateStkPush = async (phoneNumber, amount, accountReference, transactionDesc = "Church Payment") => {
    phoneNumber = phoneNumber.replace(/\D/g, "");
    if (phoneNumber.startsWith("0")) {
        phoneNumber = "254" + phoneNumber.slice(1);
    }
    else if (!phoneNumber.startsWith("254")) {
        phoneNumber = "254" + phoneNumber;
    }
    const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORT_CODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");
    const url = MPESA_ENVIRONMENT === "sandbox"
        ? "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        : "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const token = await (0, exports.getMpesaAccessToken)();
    const requestBody = {
        BusinessShortCode: MPESA_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: MPESA_SHORT_CODE,
        PhoneNumber: phoneNumber,
        CallBackURL: MPESA_CALLBACK_URL,
        AccountReference: accountReference.slice(0, 12),
        TransactionDesc: transactionDesc.slice(0, 13),
    };
    const response = await axios_1.default.post(url, requestBody, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
exports.initiateStkPush = initiateStkPush;
const queryMpesaStatus = async (checkoutRequestID) => {
    const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORT_CODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");
    const url = MPESA_ENVIRONMENT === "sandbox"
        ? "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
        : "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query";
    const token = await (0, exports.getMpesaAccessToken)();
    const requestBody = {
        BusinessShortCode: MPESA_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
    };
    const response = await axios_1.default.post(url, requestBody, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
exports.queryMpesaStatus = queryMpesaStatus;
