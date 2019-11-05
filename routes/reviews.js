const express = require("express");

const Review = require("../models/Review");
const { advancedResult } = require("../middleware/advanced-results");
const { getReviews } = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

router.route("/").get(
  advancedResult(Review, {
    path: "bootcamp",
    select: "name description"
  }),
  getReviews
);

module.exports = router;
