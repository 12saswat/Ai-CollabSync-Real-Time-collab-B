const http = require("http");
const app = require("./app");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const projectModel = require("./models/project.model");
const { generateResult } = require("./services/ai.service");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// Middleware: Authenticate and attach project + user
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];
    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid project ID"));
    }

    const project = await projectModel.findById(projectId);
    if (!project) return next(new Error("Project not found"));

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return next(new Error("Invalid token"));

    socket.project = project;
    socket.user = decoded;

    return next();
  } catch (error) {
    console.error("Socket auth error:", error.message);
    return next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  console.log("✅ New client connected:", socket.user.email);
  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    console.log("📨 Received project-message:", data);

    try {
      const { message, sender } = data;

      // Always emit the user's message first to everyone (including sender)
      io.to(socket.roomId).emit("project-message", {
        message,
        sender,
      });

      // If message includes "@ai", generate and send AI reply
      if (message.includes("@ai")) {
        const prompt = message.replace("@ai", "").trim();
        const response = await generateResult(prompt);

        io.to(socket.roomId).emit("project-message", {
          message: response,
          sender: {
            _id: "ai",
            email: "AI",
          },
        });
      }
    } catch (err) {
      console.error("❌ Error handling project-message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🚪 Client disconnected:", socket.user.email);
    socket.leave(socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
