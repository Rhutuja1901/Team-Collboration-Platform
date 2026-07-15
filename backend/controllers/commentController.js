const prisma = require("../utils/prisma");

// ==========================
// Create Comment
// ==========================
exports.createComment = async (req, res) => {
  try {
    const { text, taskId, userId } = req.body;

    if (!text || !taskId || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create Comment
    const comment = await prisma.comment.create({
      data: {
        text,
        taskId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // ==========================
    // Find Task
    // ==========================
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    // ==========================
    // Create Notification
    // ==========================
    if (
      task &&
      task.assignedToId &&
      task.assignedToId !== userId
    ) {
      await prisma.notification.create({
  data: {
    message: `${comment.user.name} commented on task "${task.title}"`,
    userId: task.assignedToId,
  },
});
    }

    // ==========================
    // Socket.IO Event
    // ==========================
    const io = req.app.get("io");
    io.emit("commentCreated", comment);

    return res.status(201).json({
      success: true,
      comment,
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
// Get Comments by Task
// ==========================
exports.getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await prisma.comment.findMany({
      where: {
        taskId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      comments,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};