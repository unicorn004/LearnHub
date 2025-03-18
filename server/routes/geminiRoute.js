const express = require('express');
const { generateAIResponse } = require('../services/geminiService');
const router = express.Router();

router.post('/ask-ai', async (req, res) => {
  const { question } = req.body;
  try {
    const aiResponse = await generateAIResponse(question);
    res.json(aiResponse);
  } catch (error) {
    console.error("Error getting AI response:", error);
    res.status(500).json({ message: 'Failed to get AI response' });
  }
});

module.exports = router;