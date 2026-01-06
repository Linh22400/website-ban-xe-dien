/**
 * Clean up duplicate car models - keep only records with document_id
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function cleanup() {
    console.log('🧹 Cleaning up duplicate car models...\n');
    
    try {
        // Delete records without document_id (old imports)
        const deleteQuery = `
            DELETE FROM car_models 
            WHERE document_id IS NULL 
            RETURNING id, name
        `;
        
        const result = await pool.query(deleteQuery);
        
        console.log(`✅ Deleted ${result.rowCount} old records without document_id:`);
        result.rows.forEach(row => {
            console.log(`  🗑️  ${row.name} (ID: ${row.id})`);
        });
        
        // Show remaining records
        const checkQuery = 'SELECT id, name, document_id, locale FROM car_models ORDER BY id';
        const checkResult = await pool.query(checkQuery);
        
        console.log(`\n✅ Remaining ${checkResult.rowCount} valid records:`);
        checkResult.rows.forEach(row => {
            console.log(`  ✓ ${row.name} (ID: ${row.id}, Locale: ${row.locale})`);
        });
        
        console.log('\n🎉 Cleanup complete! Refresh Strapi Admin and try editing now.');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

cleanup();
