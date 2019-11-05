const express = require("express");
const User = require("../models/User");

const { advancedResult } = require("../middleware/advanced-results");
const { protect, authorize } = require("../middleware/auth");

const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(authorize("admin"));

router
  .route("/")
  .get(advancedResult(User), getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
