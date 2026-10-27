const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function initDatabase() {
  console.log('--- NearFix Database Initializer ---');
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT, 10) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'nearfix';

  console.log(`Connecting to MySQL at ${host}:${port} as user "${user}"...`);

  let connection;
  try {
    // Connect without specifying database initially, so we can create it
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true,
    });
    console.log('✓ Successfully connected to MySQL server.');

    // 1. Run schema.sql
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log(`Reading schema from ${schemaPath}...`);
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✓ Schema executed successfully. Tables created in "nearfix".');
    } else {
      console.error(`schema.sql not found at ${schemaPath}`);
    }

    // 2. Run seed.sql
    const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log(`Reading seed data from ${seedPath}...`);
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log('✓ Seed data imported successfully (3 categories, 3 provider profiles, demo users).');
    } else {
      console.error(`seed.sql not found at ${seedPath}`);
    }

    console.log('\nNearFix Database setup complete!');
    console.log('You can now start the server with: npm run dev');
  } catch (err) {
    console.error('\n✗ Error initializing MySQL database:');
    console.error(err.message);
    console.error('\nTips:');
    console.error('1. Make sure MySQL service is running.');
    console.error('2. Verify your DB_PASSWORD in server/.env.');
    console.error('3. Alternatively, open MySQL Workbench and run database/schema.sql and database/seed.sql directly.');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
