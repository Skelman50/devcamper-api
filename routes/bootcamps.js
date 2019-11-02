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

const router = express.Router();

//re-route in other resourse
router.use("/:bootcampId/courses", coursesRouter);

router.route("/:id/photo").put(bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResult(Bootcamp, "courses"), getBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInradius);

module.exports = router;
