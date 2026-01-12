const { Client } = require('pg');
require('dotenv').config();

async function findTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
        AND (table_name LIKE '%permission%' OR table_name LIKE '%role%')
      ORDER BY table_name
    `);
    
    console.log('📋 Permission/Role related tables:\n');
    result.rows.forEach(t => console.log('  -', t.table_name));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

findTables();
