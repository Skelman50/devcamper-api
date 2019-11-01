const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/error-response");
const asyncHandler = require("express-async-handler");

//public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId }).populate({
      path: "bootcamp",
      select: "name description"
    });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description"
    });
  }

  const courses = await query;
  res.json({ success: true, count: courses.length, data: courses });
});

//public

exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!course) {
    return next(new ErrorResponse("Course not found", 404));
  }
  res.json({ success: true, data: course });
});

//private
//api/v1/bootcamps/:bootcampId/courses
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }
  const course = await Course.create(req.body);
  res.json({ success: true, data: course });
});

//private
//api/v1/courses/:id
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!course) {
    return next(new ErrorResponse("Course not found", 404));
  }

  res.json({ success: true, data: course });
});

//private
//api/v1/courses/:id
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return next(new ErrorResponse("Course not found", 404));
  }

  res.json({ success: true });
});
