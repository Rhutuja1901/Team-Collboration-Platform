const prisma = require("../utils/prisma");

// ==========================
// Create Task
// ==========================
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      deadline,
      priority,
      teamId,
      assignedToId,
    } = req.body;

    if (!title || !teamId) {
      return res.status(400).json({
        success: false,
        message: "Title and Team are required",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        deadline: deadline ? new Date(deadline) : null,
        teamId,
        assignedToId: assignedToId || null,
      },
      include: {
        team: true,
        assignedTo: true,
      },
    });

    // Activity Log
    await prisma.activityLog.create({
      data: {
        action: `Created task "${task.title}"`,
        userName: req.user?.name || "Unknown User",
      },
    });

    // Notification
    if (assignedToId) {
      const notification = await prisma.notification.create({
        data: {
          userId: assignedToId,
          message: `You have been assigned a new task: ${task.title}`,
        },
      });

      const io = req.app.get("io");
      io.emit("newNotification", notification);
    }

    // Realtime event
    const io = req.app.get("io");
    io.emit("taskCreated", task);

    return res.status(201).json({
      success: true,
      task,
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
// Get All Tasks
// ==========================
exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        team: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      tasks,
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
// Update Task Status
// ==========================
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: `Updated task "${task.title}" to ${task.status}`,
        userName: req.user?.name || "Unknown User",
      },
    });

    if (task.assignedToId) {
      const notification = await prisma.notification.create({
        data: {
          userId: task.assignedToId,
          message: `Task "${task.title}" status changed to ${task.status}`,
        },
      });

      const io = req.app.get("io");
      io.emit("newNotification", notification);
    }

    const io = req.app.get("io");
    io.emit("taskUpdated", task);

    return res.status(200).json({
      success: true,
      message: "Task Updated Successfully",
      task,
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
// Edit Task Details
// ==========================
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      priority,
      deadline,
      assignedToId,
    } = req.body;

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        priority,
        deadline: deadline ? new Date(deadline) : null,
        assignedToId: assignedToId || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: `Edited task "${task.title}"`,
        userName: req.user?.name || "Unknown User",
      },
    });

    const io = req.app.get("io");
    io.emit("taskUpdated", task);

    return res.status(200).json({
      success: true,
      task,
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
// Delete Task
// ==========================
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: {
        id,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: `Deleted task "${task.title}"`,
        userName: req.user?.name || "Unknown User",
      },
    });

    const io = req.app.get("io");
    io.emit("taskDeleted", id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};