const express = require("express");
const { 
  createRoom, 
  getAllRooms,
  handleSocketConnections
} = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to create a new chat room
router.post("/createRoom", authMiddleware, createRoom);

// Route to get all chat rooms
router.get("/getAllRooms", authMiddleware, getAllRooms);

module.exports = { router, handleSocketConnections };
