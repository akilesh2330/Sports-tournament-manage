const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique registration per team per tournament
RegistrationSchema.index({ tournament: 1, team: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
