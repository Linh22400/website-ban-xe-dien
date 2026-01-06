/**
 * Check actual column names in Supabase PostgreSQL
 * Run: node scripts/check-supabase-columns.js
 */

require('dotenv').config(); // Use .env instead of .env.production
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkColumns() {
    try {
        console.log('🔍 Checking Supabase tables and columns...\n');

        // First, list all tables
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `);

        console.log(`📊 Found ${tablesResult.rows.length} tables in database:\n`);
        tablesResult.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });

        // Now check specific tables
        const tables = [
            'categories',
            'car_models',
            'showrooms',
            'promotions',
            'accessories',
            'article_categories',
            'articles'
        ];

        console.log('\n\n📋 Checking column details:\n');

        for (const table of tables) {
            try {
                const result = await pool.query(`
                    SELECT column_name, data_type, is_nullable
                    FROM information_schema.columns
                    WHERE table_name = $1 AND table_schema = 'public'
                    ORDER BY ordinal_position
                `, [table]);

                if (result.rows.length > 0) {
                    console.log(`\n✅ Table: ${table}`);
                    console.log('─'.repeat(70));
                    result.rows.forEach(col => {
                        console.log(`  ${col.column_name.padEnd(35)} ${col.data_type.padEnd(20)} ${col.is_nullable}`);
                    });
                } else {
                    console.log(`\n❌ Table ${table} - Not found`);
                }
            } catch (err) {
                console.log(`\n❌ Table ${table} - Error: ${err.message}`);
            }
        }

        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkColumns();
