const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Registration = require('../models/Registration');
const { protect } = require('../middleware/auth');

// @route   GET /api/teams
// @desc    Get teams (Admins view all, normal users view their owned teams)
router.get('/', protect, async (req, res) => {
  try {
    let teams;
    if (req.user.role === 'admin') {
      teams = await Team.find().populate('user', 'name email');
    } else {
      teams = await Team.find({ user: req.user._id });
    }
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/teams
// @desc    Create a new team
router.post('/', protect, async (req, res) => {
  try {
    const { teamName, captain, sport } = req.body;
    if (!teamName || !captain || !sport) {
      return res.status(400).json({ message: 'Team Name, Captain, and Sport are required' });
    }

    const team = await Team.create({
      teamName: teamName.trim(),
      captain: captain.trim(),
      sport: sport.trim(),
      user: req.user._id
    });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/teams/:id
// @desc    Delete a team
router.delete('/:id', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (req.user.role !== 'admin' && team.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    await Registration.deleteMany({ team: req.params.id });
    await team.deleteOne();

    res.json({ message: `Team "${team.teamName}" deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
