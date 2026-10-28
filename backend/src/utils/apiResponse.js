/**
 * Every success response looks like: { success: true, message, data }
 * This matches what the VisionTag frontend expects (response.data?.data ?? response.data).
 */
const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

module.exports = { sendSuccess };
