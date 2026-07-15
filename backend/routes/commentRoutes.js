const express = require("express");
const router = express.Router();

const {
  createComment,
  getComments,
} = require("../controllers/commentController");

const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createComment);
router.get("/:taskId", verifyToken, getComments);

module.exports = router;