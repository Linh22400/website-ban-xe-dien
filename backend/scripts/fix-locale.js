/**
 * Fix locale field for existing car models
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixLocale() {
    console.log('🔧 Fixing locale field for car models...\n');
    
    try {
        // Check current data
        const checkQuery = 'SELECT id, name, locale, document_id FROM car_models ORDER BY id';
        const checkResult = await pool.query(checkQuery);
        
        console.log('📊 Current car models:');
        checkResult.rows.forEach(row => {
            console.log(`  ID: ${row.id}, Name: ${row.name}, Locale: ${row.locale || 'NULL'}, DocID: ${row.document_id}`);
        });
        
        // Update locale to 'en' for all rows where locale is NULL
        const updateQuery = `
            UPDATE car_models 
            SET locale = 'en' 
            WHERE locale IS NULL 
            RETURNING id, name, locale
        `;
        
        const updateResult = await pool.query(updateQuery);
        
        console.log(`\n✅ Updated ${updateResult.rowCount} records with locale='en'`);
        
        if (updateResult.rows.length > 0) {
            console.log('\nUpdated records:');
            updateResult.rows.forEach(row => {
                console.log(`  ✓ ${row.name} (ID: ${row.id})`);
            });
        }
        
        console.log('\n🎉 Done! Try editing in Strapi Admin now.');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

fixLocale();
