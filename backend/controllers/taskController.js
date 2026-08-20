const prisma = require("../utils/prisma");

// ======================================
// Create Task
// ======================================
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
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Activity Log
    await prisma.activityLog.create({
      data: {
        action: `Created task "${task.title}"`,
        userName: req.user?.name || "Unknown User",
      },
    });

    const io = req.app.get("io");

    // Notification
    if (assignedToId) {
      const notification = await prisma.notification.create({
        data: {
          userId: assignedToId,
          message: `You have been assigned a new task: ${task.title}`,
        },
      });

      // Send only to assigned user
      io.to(assignedToId).emit(
        "newNotification",
        notification
      );
    }

    // Broadcast Task Created
    io.emit("taskCreated", {
      type: "CREATED",
      task,
    });

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

// ======================================
// Get Tasks
// ======================================
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

    return res.json({
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

// ======================================
// Update Task Status
// ======================================
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
      include: {
        assignedTo: true,
        team: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: `Updated task "${task.title}" to ${task.status}`,
        userName: req.user?.name || "Unknown User",
      },
    });

    const io = req.app.get("io");

    if (task.assignedToId) {

      const notification =
        await prisma.notification.create({
          data: {
            userId: task.assignedToId,
            message: `Task "${task.title}" moved to ${task.status}`,
          },
        });

      // Personal Notification
      io.to(task.assignedToId).emit(
        "newNotification",
        notification
      );
    }

    // Broadcast Task Update
    io.emit("taskUpdated", {
      type: "STATUS_UPDATED",
      task,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
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

// ======================================
// Edit Task
// ======================================
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
        deadline: deadline
          ? new Date(deadline)
          : null,
        assignedToId: assignedToId || null,
      },
      include: {
        team: true,
        assignedTo: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: `Edited task "${task.title}"`,
        userName: req.user?.name || "Unknown User",
      },
    });

    const io = req.app.get("io");

    io.emit("taskUpdated", {
      type: "EDITED",
      task,
    });

    return res.json({
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

// ======================================
// Delete Task
// ======================================
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

    io.emit("taskDeleted", {
      id,
    });

    return res.json({
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