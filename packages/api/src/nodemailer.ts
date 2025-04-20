import { TRPCError } from "@trpc/server";
import type { SendMailOptions } from "nodemailer";
import { createTransport } from "nodemailer";

export async function sendMail(options: SendMailOptions) {
  try {
    const transporter = createTransport({
      service: "gmail",
      // host: "smtp.ethereal.email",
      // port: 587,
      auth: {
        // user: "joana.jaskolski@ethereal.email",
        // pass: '8N8FqVyU9rj2WNkUB2',
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    const message: SendMailOptions = {
      from: process.env.NODE_MAILER_EMAIL,
      to: options.to,
      subject: options.subject,
      text: options.text,
    };

    const sentMail = await transporter.sendMail(message);
    return sentMail;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Nodemailer error",
    });
  }
}
