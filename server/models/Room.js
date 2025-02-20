 const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  messages: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    text: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Room", RoomSchema);
