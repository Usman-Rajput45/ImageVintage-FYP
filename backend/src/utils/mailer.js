const nodemailer = require("nodemailer");
const env = require("../config/env");
const logger = require("./logger");

let transporter = null;

const createTransporter = () => {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    requireTLS: env.smtp.port !== 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    tls: env.nodeEnv !== "production"
      ? { rejectUnauthorized: false }
      : undefined,
  });
};

const getTransporter = async () => {
  if (transporter) return transporter;

  transporter = createTransporter();
  if (!transporter) return null;

  try {
    await transporter.verify();
  } catch (error) {
    logger.error(`SMTP transporter verification failed: ${error.message}`);
    transporter = null;
    return null;
  }

  return transporter;
};

const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  const activeTransporter = await getTransporter();

  if (!activeTransporter) {
    throw new Error(
      "SMTP transporter could not be initialized. Check SMTP_HOST/SMTP_USER/SMTP_PASS in .env and review logs/error.log for details."
    );
  }

  try {
    await activeTransporter.sendMail({
      from: env.smtp.from,
      to: toEmail,
      replyTo: env.smtp.user,
      subject: "Reset your VisionTag password",
      headers: {
        "List-Unsubscribe": `<mailto:${env.smtp.user}?subject=unsubscribe>`,
        "X-Mailer": "VisionTag-Mailer/1.0",
      },
      text: `Reset your password\n\nWe received a request to reset your VisionTag account password. Copy and paste the link below into your browser:\n\n${resetUrl}\n\nThis link is valid for 1 hour. If you didn't request this, you can safely ignore this email.`,
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
  } catch (error) {
    transporter = null;
    throw error;
  }

  logger.info(`Password reset email sent to ${toEmail}`);
};

module.exports = { sendPasswordResetEmail };
