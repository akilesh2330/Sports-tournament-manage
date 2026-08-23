const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  matchDate: {
    type: Date,
    required: true
  },
  matchTime: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  score1: {
    type: Number,
    default: 0
  },
  score2: {
    type: Number,
    default: 0
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Live', 'Completed'],
    default: 'Upcoming'
  },
  streamUrl: {
    type: String,
    default: null
  },
  roundNumber: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Match', MatchSchema);
