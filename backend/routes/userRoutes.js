const express = require("express");

const router = express.Router();

const {
  getUsers,
  getUser,
  updateUser,
} = require("../controllers/userController");

// Get all users
router.get("/", getUsers);

// Get single user
router.get("/:id", getUser);

// Update user profile
router.put("/:id", updateUser);

module.exports = router;