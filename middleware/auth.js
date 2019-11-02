const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/error-response");
const User = require("../models/User");

//protected routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
  }
});
