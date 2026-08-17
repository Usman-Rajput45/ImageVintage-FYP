const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// FR-02 / FR-03: only JPG/PNG, max 10MB (configurable via MAX_UPLOAD_MB)
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${Date.now()}-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(400, "Only JPG and PNG image files are supported."));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
});

// Wraps multer's single-file upload so oversized/invalid files return our
// standard JSON error shape instead of multer's raw error.
const uploadSingleImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new ApiError(400, `Image must be under ${env.maxUploadMb}MB.`));
      }
      return next(new ApiError(400, err.message));
    }
    if (err) return next(err);

    if (!req.file) {
      return next(new ApiError(400, "No image file was uploaded."));
    }
    next();
  });
};

module.exports = { uploadSingleImage, UPLOAD_DIR };
