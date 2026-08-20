const prisma = require("../utils/prisma");

exports.getDashboardStats = async (req, res) => {
  try {
    // ==========================
    // Statistics
    // ==========================

    const totalUsers = await prisma.user.count();

    const totalTeams = await prisma.team.count();

    const totalTasks = await prisma.task.count();

    const completedTasks = await prisma.task.count({
      where: {
        status: "DONE",
      },
    });

    const inProgressTasks = await prisma.task.count({
      where: {
        status: "IN_PROGRESS",
      },
    });

    const todoTasks = await prisma.task.count({
      where: {
        status: "TODO",
      },
    });

    // ==========================
    // Recent Activities
    // ==========================

    const recentActivities = await prisma.activityLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // ==========================
    // Upcoming Deadlines
    // ==========================

    const upcomingDeadlines = await prisma.task.findMany({
      where: {
        deadline: {
          gte: new Date(),
        },
      },
      orderBy: {
        deadline: "asc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        deadline: true,
        priority: true,
        status: true,
      },
    });

    // ==========================
    // Response
    // ==========================

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTeams,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
      },
      recentActivities,
      upcomingDeadlines,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};