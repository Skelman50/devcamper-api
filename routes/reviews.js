const express = require("express");

const Review = require("../models/Review");
const { advancedResult } = require("../middleware/advanced-results");
const {
  getReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview
} = require("../controllers/reviews");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResult(Review, {
      path: "bootcamp",
      select: "name description"
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), createReview);

router
  .route("/:id")
  .get(getSingleReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"), deleteReview);

module.exports = router;
