const User = require("../models/User");
const ErrorResponse = require("../utils/error-response");
const asyncHandler = require("express-async-handler");

//api/v1/auth/register
//public

exports.register = asyncHandler(async (req, res, next) => {
  const {
    body: { name, email, password, role }
  } = req;

  //create user
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  const token = user.getSignedJwtToken();

  res.json({ success: true, token });
});

//api/v1/auth/login
//public

exports.login = asyncHandler(async (req, res, next) => {
  const {
    body: { email, password }
  } = req;

  //validate password and email
  if (!email || !password) {
    return next(new ErrorResponse("Please add password and email", 400));
  }

  //check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credential", 401));
  }

  //check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credential", 401));
  }

  sendTokenResponse(user, 200, res);
});

//get token from model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
