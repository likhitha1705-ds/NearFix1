const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nearfix',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let isConnected = false;

// Fallback in-memory data store matching MySQL seed exactly
// Used gracefully only if MySQL credentials are pending or database is not yet initialized
const memoryStore = {
  users: [
    {
      id: 1,
      full_name: 'System Administrator',
      email: 'admin@nearfix.in',
      password_hash: '$2a$10$UTzSNxFHPbObPEhGQ9abY.FnwhoXzUIophGKTr3BtDva9KPXRXbom', // Admin@123
      phone: '+91 98200 00001',
      role: 'admin',
      locality: 'Mumbai, Maharashtra',
      created_at: new Date(),
    },
    // Electricians
    {
      id: 2,
      full_name: 'Rahul Sharma',
      email: 'rahul.sharma@nearfix.in',
      password_hash: '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', // Provider@123
      phone: '+91 98200 11001',
      role: 'provider',
      locality: 'Andheri West, Mumbai',
      created_at: new Date(),
    },
    {
      id: 3,
      full_name: 'Kiran Verma',
      email: 'kiran.verma@nearfix.in',
      password_hash: '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', // Provider@123
      phone: '+91 98200 11002',
      role: 'provider',
      locality: 'Bandra West, Mumbai',
      created_at: new Date(),
    },
    {
      id: 4,
      full_name: 'Sanjay Rao',
      email: 'sanjay.rao@nearfix.in',
      password_hash: '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', // Provider@123
      phone: '+91 98200 11003',
      role: 'provider',
      locality: 'Dadar, Mumbai',
      created_at: new Date(),
    },
    // Plumbers
    {
      id: 5,
      full_name: 'Amit Patil',
      email: 'amit.patil@nearfix.in',
      password_hash: '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', // Provider@123
      phone: '+91 98200 22001',
      role: 'provider',
      locality: 'Dadar, Mumbai',
      created_at: new Date(),
    },
    {
      id: 6,
      full_name: 'Ganesh Shinde',
      email: 'ganesh.shinde@nearfix.in',
      password_hash: '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', // Provider@123
      phone: '+91 98200 22002',
      role: 'provider',
      locality: 'Andheri West, Mumbai',
      created_at: new Date(),
    },
    {
      id: 7,
      full_name: 'Prashant More',
      email: 'prashant.more@nearfix.in',
      password_hash: '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', // Provider@123
      phone: '+91 98200 22003',
      role: 'provider',
      locality: 'Bandra West, Mumbai',
      created_at: new Date(),
    },
    // AC Repair
    {
      id: 8,
      full_name: 'Neha Deshmukh',
      email: 'neha.deshmukh@nearfix.in',
      password_hash: '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', // Provider@123
      phone: '+91 98200 33001',
      role: 'provider',
      locality: 'Bandra West, Mumbai',
      created_at: new Date(),
    },
    {
      id: 9,
      full_name: 'Sameer Khan',
      email: 'sameer.khan@nearfix.in',
      password_hash: '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', // Provider@123
      phone: '+91 98200 33002',
      role: 'provider',
      locality: 'Andheri West, Mumbai',
      created_at: new Date(),
    },
    {
      id: 10,
      full_name: 'Vikram Joshi',
      email: 'vikram.joshi@nearfix.in',
      password_hash: '$2a$10$GekRa8RC4Q.t/fl15obNvOVXoPEr65xmlWbW5IonuMF8RAd1lEVQO', // Provider@123
      phone: '+91 98200 33003',
      role: 'provider',
      locality: 'Dadar, Mumbai',
      created_at: new Date(),
    },
    // Customer
    {
      id: 11,
      full_name: 'Pooja Kulkarni',
      email: 'customer@demo.in',
      password_hash: '$2a$10$KCoqU1ma2oKkSDd.P0HAXugHSfkOvw4zho2aiWYqEAet6eKY7pTf6', // Customer@123
      phone: '+91 98200 44004',
      role: 'customer',
      locality: 'Andheri West, Mumbai',
      created_at: new Date(),
    },
  ],
  categories: [
    {
      id: 1,
      name: 'Electrician',
      slug: 'electrician',
      description: 'Electrical installation and repair.',
      icon: '⚡',
    },
    {
      id: 2,
      name: 'Plumber',
      slug: 'plumber',
      description: 'Water leaks, taps, and pipe repairs.',
      icon: '🔧',
    },
    {
      id: 3,
      name: 'AC Repair',
      slug: 'ac-repair',
      description: 'Air-conditioner servicing and repair.',
      icon: '❄️',
    },
  ],
  providers: [
    // 3 Electricians
    {
      id: 1,
      user_id: 2,
      category_id: 1,
      name: 'Rahul Sharma',
      service_category: 'Electrician',
      locality: 'Andheri West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 3,
      description: 'Electrical installation, wiring checks, and minor electrical repairs.',
      availability_status: 'Available',
      is_active: 1,
      demo_phone: '+91 98200 11001',
      demo_email: 'rahul.sharma@nearfix.in',
    },
    {
      id: 2,
      user_id: 3,
      category_id: 1,
      name: 'Kiran Verma',
      service_category: 'Electrician',
      locality: 'Bandra West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 5,
      description: 'Residential and commercial wiring diagnostics, MCB replacement, and fixture setups.',
      availability_status: 'Available',
      is_active: 1,
      demo_phone: '+91 98200 11002',
      demo_email: 'kiran.verma@nearfix.in',
    },
    {
      id: 3,
      user_id: 4,
      category_id: 1,
      name: 'Sanjay Rao',
      service_category: 'Electrician',
      locality: 'Dadar, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 4,
      description: 'Home inverter installations, circuit breaker troubleshooting, and lighting maintenance.',
      availability_status: 'Available',
      is_active: 1,
      demo_phone: '+91 98200 11003',
      demo_email: 'sanjay.rao@nearfix.in',
    },

    // 3 Plumbers
    {
      id: 4,
      user_id: 5,
      category_id: 2,
      name: 'Amit Patil',
      service_category: 'Plumber',
      locality: 'Dadar, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 4,
      description: 'Tap repairs, water leakage, and basic pipe maintenance.',
      availability_status: 'Available',
      is_active: 1,
      demo_phone: '+91 98200 22001',
      demo_email: 'amit.patil@nearfix.in',
    },
    {
      id: 5,
      user_id: 6,
      category_id: 2,
      name: 'Ganesh Shinde',
      service_category: 'Plumber',
      locality: 'Andheri West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 6,
      description: 'Bathroom fittings, pipeline leakage inspection, and water pressure motor maintenance.',
      availability_status: 'Available',
      is_active: 1,
      demo_phone: '+91 98200 22002',
      demo_email: 'ganesh.shinde@nearfix.in',
    },
    {
      id: 6,
      user_id: 7,
      category_id: 2,
      name: 'Prashant More',
      service_category: 'Plumber',
      locality: 'Bandra West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 3,
      description: 'Kitchen sink drainage unclogging, geyser pipeline connections, and valve repairs.',
      availability_status: 'Available',
      is_active: 1,
      demo_phone: '+91 98200 22003',
      demo_email: 'prashant.more@nearfix.in',
    },

    // 3 AC Repairs
    {
      id: 7,
      user_id: 8,
      category_id: 3,
      name: 'Neha Deshmukh',
      service_category: 'AC Repair',
      locality: 'Bandra West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 3,
      description: 'AC cleaning, routine servicing, and basic cooling issue checks.',
      availability_status: 'Available',
      is_active: 1,
      demo_phone: '+91 98200 33001',
      demo_email: 'neha.deshmukh@nearfix.in',
    },
    {
      id: 8,
      user_id: 9,
      category_id: 3,
      name: 'Sameer Khan',
      service_category: 'AC Repair',
      locality: 'Andheri West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 5,
      description: 'Split and window AC gas refilling, compressor diagnostics, and filter sanitization.',
      availability_status: 'Available',
      is_active: 1,
      demo_phone: '+91 98200 33002',
      demo_email: 'sameer.khan@nearfix.in',
    },
    {
      id: 9,
      user_id: 10,
      category_id: 3,
      name: 'Vikram Joshi',
      service_category: 'AC Repair',
      locality: 'Dadar, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 4,
      description: 'Copper piping repair, PCB board troubleshooting, and seasonal preventive maintenance.',
      availability_status: 'Available',
      is_active: 1,
      demo_phone: '+91 98200 33003',
      demo_email: 'vikram.joshi@nearfix.in',
    },
  ],
  service_requests: [
    {
      id: 1,
      customer_id: 11,
      provider_id: 1,
      service_category: 'Electrician',
      preferred_date: '2026-10-18',
      locality: 'Andheri West, Mumbai',
      description: 'MCB tripping issue and inspection of living room switchboard.',
      status: 'Pending',
      created_at: new Date('2026-10-17T10:00:00.000Z'),
    },
  ],
};

async function initPool() {
  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log(`[NearFix] Connected to MySQL database "${dbConfig.database}" at ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    isConnected = true;
  } catch (err) {
    console.warn(`[NearFix] MySQL Connection notice: ${err.message}`);
    console.warn(`[NearFix] Operating in fallback memory-synced mode until MySQL is configured in server/.env`);
    isConnected = false;
  }
}

// Initial connection attempt
initPool();

// Generic query helper that runs parameterized SQL on MySQL when available,
// or safely services memory store if MySQL is pending configuration
async function query(sql, params = []) {
  if (isConnected && pool) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows;
    } catch (err) {
      console.error(`[NearFix MySQL Query Error] ${err.message}`);
      throw err;
    }
  }

  // Fallback simulator for college demonstration if DB not yet imported
  return handleMemoryQuery(sql, params);
}

function handleMemoryQuery(sql, params = []) {
  const cleanSql = sql.trim().toUpperCase();

  // 1. Categories
  if (cleanSql.includes('FROM CATEGORIES')) {
    if (cleanSql.includes('WHERE NAME = ?')) {
      const catName = String(params[0] || '').toLowerCase().trim();
      return memoryStore.categories.filter((c) => c.name.toLowerCase() === catName);
    }
    if (cleanSql.includes('WHERE ID = ?')) {
      const catId = Number(params[0]);
      return memoryStore.categories.filter((c) => c.id === catId);
    }
    return memoryStore.categories;
  }

  // 2. Users
  if (cleanSql.startsWith('INSERT INTO USERS')) {
    const newUser = {
      id: memoryStore.users.length + 1,
      full_name: params[0],
      email: String(params[1]).trim().toLowerCase(),
      password_hash: params[2],
      phone: params[3],
      role: params[4] || 'customer',
      locality: params[5] || 'Mumbai, Maharashtra',
      created_at: new Date(),
    };
    memoryStore.users.push(newUser);
    return { insertId: newUser.id };
  }

  if (cleanSql.includes('FROM USERS')) {
    if (cleanSql.includes('WHERE EMAIL = ?')) {
      const email = String(params[0] || '').toLowerCase().trim();
      const normalized = email.replace('@demo.', '@');
      const user = memoryStore.users.find(
        (u) =>
          u.email.toLowerCase() === email ||
          u.email.toLowerCase().replace('@demo.', '@') === normalized
      );
      return user ? [user] : [];
    }

    if (cleanSql.includes('WHERE ID = ?') || cleanSql.includes('WHERE U.ID = ?')) {
      const id = Number(params[0]);
      const user = memoryStore.users.find((u) => u.id === id);
      return user ? [user] : [];
    }

    if (
      cleanSql.includes('WHERE ROLE =') ||
      cleanSql.includes('WHERE ROLE=') ||
      cleanSql.includes('ROLE = ?')
    ) {
      let role = '';
      if (cleanSql.includes('ROLE = ?')) {
        role = String(params[0] || '').toLowerCase().trim();
      } else if (cleanSql.includes("'CUSTOMER'")) {
        role = 'customer';
      } else if (cleanSql.includes("'PROVIDER'")) {
        role = 'provider';
      } else if (cleanSql.includes("'ADMIN'")) {
        role = 'admin';
      }

      return memoryStore.users
        .filter((u) => !role || u.role.toLowerCase() === role)
        .map(({ password_hash, ...rest }) => rest)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return memoryStore.users.map(({ password_hash, ...rest }) => rest);
  }

  // 3. Providers
  if (cleanSql.startsWith('INSERT INTO PROVIDERS')) {
    const newProvider = {
      id: memoryStore.providers.length + 1,
      user_id: Number(params[0]),
      category_id: Number(params[1]),
      name: params[2],
      service_category: params[3],
      locality: params[4],
      city: params[5] || 'Mumbai, Maharashtra',
      experience_years: Number(params[6]) || 1,
      description: params[7],
      availability_status: params[8] || 'Available',
      is_active: params[9] !== undefined ? (params[9] ? 1 : 0) : 1,
      demo_phone: params[10],
      demo_email: params[11],
      created_at: new Date(),
    };
    memoryStore.providers.push(newProvider);
    return { insertId: newProvider.id };
  }

  if (cleanSql.startsWith('UPDATE PROVIDERS SET AVAILABILITY_STATUS = ? WHERE ID = ?')) {
    const [status, id] = params;
    const provider = memoryStore.providers.find((p) => p.id === Number(id));
    if (provider) provider.availability_status = status;
    return { affectedRows: provider ? 1 : 0 };
  }

  if (cleanSql.startsWith('UPDATE PROVIDERS SET IS_ACTIVE = ? WHERE ID = ?')) {
    const [isActive, id] = params;
    const provider = memoryStore.providers.find((p) => p.id === Number(id));
    if (provider) provider.is_active = isActive ? 1 : 0;
    return { affectedRows: provider ? 1 : 0 };
  }

  if (cleanSql.includes('FROM PROVIDERS')) {
    // 3a. Query by provider primary ID: WHERE p.id = ? or WHERE id = ?
    if (cleanSql.includes('P.ID = ?') || cleanSql.includes('WHERE ID = ?')) {
      const targetId = Number(params[0]);
      const provider = memoryStore.providers.find((p) => p.id === targetId);
      if (!provider) return [];
      const cat = memoryStore.categories.find((c) => c.id === provider.category_id);
      const user = memoryStore.users.find((u) => u.id === provider.user_id) || {};
      return [
        {
          ...provider,
          category_name: cat ? cat.name : provider.service_category,
          category_icon: cat ? cat.icon : '🛠️',
          email: provider.demo_email || user.email,
          phone: provider.demo_phone || user.phone,
        },
      ];
    }

    // 3b. Query by user_id: WHERE p.user_id = ? or WHERE user_id = ?
    if (cleanSql.includes('USER_ID = ?') || cleanSql.includes('P.USER_ID = ?')) {
      const targetUserId = Number(params[0]);
      const provider = memoryStore.providers.find((p) => p.user_id === targetUserId);
      if (!provider) return [];
      const cat = memoryStore.categories.find((c) => c.id === provider.category_id);
      const user = memoryStore.users.find((u) => u.id === provider.user_id) || {};
      return [
        {
          ...provider,
          category_name: cat ? cat.name : provider.service_category,
          category_icon: cat ? cat.icon : '🛠️',
          email: provider.demo_email || user.email,
          phone: provider.demo_phone || user.phone,
        },
      ];
    }

    // 3c. List providers with optional filters (service, locality, active)
    let result = memoryStore.providers.map((p) => {
      const cat = memoryStore.categories.find((c) => c.id === p.category_id);
      const user = memoryStore.users.find((u) => u.id === p.user_id) || {};
      return {
        ...p,
        category_name: cat ? cat.name : p.service_category,
        category_icon: cat ? cat.icon : '🛠️',
        email: p.demo_email || user.email,
        phone: p.demo_phone || user.phone,
      };
    });

    if (cleanSql.includes('IS_ACTIVE = TRUE') || cleanSql.includes('IS_ACTIVE = 1')) {
      result = result.filter((p) => Boolean(p.is_active));
    }

    let paramIdx = 0;
    if (cleanSql.includes('SERVICE_CATEGORY = ?') && params[paramIdx] !== undefined) {
      const s = params[paramIdx++];
      if (s && s !== 'All') {
        result = result.filter((p) => p.service_category.toLowerCase() === s.toLowerCase());
      }
    }
    if (cleanSql.includes('LOCALITY LIKE ?') && params[paramIdx] !== undefined) {
      const rawLoc = params[paramIdx++].replace(/%/g, '').trim().toLowerCase();
      if (rawLoc && rawLoc !== 'all' && rawLoc !== 'mumbai') {
        result = result.filter((p) => p.locality.toLowerCase().includes(rawLoc));
      }
    }

    return result;
  }

  // 4. Service Requests
  if (cleanSql.startsWith('INSERT INTO SERVICE_REQUESTS')) {
    const newReq = {
      id: memoryStore.service_requests.length + 1,
      customer_id: Number(params[0]),
      provider_id: Number(params[1]),
      service_category: params[2],
      preferred_date: params[3],
      locality: params[4],
      description: params[5],
      status: 'Pending',
      created_at: new Date(),
    };
    memoryStore.service_requests.push(newReq);
    return { insertId: newReq.id };
  }

  if (cleanSql.startsWith('UPDATE SERVICE_REQUESTS SET STATUS = ? WHERE ID = ?')) {
    const [status, id] = params;
    const req = memoryStore.service_requests.find((r) => r.id === Number(id));
    if (req) req.status = status;
    return { affectedRows: req ? 1 : 0 };
  }

  if (cleanSql.includes('FROM SERVICE_REQUESTS')) {
    if (cleanSql.includes('CUSTOMER_ID = ?') || cleanSql.includes('SR.CUSTOMER_ID = ?')) {
      const customerId = Number(params[0]);
      return memoryStore.service_requests
        .filter((r) => r.customer_id === customerId)
        .map((r) => {
          const prov = memoryStore.providers.find((p) => p.id === r.provider_id) || {};
          return {
            ...r,
            provider_name: prov.name || 'Service Provider',
            provider_phone: prov.demo_phone || '',
            provider_email: prov.demo_email || '',
          };
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (cleanSql.includes('PROVIDER_ID = ?') || cleanSql.includes('SR.PROVIDER_ID = ?')) {
      const providerId = Number(params[0]);
      return memoryStore.service_requests
        .filter((r) => r.provider_id === providerId)
        .map((r) => {
          const cust = memoryStore.users.find((u) => u.id === r.customer_id) || {};
          return {
            ...r,
            customer_name: cust.full_name || 'Customer',
            customer_phone: cust.phone || '',
            customer_email: cust.email || '',
          };
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // All service requests for Admin dashboard
    return memoryStore.service_requests
      .map((r) => {
        const prov = memoryStore.providers.find((p) => p.id === r.provider_id) || {};
        const cust = memoryStore.users.find((u) => u.id === r.customer_id) || {};
        return {
          ...r,
          provider_name: prov.name || 'Service Provider',
          provider_phone: prov.demo_phone || '',
          customer_name: cust.full_name || 'Customer',
          customer_phone: cust.phone || '',
          customer_email: cust.email || '',
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return [];
}

module.exports = {
  query,
  getIsConnected: () => isConnected,
  getPool: () => pool,
  reconnect: initPool,
};
