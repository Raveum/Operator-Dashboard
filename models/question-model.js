const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  brokerCode: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model('Question', questionSchema);
