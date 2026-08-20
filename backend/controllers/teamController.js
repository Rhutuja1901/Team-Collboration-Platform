const prisma = require("../utils/prisma");


// ======================================
// Create Team
// ======================================

exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    const userId = req.user.id;
    const userRole = req.user.role;

    // Validate team name
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    // Create team
    // The creator is automatically added as a team member.
    const team = await prisma.team.create({
      data: {
        name,
        description,

        members: {
          create: {
            userId: userId,
          },
        },
      },

      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        action: `Created team "${team.name}"`,
        userName: req.user?.name || "Unknown User",
      },
    });

    // Socket.IO
    const io = req.app.get("io");

    if (io) {
      io.emit("teamCreated", team);
    }

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      team,
    });

  } catch (error) {
    console.error("CREATE TEAM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Get Teams
// ======================================

exports.getTeams = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let teams;

    // ======================================
    // ADMIN
    // Can see all teams
    // ======================================

    if (userRole === "ADMIN") {

      teams = await prisma.team.findMany({
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
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

    }

    // ======================================
    // MANAGER / MEMBER
    // Only teams they belong to
    // ======================================

    else {

      teams = await prisma.team.findMany({
        where: {
          members: {
            some: {
              userId: userId,
            },
          },
        },

        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
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

    }

    return res.status(200).json({
      success: true,
      teams,
    });

  } catch (error) {
    console.error("GET TEAMS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Add Member
// ======================================

exports.addMember = async (req, res) => {
  try {
    const { teamId, userId } = req.body;

    // Validate fields
    if (!teamId || !userId) {
      return res.status(400).json({
        success: false,
        message: "teamId and userId are required",
      });
    }

    // Check team exists
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already a member
    const existingMember =
      await prisma.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId: userId,
            teamId: teamId,
          },
        },
      });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this team",
      });
    }

    // Add member
    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },

        team: true,
      },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        action: `Added ${user.name} to team "${team.name}"`,
        userName: req.user?.name || "Unknown User",
      },
    });

    // Socket.IO
    const io = req.app.get("io");

    if (io) {
      io.emit("memberAdded", member);

      // Notify the added user
      io.to(userId).emit("newNotification", {
        message: `You were added to team "${team.name}"`,
        teamId: team.id,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      member,
    });

  } catch (error) {
    console.error("ADD MEMBER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Delete Team
// ADMIN ONLY
// ======================================

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    // Check team exists
    const team = await prisma.team.findUnique({
      where: {
        id,
      },
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Delete team
    await prisma.team.delete({
      where: {
        id,
      },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        action: `Deleted team "${team.name}"`,
        userName: req.user?.name || "Unknown User",
      },
    });

    // Socket.IO
    const io = req.app.get("io");

    if (io) {
      io.emit("teamDeleted", id);
    }

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });

  } catch (error) {
    console.error("DELETE TEAM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Get Team Members
// ======================================

exports.getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;

    const userId = req.user.id;
    const userRole = req.user.role;

    // Check team exists
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // ======================================
    // ADMIN can view any team
    // ======================================

    if (userRole !== "ADMIN") {

      const membership =
        await prisma.teamMember.findUnique({
          where: {
            userId_teamId: {
              userId: userId,
              teamId: teamId,
            },
          },
        });

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: "You are not a member of this team",
        });
      }
    }

    // Get members
    const members =
      await prisma.teamMember.findMany({
        where: {
          teamId,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

    return res.status(200).json({
      success: true,
      members,
    });

  } catch (error) {
    console.error("GET TEAM MEMBERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};