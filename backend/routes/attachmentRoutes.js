const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  uploadAttachment,
  getAttachments,
  deleteAttachment,
} = require("../controllers/attachmentController");

router.post(
  "/",
  upload.single("file"),
  uploadAttachment
);

router.get(
  "/:taskId",
  getAttachments
);

router.delete(
  "/:id",
  deleteAttachment
);

module.exports = router;