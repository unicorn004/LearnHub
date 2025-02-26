const express = require("express");
const { uploadResource, getResources } = require("../controllers/resourceController");
const { singleUpload } = require("../middleware/multer"); // ✅ Use singleUpload from multer.js
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", authMiddleware, singleUpload, uploadResource); // ✅ Correct multer usage
router.get("/", authMiddleware, getResources);

module.exports = router;