const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', providerController.getProviders);
router.get('/:id', providerController.getProviderById);
router.patch('/:id/availability', authenticateToken, requireRole('provider', 'admin'), providerController.updateAvailability);

module.exports = router;
