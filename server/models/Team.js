const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true
  },
  captain: {
    type: String,
    required: [true, 'Captain name is required'],
    trim: true
  },
  sport: {
    type: String,
    required: [true, 'Sport category is required'],
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', TeamSchema);
