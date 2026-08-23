const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');
const Match = require('../models/Match');
const Team = require('../models/Team');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/tournaments
// @desc    Get all tournaments (optional status filter)
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const tournaments = await Tournament.find(filter).sort({ startDate: 1 });
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/tournaments
// @desc    Create a tournament (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, sport, location, startDate, endDate, maxTeams, status } = req.body;
    
    if (!name || !sport || !location || !startDate || !endDate) {
      return res.status(400).json({ message: 'All required tournament fields must be provided' });
    }

    const tournament = await Tournament.create({
      name: name.trim(),
      sport: sport.trim(),
      location: location.trim(),
      startDate,
      endDate,
      maxTeams: maxTeams || 8,
      status: status || 'Upcoming'
    });

    res.status(201).json(tournament);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/tournaments/:id
// @desc    Get tournament details by ID (including registrations and matches)
router.get('/:id', protect, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    const allRegistrations = await Registration.find({ tournament: req.params.id })
      .populate('team');
    
    const approvedRegistrations = allRegistrations.filter(r => r.status === 'Approved');

    const matches = await Match.find({ tournament: req.params.id })
      .populate('team1', 'teamName')
      .populate('team2', 'teamName')
      .populate('winner', 'teamName')
      .sort({ roundNumber: 1, matchDate: 1 });

    const userTeams = await Team.find({ user: req.user._id });

    res.json({
      tournament,
      allRegistrations,
      approvedRegistrations,
      matches,
      userTeams
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/tournaments/:id
// @desc    Update tournament details (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    const { name, sport, location, startDate, endDate, maxTeams, status } = req.body;

    if (name) tournament.name = name.trim();
    if (sport) tournament.sport = sport.trim();
    if (location) tournament.location = location.trim();
    if (startDate) tournament.startDate = startDate;
    if (endDate) tournament.endDate = endDate;
    if (maxTeams) tournament.maxTeams = maxTeams;
    if (status) tournament.status = status;

    const updated = await tournament.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/tournaments/:id
// @desc    Delete a tournament (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    await Registration.deleteMany({ tournament: req.params.id });
    await Match.deleteMany({ tournament: req.params.id });
    await tournament.deleteOne();

    res.json({ message: 'Tournament removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/tournaments/:id/register
// @desc    Register a team for a tournament
router.post('/:id/register', protect, async (req, res) => {
  try {
    const { teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ message: 'Team ID is required' });
    }

    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    const existing = await Registration.findOne({
      tournament: req.params.id,
      team: teamId
    });

    if (existing) {
      return res.status(400).json({ message: 'This team is already registered for this tournament' });
    }

    const registration = await Registration.create({
      tournament: req.params.id,
      team: teamId,
      status: 'Pending'
    });

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
