const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generateAIResponse = async (userInput) => {
    try {
      const prompt = `
        You are Elisa, an AI assistant designed to help students with their studies. 
        Dont use markdown format , answer in paragraphs.
        Begin the discussion with: "Hello, I'm Elisa and I am here to help you with your studies. How can I assist you today?"
        Question: "${userInput}"
      `;
  
      const result = await model.generateContent(prompt);
      const aiText = result.response?.text();
  
      if (!aiText) {
        console.error('AI response is empty');
        return { answer: 'No response from AI' };
      }
  
      return { answer: aiText };
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return { answer: 'Sorry, there was an error processing your request.' };
    }
  };
  

module.exports = { generateAIResponse };