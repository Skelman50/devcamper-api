const crypto = require("crypto");

const User = require("../models/User");
const ErrorResponse = require("../utils/error-response");
const asyncHandler = require("express-async-handler");

const { sendEmail } = require("../utils/send-mail");

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

//api/v1/auth/me
//Private
//GET
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, data: user });
});

//api/v1/auth/updatedetails
//Private
//PUT
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, data: user });
});

//api/v1/auth/updatepassword
//Private
//PUT
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

//api/v1/auth/forgotpassword
//Private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  //get reset token
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //create reset url
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Please make a PUT request to: \n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message
    });
    res.json({ success: true, data: "Email sent" });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

//PUT
//api/v1/auth/resetpassword:resettoken
//Private

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 401));
  }

  //set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

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
