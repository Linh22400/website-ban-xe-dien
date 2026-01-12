const { Client } = require('pg');
require('dotenv').config();

async function checkPermissionsTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    await client.connect();
    
    console.log('🔍 Checking up_permissions table structure...\n');
    
    // Get columns
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'up_permissions'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Columns:');
    columnsResult.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Get sample data
    const sampleResult = await client.query(`
      SELECT * FROM up_permissions LIMIT 5
    `);
    
    console.log('\n📝 Sample permissions:');
    sampleResult.rows.forEach((row, i) => {
      console.log(`\n  Permission ${i + 1}:`);
      Object.entries(row).forEach(([key, value]) => {
        console.log(`    ${key}: ${value}`);
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkPermissionsTable();
