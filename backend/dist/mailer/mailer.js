"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (email, subject, message, html) => {
    try {
        console.log(`Sending email to: ${email}`);
        console.log(`Subject: ${subject}`);
        if (html) {
            const tokenMatch = html.match(/[0-9]{18}/);
            if (tokenMatch) {
                console.log(`Token in email: ${tokenMatch[0]}`);
            }
        }
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            if (process.env.NODE_ENV === "development") {
                console.log("Email credentials not configured, but continuing in development mode");
                return true;
            }
            throw new Error("Email credentials not configured");
        }
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
        console.log(`Email sent successfully to ${email}`);
        return true;
    }
    catch (error) {
        console.error("Email send failed:", error.message);
        if (process.env.NODE_ENV === "development") {
            console.log("Continuing in development mode");
            return true;
        }
        throw new Error("Failed to send email: " + error.message);
    }
};
exports.sendEmail = sendEmail;
