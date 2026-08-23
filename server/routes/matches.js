const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/matches
// @desc    Get matches (optional filter by tournament_id or status)
router.get('/', protect, async (req, res) => {
  try {
    const { tournament_id, status } = req.query;
    const filter = {};
    if (tournament_id) filter.tournament = tournament_id;
    if (status) filter.status = status;

    const matches = await Match.find(filter)
      .populate('tournament', 'name sport')
      .populate('team1', 'teamName')
      .populate('team2', 'teamName')
      .populate('winner', 'teamName')
      .sort({ matchDate: 1, matchTime: 1 });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/matches
// @desc    Schedule a match (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      tournament_id,
      team1_id,
      team2_id,
      match_date,
      match_time,
      venue,
      stream_url,
      round_number
    } = req.body;

    if (!tournament_id || !team1_id || !team2_id || !match_date || !match_time || !venue) {
      return res.status(400).json({ message: 'All required match fields must be provided' });
    }

    if (team1_id === team2_id) {
      return res.status(400).json({ message: 'Team 1 and Team 2 must be different teams' });
    }

    const match = await Match.create({
      tournament: tournament_id,
      team1: team1_id,
      team2: team2_id,
      matchDate: match_date,
      matchTime: match_time,
      venue: venue.trim(),
      streamUrl: stream_url ? stream_url.trim() : null,
      roundNumber: round_number ? parseInt(round_number) : 1,
      status: 'Upcoming'
    });

    const populatedMatch = await Match.findById(match._id)
      .populate('tournament', 'name sport')
      .populate('team1', 'teamName')
      .populate('team2', 'teamName');

    res.status(201).json(populatedMatch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/matches/:id/score
// @desc    Record match score and set winner (Admin only)
router.put('/:id/score', protect, adminOnly, async (req, res) => {
  try {
    const { score1, score2, status } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const s1 = parseInt(score1) || 0;
    const s2 = parseInt(score2) || 0;

    match.score1 = s1;
    match.score2 = s2;
    match.status = status || 'Completed';

    if (s1 > s2) {
      match.winner = match.team1;
    } else if (s2 > s1) {
      match.winner = match.team2;
    } else {
      match.winner = null; // Tied
    }

    await match.save();

    const updatedMatch = await Match.findById(match._id)
      .populate('tournament', 'name sport')
      .populate('team1', 'teamName')
      .populate('team2', 'teamName')
      .populate('winner', 'teamName');

    res.json(updatedMatch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
