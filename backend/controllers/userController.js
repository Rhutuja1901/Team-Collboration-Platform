const prisma = require("../utils/prisma");

// =====================
// Get All Users
// =====================
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      users,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================
// Get User By ID
// =====================
exports.getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================
// Update User
// =====================
exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        name,
        email,
      },
    });

    res.json({
      success: true,
      message: "Profile Updated",
      user,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};