const db = require('../config/db');

// Get providers with optional service and Mumbai locality filters
async function getProviders(req, res) {
  try {
    const { service, locality } = req.query;

    let sql = `
      SELECT p.*, c.name AS category_name, c.icon AS category_icon
      FROM providers p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
    `;
    const params = [];

    if (service && service !== 'All') {
      sql += ' AND p.service_category = ?';
      params.push(service);
    }

    if (locality && locality !== 'All' && locality.trim() !== '') {
      sql += ' AND p.locality LIKE ?';
      params.push(`%${locality.trim()}%`);
    }

    sql += ' ORDER BY p.id ASC';

    const providers = await db.query(sql, params);

    return res.json({
      success: true,
      count: providers.length,
      providers,
    });
  } catch (err) {
    console.error('getProviders error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve service providers.',
    });
  }
}

// Get provider details by ID
async function getProviderById(req, res) {
  try {
    const { id } = req.params;
    const providerId = parseInt(id, 10);

    const sql = `
      SELECT p.*, c.name AS category_name, c.icon AS category_icon
      FROM providers p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    const rows = await db.query(sql, [providerId]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found.',
      });
    }

    const provider = rows.find((p) => p.id === providerId) || rows[0];

    return res.json({
      success: true,
      provider,
    });
  } catch (err) {
    console.error('getProviderById error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve provider details.',
    });
  }
}

// Update provider availability (Authorized: Provider updates own profile or Admin)
async function updateAvailability(req, res) {
  try {
    const { id } = req.params;
    const { availability_status } = req.body;

    const allowedStatuses = ['Available', 'Busy', 'On Leave'];
    if (!allowedStatuses.includes(availability_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Available, Busy, or On Leave.',
      });
    }

    // Check ownership if user is a provider
    if (req.user.role === 'provider') {
      const rows = await db.query('SELECT * FROM providers WHERE id = ?', [id]);
      if (!rows || rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Provider profile not found.' });
      }
      if (rows[0].user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized. You can only update your own availability.',
        });
      }
    }

    await db.query('UPDATE providers SET availability_status = ? WHERE id = ?', [availability_status, id]);

    return res.json({
      success: true,
      message: `Availability updated to "${availability_status}" successfully.`,
      availability_status,
    });
  } catch (err) {
    console.error('updateAvailability error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update availability status.',
    });
  }
}

module.exports = {
  getProviders,
  getProviderById,
  updateAvailability,
};
