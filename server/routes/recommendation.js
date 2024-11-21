const express = require("express");
const { getRecommendations } = require("../utils/pythonService");

const router = express.Router();

router.post("/recommend", async (req, res) => {
  const { userText, groupTexts, resourceTexts } = req.body;

  if (!userText) {
    return res.status(400).json({ error: "User text is required" });
  }

  try {
    const recommendations = await getRecommendations(userText, groupTexts, resourceTexts);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

module.exports = router;