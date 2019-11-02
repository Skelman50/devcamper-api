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
  .post(createCourse);
router
  .route("/:id")
  .get(getSingleCourse)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;
