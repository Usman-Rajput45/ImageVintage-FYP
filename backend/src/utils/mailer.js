const nodemailer = require("nodemailer");
const env = require("../config/env");
const logger = require("./logger");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    // No SMTP configured — this is fine for local dev/FYP demo. Callers should
    // catch the rejection and fall back to logging the link instead (see auth.service.js).
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });

  return transporter;
};

// FR-14: password reset email with a 1-hour-valid link
const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  const activeTransporter = getTransporter();

  if (!activeTransporter) {
    throw new Error("SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing in .env)");
  }

  await activeTransporter.sendMail({
    from: env.smtp.from,
    to: toEmail,
    subject: "Reset your VisionTag password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your VisionTag account password. This link is valid for 1 hour.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#4338ca;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  logger.info(`Password reset email sent to ${toEmail}`);
};

module.exports = { sendPasswordResetEmail };
