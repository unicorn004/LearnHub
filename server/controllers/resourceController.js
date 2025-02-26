const Resource = require("../models/resource"); // Changed to require() (without .js extension)
const cloudinary = require("../utils/cloudinary"); // Changed to require()
const getDataUri = require("../utils/datauri.cjs"); // Assuming this is CommonJS file

// Function to upload resources
const uploadResource = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert the file buffer to a Data URI
    const fileUri = getDataUri(req.file);
    
    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: "auto", // Accepts PDFs and images
      folder: "resources", // Optional: Store in "resources" folder
    });

    // Save to MongoDB
    const newResource = new Resource({
      name: req.body.name, // Use correct field names from frontend
      topic: req.body.topic,
      description: req.body.description,
      fileUrl: cloudinaryResponse.secure_url,
      uploadedBy: req.user.id, // Ensure you have user authentication
      uploadDate: new Date(),
      fileSize: req.file.size,
      type: req.file.mimetype,
      downloadCount: 0, // Initialize download count
    });
    console.log(req.body);
    await newResource.save();

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: cloudinaryResponse.secure_url, // Return the Cloudinary URL
      resource: newResource,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Function to get resources
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate("uploadedBy", "name");
    const transformedResources = resources.map((resource) => ({
      id: resource._id,
      title: resource.name, // Fix: Map `name` to `title`
      subject: resource.topic, // Fix: Map `topic` to `subject`
      uploadedBy: resource.uploadedBy ? resource.uploadedBy.name : "Unknown", // Fix: Ensure uploader name
      uploadDate: resource.uploadDate.toISOString().split("T")[0], // Fix: Format date
      fileSize: (resource.fileSize / 1024).toFixed(2) + " KB", // Fix: Convert size to KB
      type: resource.type,
      downloadCount: resource.downloadCount,
      fileUrl: resource.fileUrl,
    }));

    res.json(transformedResources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export the functions using module.exports
module.exports = { uploadResource, getResources };