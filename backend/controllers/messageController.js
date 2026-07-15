const prisma = require("../utils/prisma");

// ===============================
// Send Message
// ===============================
exports.sendMessage = async (req, res) => {
  try {
    const { text, teamId, userId } = req.body;

    if (!text || !teamId || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const message = await prisma.message.create({
      data: {
        text,
        teamId,
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

    const io = req.app.get("io");

    io.emit("newMessage", message);

    return res.status(201).json({
      success: true,
      message,
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
// Get Team Messages
// ===============================
exports.getMessages = async (req, res) => {
  try {
    const { teamId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        teamId,
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
      messages,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};