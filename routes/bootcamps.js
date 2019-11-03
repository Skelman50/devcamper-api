const express = require("express");

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInradius,
  bootcampPhotoUpload
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");
const { advancedResult } = require("../middleware/advanced-results");

//include other resourse router

const coursesRouter = require("./courses");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

//re-route in other resourse
router.use("/:bootcampId/courses", coursesRouter);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResult(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInradius);

module.exports = router;
