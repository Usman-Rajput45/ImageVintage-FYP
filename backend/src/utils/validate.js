const ApiError = require("./ApiError");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmail = (value) => typeof value === "string" && EMAIL_REGEX.test(value.trim());

/**
 * Lightweight, dependency-free request body validator.
 * `rules` is a map of fieldName -> array of validator functions.
 * Each validator returns an error string (or null/undefined if valid).
 */
const validateBody = (rules) => (req, res, next) => {
  const errors = {};

  Object.entries(rules).forEach(([field, validators]) => {
    for (const validate of validators) {
      const error = validate(req.body[field], req.body);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  next();
};

// Reusable validator factories
const required = (label) => (value) => (value === undefined || value === null || value === "" ? `${label} is required.` : null);
const minLength = (n, label) => (value) => (value && value.length < n ? `${label} must be at least ${n} characters.` : null);
const email = () => (value) => (value && !isEmail(value) ? "Please provide a valid email address." : null);

module.exports = { validateBody, required, minLength, email, isEmail };
