const prisma = require("../utils/prisma");

exports.getDashboardStats = async (req, res) => {
  try {
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
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};