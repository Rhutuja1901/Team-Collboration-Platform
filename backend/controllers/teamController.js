const prisma = require("../utils/prisma");

// ==========================
// Create Team
// ==========================
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
      },
    });

    await prisma.activityLog.create({
  data: {
    action: `Created team "${team.name}"`,
    userName: req.user?.name || "Unknown User",
  },
});

    // Realtime Event
    const io = req.app.get("io");
    io.emit("teamCreated", team);

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      team,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Teams
// ==========================
exports.getTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        tasks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      teams,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Add Member
// ==========================
exports.addMember = async (req, res) => {
  try {
    const { teamId, userId } = req.body;

    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
      },
      include: {
        user: true,
        team: true,
      },
    });

    const io = req.app.get("io");
    io.emit("memberAdded", member);

    return res.status(201).json({
      success: true,
      member,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Team
// ==========================
exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.team.delete({
      where: {
        id,
      },
    });

    const io = req.app.get("io");
    io.emit("teamDeleted", id);

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};