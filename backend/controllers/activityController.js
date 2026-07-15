const prisma = require("../utils/prisma");

exports.getActivities = async (req, res) => {
  try {
    const activities = await prisma.activityLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      activities,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};