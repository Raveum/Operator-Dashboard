const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  potentialBudget: {
    type: Number,
    required: true,
  },
  timelineToInvest: {
    type: Number,
    required: true,
  },
  brokerCode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Client', clientSchema);