import nodemailer from "nodemailer";
import { config } from "dotenv";
import { Logger } from "./logger";

config();

const { MAILGUN_USER, MAILGUN_PASSWORD, MAILGUN_FROM, MAIL_TO } = process.env;

// create transporter with mailgun credentials
const transporter = nodemailer.createTransport({
  service: "Mailgun",
  auth: {
    user: MAILGUN_USER,
    pass: MAILGUN_PASSWORD,
  },
});

const mailOpts = {
  from: MAILGUN_FROM,
};

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      ...mailOpts,
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (err) {
    console.error(err);
  }
}

const warningLogger = new Logger({
  log_type: "warning",
});

export const sendWarningEmail = async (message: string) => {
  try {
    const { NODE_ENV } = process.env;
    if (NODE_ENV === "development") {
      console.log("Warning email not sent in development mode");
      return;
    }
    const info = await sendEmail({
      to: MAIL_TO,
      subject: "Warning from Onyx Chat",
      html: `
        <h2 style="color:red">Warning From Onyx Chat:</h2>
        <p>${message}</p>
      `,
    });
    if (info) {
      warningLogger.log("Warning email dispatched");
    }
    return info;
  } catch (err) {
    console.error(err);
  }
};
