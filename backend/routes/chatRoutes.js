const express = require("express");

const router = express.Router();

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

router.get(
  "/:teamId",
  verifyToken,
  getMessages
);

router.post(
  "/",
  verifyToken,
  sendMessage
);

module.exports = router;