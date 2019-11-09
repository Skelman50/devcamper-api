const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/error-response");
const User = require("../models/User");

//protected routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  //Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Unathorization", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse("Unathorization", 401));
  }
});

//Grant access to specific role

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User role ${req.user.role} is unathorized to access this route`,
        403
      )
    );
  }
  next();
};
