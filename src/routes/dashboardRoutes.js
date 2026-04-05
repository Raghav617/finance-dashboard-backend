const express = require('express');
const { getDashboardSummary } = require('../controllers/dashboardController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

// Analysts and Admins can view summaries (Viewers cannot)
router.get('/summary', protect, authorizeRoles('Analyst', 'Admin'), getDashboardSummary);

module.exports = router;