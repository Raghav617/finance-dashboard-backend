const express = require('express');
const { createRecord, getRecords, updateRecord, deleteRecord } = require('../controllers/recordController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

// Apply auth middleware to all routes below
router.use(protect);

// Viewers, Analysts, and Admins can read
router.get('/', authorizeRoles('Viewer', 'Analyst', 'Admin'), getRecords);

// Only Admins can modify data
router.post('/', authorizeRoles('Admin'), createRecord);
router.put('/:id', authorizeRoles('Admin'), updateRecord);
router.delete('/:id', authorizeRoles('Admin'), deleteRecord);

module.exports = router;