const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/registrations
// @desc    Get all registrations (Admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const pendingRegs = await Registration.find({ status: 'Pending' })
      .populate('tournament', 'name sport')
      .populate('team', 'teamName captain');

    const allRegs = await Registration.find()
      .populate('tournament', 'name sport')
      .populate('team', 'teamName captain')
      .sort({ registeredAt: -1 });

    res.json({ pendingRegs, allRegs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/registrations/:id/status
// @desc    Approve or Reject a registration (Admin only)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const reg = await Registration.findById(req.params.id)
      .populate('team', 'teamName');

    if (!reg) {
      return res.status(404).json({ message: 'Registration request not found' });
    }

    if (action === 'approve') {
      reg.status = 'Approved';
    } else if (action === 'reject') {
      reg.status = 'Rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action parameter' });
    }

    await reg.save();
    res.json(reg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
