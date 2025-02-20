const express = require("express");
const { createPost, addComment, voteComment, getPosts, checkToxicContent } = require("../controllers/forumController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.post("/comment", authMiddleware, addComment);
router.post("/vote", authMiddleware, voteComment);
router.get("/posts", getPosts);
router.post("/check-toxic", authMiddleware, checkToxicContent);

module.exports = router;
