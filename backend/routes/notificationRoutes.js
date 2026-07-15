const express = require("express");

const router = express.Router();

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

// Get notifications
router.get(
  "/:userId",
  verifyToken,
  getNotifications
);

// Mark notification as read
router.put(
  "/:id",
  verifyToken,
  markAsRead
);

module.exports = router;