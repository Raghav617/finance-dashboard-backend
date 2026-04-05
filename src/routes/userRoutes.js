const express = require('express');
const User = require('../models/User');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect);
router.use(authorizeRoles('Admin')); // Admin strictly

// Get all users
router.get('/', async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ success: true, data: users });
});

// Update user role or status
router.put('/:id', async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role, isActive }, { new: true }).select('-password');
  res.json({ success: true, data: user });
});

module.exports = router;