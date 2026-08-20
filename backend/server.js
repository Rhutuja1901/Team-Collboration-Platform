const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");


const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ======================================
// Socket.IO Configuration
// ======================================

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Make socket available everywhere
app.set("io", io);

// ======================================
// Socket Events
// ======================================

io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

  // ============================
  // Join Personal Notification Room
  // ============================

  socket.on("joinUser", (userId) => {
    socket.join(userId);

    console.log(
      `User ${userId} joined personal room`
    );
  });

  // ============================
  // Join Team Chat Room
  // ============================

  socket.on("joinTeam", (teamId) => {
    socket.join(teamId);

    console.log(
      `Socket ${socket.id} joined team ${teamId}`
    );
  });

  // ============================
  // Leave Team Chat Room
  // ============================

  socket.on("leaveTeam", (teamId) => {
    socket.leave(teamId);

    console.log(
      `Socket ${socket.id} left team ${teamId}`
    );
  });

  // ============================
  // Disconnect
  // ============================

  socket.on("disconnect", () => {
    console.log(
      "User Disconnected:",
      socket.id
    );
  });

});

// ======================================
// Middleware
// ======================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Swagger

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ======================================
// Routes
// ======================================

const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const activityRoutes = require("./routes/activityRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const chatRoutes = require("./routes/chatRoutes");
const attachmentRoutes = require("./routes/attachmentRoutes");


const path = require("path");

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ======================================
// API Routes
// ======================================

app.use("/api/auth", authRoutes);

app.use("/api/teams", teamRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/notifications", notificationRoutes);
app.use("/api/attachments", attachmentRoutes);

app.use("/api/activities", activityRoutes);

app.use("/api/users", userRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/chat", chatRoutes);


// ======================================
// Health Check
// ======================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Team Collaboration Platform API Running",
  });
});

// ======================================
// Deadline Reminder Job
// ======================================

const startDeadlineReminder = require("./jobs/deadlineReminder");

startDeadlineReminder();

// ======================================
// Start Server
// ======================================

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});