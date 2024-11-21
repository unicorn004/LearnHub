const axios = require("axios");

const getRecommendations = async (userText, groupTexts, resourceTexts) => {
  try {
    const response = await axios.post("http://localhost:5001/recommend", {
      user_text: userText,
      group_texts: groupTexts,
      resource_texts: resourceTexts,
    });
    return response.data;
  } catch (error) {
    console.error("Error calling Python service:", error);
    throw new Error("Python service failed");
  }
};

module.exports = { getRecommendations };