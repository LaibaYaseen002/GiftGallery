import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn(
    "Warning: RESEND_API_KEY not set. Email features will not work."
  );
}

export const resend = new Resend(resendApiKey || "");
