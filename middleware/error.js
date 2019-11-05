const Errorresponse = require("../utils/error-response");

exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(err);
  if (err.name === "CastError") {
    error = new Errorresponse("Resource not found", 404);
  }

  if (err.code === 11000) {
    error = new Errorresponse("Duplicate field", 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors);
    error = new Errorresponse(message, 400);
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server error" });
};
