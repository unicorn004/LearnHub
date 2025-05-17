const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
dotenv.config();
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/group");
const resourceRoutes = require("./routes/resource");
const profileRoutes = require("./routes/profileRoutes");
const recommendationRoutes = require("./routes/recommendation");
const forumRoutes = require("./routes/forum");
const { router: chatRoutes, handleSocketConnections } = require("./routes/chat");
const aiRoutes = require("./routes/geminiRoute");
const quiz = require ("./routes/quiz.js")
// Initialize the app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  logger: 'debug'
});

// Initialize socket.io
handleSocketConnections(io);
app.set("socketio", io);

const cors = require("cors");
app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true 
}));

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Set up routes
app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/quiz",quiz);
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
