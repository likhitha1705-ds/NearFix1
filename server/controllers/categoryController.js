const db = require('../config/db');

// Get all service categories (Strictly 3 fixed services in Mumbai)
async function getCategories(req, res) {
  try {
    const categories = await db.query('SELECT * FROM categories ORDER BY id ASC');
    return res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (err) {
    console.error('getCategories error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve service categories.',
    });
  }
}

module.exports = {
  getCategories,
};
