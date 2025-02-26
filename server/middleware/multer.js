const multer = require("multer");

const storage = multer.memoryStorage(); // Store file in memory (not disk)

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
        cb(null, true); // Accept only images and PDFs
    } else {
        cb(new Error("Only image and PDF files are allowed"), false);
    }
};

const singleUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter,
}).single("file");

module.exports = { singleUpload };