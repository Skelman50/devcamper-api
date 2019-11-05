const User = require("../models/User");
const ErrorResponse = require("../utils/error-response");
const asyncHandler = require("express-async-handler");

//api/v1/users
//private/admin
//get
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.json(res.advancedResult);
});

//api/v1/users/:id
//private/admin
//get
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.json({ success: true, data: user });
});

//api/v1/users
//private/admin
//post
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

//api/v1/users/:id
//private/admin
//put
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.json({ success: true, data: user });
});

//api/v1/users/:id
//private/admin
//delete
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
