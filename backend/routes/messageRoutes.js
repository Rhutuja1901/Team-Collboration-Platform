const express = require("express");

const router = express.Router();

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

// Send Message
router.post(
  "/",
  verifyToken,
  sendMessage
);

// Get Messages of a Team
router.get(
  "/:teamId",
  verifyToken,
  getMessages
);

module.exports = router;