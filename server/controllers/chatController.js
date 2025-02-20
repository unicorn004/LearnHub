const Room = require("../models/Room");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

// Create a new chat room
const createRoom = async (req, res) => {
  try {
    const { roomName } = req.body;
    const userId = req.body.userId;


    // Check if room already exists
    const existingRoom = await Room.findOne({ name: roomName.trim() });

    if (existingRoom) {
      return res.status(400).json({ message: "Room already exists" });
    }

    // Create new room
    const newRoom = new Room({
      name: roomName.trim(),
      createdBy: userId,
      participants: [userId],
      messages: []
    });


    await newRoom.save();

    // Emit room created event
    const io = req.app.get("socketio");
    io.emit("roomCreated", newRoom);

    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all chat rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("createdBy", "username");
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Handle socket connections
const handleSocketConnections = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    // Join room
    socket.on("joinRoom", async (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

      try {
        // Fetch previous messages when a user joins
        const room = await Room.findById(roomId).populate("messages.user");
        if (room) {
          socket.emit("previousMessages", room.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    });

    // Handle messages
    socket.on("serverRcvsMsg", async (messageData) => {
      try {
        console.log(`Message received in room ${messageData.roomId}:`, messageData);

        // Store message in MongoDB
        const room = await Room.findById(messageData.roomId);
        if (!room) {
          console.log("Room not found");
          return;
        }

        const newMessage = {
          user: new mongoose.Types.ObjectId(messageData.userId),
          text: messageData.text,
          timestamp: new Date(),
        };

        room.messages.push(newMessage);
        await room.save();
        console.log("Message saved to DB:", newMessage);

        const populatedRoom = await Room.findOne(
          { _id: messageData.roomId },
          { messages: { $slice: -1 } } // Get only the last message
        ).populate({
          path: "messages.user",
          select: "name",
        });

        if (!populatedRoom || populatedRoom.messages.length === 0) {
          console.log("No messages found after saving.");
          return;
        }

        const populatedMessage = populatedRoom.messages[0];

        console.log("Emitting message to room:", messageData.roomId, populatedMessage);

        //const populatedMessage = updatedRoom.messages[updatedRoom.messages.length - 1];
        //console.log("Emitting message to room:", messageData.roomId, populatedMessage);
        // Emit message to all users in the room
        console.log("Populated Message:", JSON.stringify(populatedRoom, null, 2));
        io.to(messageData.roomId).emit("serverSendsMsg", populatedMessage);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = {
  createRoom,
  getAllRooms,
  handleSocketConnections
};
