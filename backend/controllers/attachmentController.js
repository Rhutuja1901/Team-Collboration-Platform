const prisma = require("../utils/prisma");
const fs = require("fs");
const path = require("path");

// ======================================
// Upload Attachment
// ======================================

exports.uploadAttachment = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

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
        taskId: taskId,
      },
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("attachmentUploaded", attachment);
    }

    return res.status(201).json({
      success: true,
      attachment,
    });

  } catch (error) {
    console.error("UPLOAD ATTACHMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Get Attachments
// ======================================

   exports.getAttachments = async (req, res) => {
  try {
    const taskId = String(req.params.taskId).trim();

    console.log("\n========== ATTACHMENT DEBUG ==========");
    console.log("Requested taskId:", taskId);

    // Get every attachment from the database used by THIS backend
    const allAttachments = await prisma.attachment.findMany();

    console.log(
      "Total attachments found by backend:",
      allAttachments.length
    );

    console.log("All attachments:");

    allAttachments.forEach((attachment) => {
      console.log({
        id: attachment.id,
        taskId: attachment.taskId,
        fileName: attachment.fileName,
        fileUrl: attachment.fileUrl,
      });
    });

    // Find attachments for requested task
    const attachments = await prisma.attachment.findMany({
      where: {
        taskId: taskId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(
      "Attachments matching requested task:",
      attachments.length
    );

    console.log("======================================\n");

    return res.status(200).json({
      success: true,
      attachments,
    });

  } catch (error) {
    console.error("ATTACHMENT DEBUG ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Delete Attachment
// ======================================

exports.deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting attachment:", id);

    const attachment = await prisma.attachment.findUnique({
      where: {
        id: id,
      },
    });

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found",
      });
    }

    // attachment.fileUrl = /uploads/filename.jpg
    // Convert it to backend/uploads/filename.jpg

    const filePath = path.join(
      __dirname,
      "..",
      attachment.fileUrl
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      console.log(
        "Physical file deleted:",
        filePath
      );
    }

    await prisma.attachment.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Attachment deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE ATTACHMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};