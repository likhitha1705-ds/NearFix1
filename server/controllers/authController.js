const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Customer Registration
async function register(req, res) {
  try {
    const { full_name, email, phone, locality, password, confirm_password } = req.body;

    // 1. Validation
    if (!full_name || !email || !phone || !password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    // 2. Check if user already exists
    const existing = await db.query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userLocality = locality && locality.trim() ? locality.trim() : 'Andheri West, Mumbai';

    const registrationRole = req.body.role === 'provider' ? 'provider' : 'customer';
    const { service_category, experience_years, description } = req.body;

    if (registrationRole === 'provider' && !service_category) {
      return res.status(400).json({
        success: false,
        message: 'Please select your service category (Electrician, Plumber, or AC Repair).',
      });
    }

    // 4. Insert new user
    const result = await db.query(
      'INSERT INTO users (full_name, email, password_hash, phone, role, locality) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name.trim(), email.trim().toLowerCase(), passwordHash, phone.trim(), registrationRole, userLocality]
    );

    const userId = result.insertId || result[0]?.insertId;
    let providerProfile = null;

    // 5. If provider, create matching provider profile
    if (registrationRole === 'provider') {
      const catRows = await db.query('SELECT id FROM categories WHERE name = ?', [service_category]);
      const categoryId = catRows && catRows.length > 0
        ? catRows[0].id
        : (service_category === 'Plumber' ? 2 : service_category === 'AC Repair' ? 3 : 1);

      const provResult = await db.query(
        'INSERT INTO providers (user_id, category_id, name, service_category, locality, city, experience_years, description, availability_status, is_active, demo_phone, demo_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          userId,
          categoryId,
          full_name.trim(),
          service_category,
          userLocality,
          'Mumbai, Maharashtra',
          parseInt(experience_years, 10) || 2,
          description ? description.trim() : `${service_category} installation and repair services.`,
          'Available',
          1,
          phone.trim(),
          email.trim().toLowerCase(),
        ]
      );

      const provId = provResult.insertId || provResult[0]?.insertId;
      providerProfile = {
        id: provId,
        user_id: userId,
        category_id: categoryId,
        name: full_name.trim(),
        service_category,
        locality: userLocality,
        city: 'Mumbai, Maharashtra',
        experience_years: parseInt(experience_years, 10) || 2,
        description: description ? description.trim() : `${service_category} installation and repair services.`,
        availability_status: 'Available',
        is_active: 1,
        demo_phone: phone.trim(),
        demo_email: email.trim().toLowerCase(),
      };
    }

    const payload = {
      id: userId,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      role: registrationRole,
      locality: userLocality,
      provider_id: providerProfile ? providerProfile.id : null,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: registrationRole === 'provider'
        ? 'Service Provider account created successfully! Welcome to NearFix.'
        : 'Registration successful! Welcome to NearFix.',
      token,
      user: {
        id: userId,
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role: registrationRole,
        locality: userLocality,
        providerProfile,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.',
    });
  }
}

// User Login (Supports Admin, Customer, Service Provider)
async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and role are required.',
      });
    }

    // Normalize role string: "Service Provider" -> "provider", "Admin" -> "admin", "Customer" -> "customer"
    let normalizedRole = role.toLowerCase().trim();
    if (normalizedRole.includes('provider')) {
      normalizedRole = 'provider';
    }

    // 1. Fetch user from DB
    const users = await db.query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const user = users[0];

    // 2. Validate role
    if (user.role !== normalizedRole) {
      return res.status(403).json({
        success: false,
        message: `Account found, but it is not registered as a "${role}". Please select the correct role.`,
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 4. If provider, fetch their provider profile id
    let providerProfile = null;
    if (user.role === 'provider') {
      const provRows = await db.query('SELECT * FROM providers WHERE user_id = ?', [user.id]);
      if (provRows && provRows.length > 0) {
        providerProfile = provRows[0];
      }
    }

    // 5. Generate token
    const payload = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      locality: user.locality,
      provider_id: providerProfile ? providerProfile.id : null,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      message: `Welcome back, ${user.full_name}!`,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        locality: user.locality,
        providerProfile,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
    });
  }
}

// Get current logged-in user profile
async function getMe(req, res) {
  try {
    const users = await db.query('SELECT id, full_name, email, role, phone, locality, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    const user = users[0];
    let providerProfile = null;
    if (user.role === 'provider') {
      const provRows = await db.query('SELECT * FROM providers WHERE user_id = ?', [user.id]);
      if (provRows && provRows.length > 0) {
        providerProfile = provRows[0];
      }
    }

    return res.json({
      success: true,
      user: {
        ...user,
        providerProfile,
      },
    });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user profile.',
    });
  }
}

module.exports = {
  register,
  login,
  getMe,
};
