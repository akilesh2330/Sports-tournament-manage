const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const Match = require('../models/Match');
const { protect } = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard metrics & recent lists
router.get('/stats', protect, async (req, res) => {
  try {
    const totalTournaments = await Tournament.countDocuments();
    const totalTeams = await Team.countDocuments();
    const upcomingMatchesCount = await Match.countDocuments({ status: { $in: ['Upcoming', 'Live'] } });
    const completedMatchesCount = await Match.countDocuments({ status: 'Completed' });

    const recentTournaments = await Tournament.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const upcomingMatches = await Match.find({ status: { $in: ['Upcoming', 'Live'] } })
      .populate('team1', 'teamName')
      .populate('team2', 'teamName')
      .populate('tournament', 'name')
      .sort({ matchDate: 1 })
      .limit(5);

    res.json({
      totalTournaments,
      totalTeams,
      upcomingMatchesCount,
      completedMatchesCount,
      recentTournaments,
      upcomingMatches
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
