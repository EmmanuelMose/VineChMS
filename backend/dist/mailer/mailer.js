"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (email, subject, message, html) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: `"VineChMS" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            text: message,
            html: html || message,
        };
        const info = await transporter.sendMail(mailOptions);
        if (!info.accepted || info.accepted.length === 0) {
            throw new Error("Email not accepted by SMTP server");
        }
        return true;
    }
    catch (error) {
        throw new Error("Failed to send email: " + error.message);
    }
};
exports.sendEmail = sendEmail;
