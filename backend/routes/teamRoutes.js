const express = require("express");

const router = express.Router();

const {
  verifyToken,
  allowRoles,
} = require("../middleware/authMiddleware");

const {
  createTeam,
  getTeams,
  addMember,
  deleteTeam,
} = require("../controllers/teamController");

// Create Team
router.post(
  "/",
  verifyToken,
  allowRoles("ADMIN", "MANAGER"),
  createTeam
);

// Get All Teams
router.get(
  "/",
  verifyToken,
  getTeams
);

// Add Member
router.post(
  "/member",
  verifyToken,
  allowRoles("ADMIN", "MANAGER"),
  addMember
);

// Delete Team
router.delete(
  "/:id",
  verifyToken,
  allowRoles("ADMIN"),
  deleteTeam
);

module.exports = router;