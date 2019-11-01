const express = require("express");

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInradius
} = require("../controllers/bootcamps");

//include other resourse router

const coursesRouter = require("./courses");

const router = express.Router();

//re-route in other resourse
router.use("/:bootcampId/courses", coursesRouter);

router
  .route("/")
  .get(getBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInradius);

module.exports = router;
