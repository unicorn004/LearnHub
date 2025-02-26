const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  topic: { type: String, required: true }, 
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, default: "" },
  fileUrl: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }, 
  fileSize: { type: Number, required: true },
  type: { type: String, required: true }, 
  downloadCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Resource", resourceSchema);
