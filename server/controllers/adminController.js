const db = require('../config/db');

// Admin Dashboard statistics and overview
async function getDashboardStats(req, res) {
  try {
    const categories = await db.query('SELECT * FROM categories ORDER BY id ASC');
    const providers = await db.query(`
      SELECT p.*, c.name AS category_name, c.icon AS category_icon, u.email, u.phone
      FROM providers p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.user_id = u.id
      ORDER BY p.id ASC
    `);
    const customers = await db.query(`
      SELECT id, full_name, email, phone, locality, created_at
      FROM users
      WHERE role = 'customer'
      ORDER BY created_at DESC
    `);
    const requests = await db.query(`
      SELECT sr.*, p.name AS provider_name, u.full_name AS customer_name
      FROM service_requests sr
      JOIN providers p ON sr.provider_id = p.id
      JOIN users u ON sr.customer_id = u.id
      ORDER BY sr.created_at DESC
    `);

    return res.json({
      success: true,
      stats: {
        totalCategories: categories.length, // Strictly 3
        totalProviders: providers.length,   // Strictly 3
        totalCustomers: customers.length,
        totalRequests: requests.length,
      },
      categories,
      providers,
      customers,
      requests,
    });
  } catch (err) {
    console.error('getDashboardStats error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin dashboard stats.',
    });
  }
}

// Admin toggle provider active/deactivated status
async function toggleProviderStatus(req, res) {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const rows = await db.query('SELECT * FROM providers WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found.',
      });
    }

    const newStatus = Boolean(is_active);
    await db.query('UPDATE providers SET is_active = ? WHERE id = ?', [newStatus ? 1 : 0, id]);

    return res.json({
      success: true,
      message: `Provider status set to ${newStatus ? 'Approved & Active' : 'Deactivated'}.`,
      is_active: newStatus,
    });
  } catch (err) {
    console.error('toggleProviderStatus error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update provider status.',
    });
  }
}

module.exports = {
  getDashboardStats,
  toggleProviderStatus,
};
