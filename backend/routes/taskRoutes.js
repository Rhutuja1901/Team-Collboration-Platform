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

// ======================================
// Create Task
// ADMIN + MANAGER only
// ======================================

router.post(
  "/",
  verifyToken,
  allowRoles("ADMIN", "MANAGER"),
  createTask
);

// ======================================
// Get All Tasks
// All authenticated users
// ======================================

router.get(
  "/",
  verifyToken,
  getTasks
);

// ======================================
// Update Task Status
// ADMIN + MANAGER only
// ======================================

router.put(
  "/:id",
  verifyToken,
  allowRoles("ADMIN", "MANAGER"),
  updateTaskStatus
);

// ======================================
// Edit Task
// ADMIN + MANAGER only
// ======================================

router.put(
  "/edit/:id",
  verifyToken,
  allowRoles("ADMIN", "MANAGER"),
  updateTask
);

// ======================================
// Delete Task
// ADMIN + MANAGER only
// ======================================

router.delete(
  "/:id",
  verifyToken,
  allowRoles("ADMIN", "MANAGER"),
  deleteTask
);

module.exports = router;