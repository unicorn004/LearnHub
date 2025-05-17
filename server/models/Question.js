const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [arrayLimit, '{PATH} must have exactly 4 options'],
    required: true,
  },
  correctAnswerIndex: {
    type: Number,
    min: 0,
    max: 3,
    required: true,
  },
}, { timestamps: true });

function arrayLimit(val) {
  return val.length === 4;
}

module.exports = mongoose.model('Question', questionSchema);
