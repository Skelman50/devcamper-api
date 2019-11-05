const Review = require("../models/Review");
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
