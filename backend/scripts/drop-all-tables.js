/**
 * DROP ALL TABLES in Supabase database
 * WARNING: This will delete ALL data!
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function dropAllTables() {
    console.log('⚠️  WARNING: This will DROP ALL TABLES and DATA!');
    console.log('Waiting 5 seconds... Press Ctrl+C to cancel\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
        console.log('🗑️  Dropping all tables...\n');
        
        // Drop all tables in public schema
        const query = `
            DO $$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                    RAISE NOTICE 'Dropped table: %', r.tablename;
                END LOOP;
            END $$;
        `;
        
        await pool.query(query);
        
        console.log('\n✅ All tables dropped successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Restart Strapi: npm run develop');
        console.log('2. Strapi will automatically recreate all tables');
        console.log('3. Then create content via Admin UI');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

dropAllTables();
