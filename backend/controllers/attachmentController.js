const prisma = require("../utils/prisma");

// Upload Attachment
exports.uploadAttachment = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const attachment = await prisma.attachment.create({
      data: {
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        taskId,
      },
    });

    // Socket.IO Notification
    const io = req.app.get("io");
    io.emit("attachmentUploaded", attachment);

    return res.status(201).json({
      success: true,
      attachment,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Attachments
exports.getAttachments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const attachments = await prisma.attachment.findMany({
      where: {
        taskId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      attachments,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};