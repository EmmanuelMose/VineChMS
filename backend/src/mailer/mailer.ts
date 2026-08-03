import nodemailer from "nodemailer";

export const sendEmail = async (
  email: string,
  subject: string,
  message: string,
  html?: string
): Promise<boolean> => {
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

    const transporter = nodemailer.createTransport({
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
  } catch (error: any) {
    console.error("Email send failed:", error.message);
    if (process.env.NODE_ENV === "development") {
      console.log("Continuing in development mode");
      return true;
    }
    throw new Error("Failed to send email: " + error.message);
  }
};