/**
 * Delete all car models and reimport fresh TAILG data
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function resetData() {
    console.log('🗑️  Deleting all existing car models...\n');
    
    try {
        // Delete all car models
        const deleteQuery = 'DELETE FROM car_models';
        const deleteResult = await pool.query(deleteQuery);
        console.log(`✅ Deleted ${deleteResult.rowCount} records\n`);
        
        console.log('Now run: node scripts/import-tailg-to-db.js');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

resetData();
