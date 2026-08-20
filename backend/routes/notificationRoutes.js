const express = require("express");

const router = express.Router();

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  createNotification,
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

// Create notification
router.post(
  "/",
  verifyToken,
  createNotification
);

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