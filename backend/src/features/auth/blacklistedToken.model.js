const mongoose = require("mongoose");

/**
 * FR-13 / UC-09: "JWT/session is invalidated client- and server-side."
 * JWTs are stateless by design, so to truly invalidate one server-side on logout
 * we record it here until its natural expiry. The TTL index automatically removes
 * the document once the token would have expired anyway — no manual cleanup job needed.
 */
const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
