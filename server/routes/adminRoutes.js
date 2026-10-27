const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/stats', authenticateToken, requireRole('admin'), adminController.getDashboardStats);
router.patch('/providers/:id/status', authenticateToken, requireRole('admin'), adminController.toggleProviderStatus);

module.exports = router;
