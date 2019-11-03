const express = require("express");
const {
  getCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courses");

const Course = require("../models/Course");
const { advancedResult } = require("../middleware/advanced-results");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResult(Course, {
      path: "bootcamp",
      select: "name description"
    }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), createCourse);
router
  .route("/:id")
  .get(getSingleCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
