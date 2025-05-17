const Question = require('../models/Question');

// Upload bulk questions using correctAnswerIndex directly
exports.uploadBulkQuestions = async (req, res) => {
  try {
    const questions = req.body.questions;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: 'Input must be an array of questions.' });
    }

    const formattedQuestions = [];

    for (const q of questions) {
      if (
        typeof q.correctAnswerIndex !== 'number' ||
        q.correctAnswerIndex < 0 ||
        q.correctAnswerIndex > 3
      ) {
        return res.status(400).json({
          message: `Invalid or missing correctAnswerIndex for question: "${q.text}"`,
        });
      }

      if (!Array.isArray(q.options) || q.options.length !== 4) {
        return res.status(400).json({
          message: `Question must have exactly 4 options: "${q.text}"`,
        });
      }

      formattedQuestions.push({
        text: q.text,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
      });
    }

    const result = await Question.insertMany(formattedQuestions);
    res.status(201).json({
      message: 'Questions uploaded successfully',
      count: result.length,
    });
  } catch (error) {
    console.error('Error uploading questions:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get N random questions with correctAnswerIndex
exports.getRandomQuestions = async (req, res) => {
  const count = parseInt(req.params.count) || 5;

  try {
    const questions = await Question.aggregate([{ $sample: { size: count } }]);

    const response = questions.map(q => ({
      id: q._id,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching random questions:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
