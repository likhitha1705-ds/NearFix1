const db = require('../config/db');

// Customer creates a service request
async function createRequest(req, res) {
  try {
    const customer_id = req.user.id;
    const { provider_id, service_category, preferred_date, locality, description } = req.body;

    if (!provider_id || !service_category || !preferred_date || !locality || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required to request a service.',
      });
    }

    // Verify provider exists
    const providers = await db.query('SELECT * FROM providers WHERE id = ?', [provider_id]);
    if (!providers || providers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Selected provider does not exist.',
      });
    }

    const result = await db.query(
      'INSERT INTO service_requests (customer_id, provider_id, service_category, preferred_date, locality, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customer_id, provider_id, service_category, preferred_date, locality, description, 'Pending']
    );

    const requestId = result.insertId || result[0]?.insertId;

    return res.status(201).json({
      success: true,
      message: 'Service request submitted successfully! The provider will contact you shortly.',
      requestId,
    });
  } catch (err) {
    console.error('createRequest error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create service request.',
    });
  }
}

// Get requests for the logged-in customer
async function getCustomerRequests(req, res) {
  try {
    const customer_id = req.user.id;
    const sql = `
      SELECT sr.*, p.name AS provider_name, p.demo_phone AS provider_phone, p.demo_email AS provider_email
      FROM service_requests sr
      JOIN providers p ON sr.provider_id = p.id
      WHERE sr.customer_id = ?
      ORDER BY sr.created_at DESC
    `;
    const requests = await db.query(sql, [customer_id]);

    return res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err) {
    console.error('getCustomerRequests error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve service requests.',
    });
  }
}

// Get requests for the logged-in service provider
async function getProviderRequests(req, res) {
  try {
    // Find provider record for this user
    const provRows = await db.query('SELECT id FROM providers WHERE user_id = ?', [req.user.id]);
    if (!provRows || provRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not linked to this account.',
      });
    }

    const providerId = provRows[0].id;
    const sql = `
      SELECT sr.*, u.full_name AS customer_name, u.phone AS customer_phone, u.email AS customer_email
      FROM service_requests sr
      JOIN users u ON sr.customer_id = u.id
      WHERE sr.provider_id = ?
      ORDER BY sr.created_at DESC
    `;
    const requests = await db.query(sql, [providerId]);

    return res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err) {
    console.error('getProviderRequests error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve incoming requests.',
    });
  }
}

// Update request status (Provider can accept/complete/cancel)
async function updateRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['Pending', 'Accepted', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
      });
    }

    await db.query('UPDATE service_requests SET status = ? WHERE id = ?', [status, id]);

    return res.json({
      success: true,
      message: `Request status updated to "${status}".`,
    });
  } catch (err) {
    console.error('updateRequestStatus error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update request status.',
    });
  }
}

module.exports = {
  createRequest,
  getCustomerRequests,
  getProviderRequests,
  updateRequestStatus,
};
