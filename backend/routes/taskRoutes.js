const express = require("express");

const {
  verifyToken,
  allowRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createTask,
  getTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Create Task
router.post(
  "/",
  verifyToken,
  createTask
);

// Get All Tasks
router.get(
  "/",
  verifyToken,
  getTasks
);

// Update Task Status
router.put(
  "/:id",
  verifyToken,
  allowRoles("ADMIN", "MANAGER"),
  updateTaskStatus
);

// Edit Task
router.put(
  "/edit/:id",
  verifyToken,
  updateTask
);

// Delete Task
router.delete(
  "/:id",
  verifyToken,
  deleteTask
);

module.exports = router;