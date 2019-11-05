const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/error-response");
const asyncHandler = require("express-async-handler");

//public
//api/v1/reviews
//api/v1/bootcamps/:bootcampId/reviews
//get
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({
      bootcamp: req.params.bootcampId
    }).populate({
      path: "bootcamp",
      select: "name description"
    });
    return res.json({ success: true, count: reviews.length, data: reviews });
  }

  res.json(res.advancedResult);
});

//public
//api/v1/reviews/:id
//get
exports.getSingleReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!review) {
    return next(new ErrorResponse("Review not found", 404));
  }

  res.json({ success: true, data: review });
});

//private
//api/v1/bootcamps/:bootcampId/reviews
//post
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.body.bootcamp);
  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }
  const review = await Review.create(req.body);
  res.status(201).json({ success: true, data: review });
});

//private
//api/v1/reviews/:id
//put
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse("Review not found", 404));
  }

  //make sure review belong to user ur user is admin

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("No authorized for update this review", 403));
  }

  review = await Review.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  });

  review.getAverageRating(review.bootcamp);
  //   review.save();
  res.json({ success: true, data: review });
});

//private
//api/v1/reviews/:id
//delete
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse("Review not found", 404));
  }

  //make sure review belong to user ur user is admin

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("No authorized for update this review", 403));
  }

  await review.remove();

  res.json({ success: true });
});
