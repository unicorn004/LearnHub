const ForumPost = require("../models/forum");
const { checkToxicContent } = require("../utils/contentModeration");

// Create a new forum post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Check for toxic content
    const isToxic = await checkToxicContent(content);
    if (isToxic) {
      return res.status(400).json({ msg: "Your content contains inappropriate language. Please revise it." });
    }

    const newPost = new ForumPost({
      title,
      content,
      user: req.user.id
    });
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Add comment to a post
const addComment = async (req, res) => {
  try {
    const { postId } = req.body;
    const content = req.body.content;
    
    // Check for toxic content
    const isToxic = await checkToxicContent(content);
    if (isToxic) {
      return res.status(400).json({ msg: "Your comment contains inappropriate language. Please revise it." });
    }

    const post = await ForumPost.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = {
      user: req.user.id,
      content
    };

    post.comments.push(comment);
    await post.save();
    
    // Populate user information in the response
    const populatedPost = await ForumPost.findById(postId)
      .populate('user', 'name')
      .populate('comments.user', 'name');
      
    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Upvote or downvote a comment
const voteComment = async (req, res) => {
  try {
    const { postId, commentId, voteType } = req.body;
    const post = await ForumPost.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (voteType === "upvote") {
      comment.upvotes += 1;
    } else if (voteType === "downvote") {
      comment.downvotes += 1;
    } else {
      return res.status(400).json({ msg: "Invalid vote type" });
    }

    await post.save();
    
    // Populate user information in the response
    const populatedPost = await ForumPost.findById(postId)
      .populate('user', 'name')
      .populate('comments.user', 'name');
      
    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get all posts with comments
const getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .populate('comments.user', 'name');
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Check if content contains toxic words
const checkToxicContentController = async (req, res) => {
  try {
    const { text } = req.body;
    const isToxic = await checkToxicContent(text);
    res.json({ success: !isToxic });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createPost,
  addComment,
  voteComment,
  getPosts,
  checkToxicContent: checkToxicContentController
};
