const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/error-response");
const asyncHandler = require("express-async-handler");

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({ succes: true, data: bootcamps });
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const {
    params: { id }
  } = req;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }
  res.status(200).json({ succes: true, data: bootcamp });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ succes: true, data: bootcamp });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const {
    body,
    params: { id }
  } = req;
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }
  res.status(200).json({ succes: true, data: bootcamp });
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const {
    params: { id }
  } = req;
  const bootcamp = await Bootcamp.findByIdAndDelete(id);
  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }
  res.status(200).json({ succes: true, data: bootcamp });
});
