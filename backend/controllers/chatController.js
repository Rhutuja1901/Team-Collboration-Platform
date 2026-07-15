const prisma = require("../utils/prisma");

exports.getMessages = async (req, res) => {
  try {
    const { teamId } = req.params;

    const messages = await prisma.chatMessage.findMany({
      where: {
        teamId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json({
      success: true,
      messages,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, teamId } = req.body;

    const senderId = req.user.id;

    const chatMessage =
      await prisma.chatMessage.create({
        data: {
          message,
          teamId,
          senderId,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    const io = req.app.get("io");

    io.to(teamId).emit(
      "receiveMessage",
      chatMessage
    );

    res.status(201).json({
      success: true,
      message: chatMessage,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};