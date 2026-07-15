const prisma = require("../utils/prisma");

// ===============================
// Create Notification
// ===============================

exports.createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
      },
    });

    // Emit notification in real-time
    const io = req.app.get("io");

    io.emit("newNotification", notification);

    return res.status(201).json({
      success: true,
      notification,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Notifications
// ===============================

exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      notifications,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Mark as Read
// ===============================

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });

    return res.status(200).json({
      success: true,
      notification,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};