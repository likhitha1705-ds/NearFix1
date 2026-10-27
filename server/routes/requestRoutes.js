const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, requireRole('customer'), requestController.createRequest);
router.get('/customer', authenticateToken, requireRole('customer'), requestController.getCustomerRequests);
router.get('/provider', authenticateToken, requireRole('provider'), requestController.getProviderRequests);
router.patch('/:id/status', authenticateToken, requireRole('provider', 'admin'), requestController.updateRequestStatus);

module.exports = router;
