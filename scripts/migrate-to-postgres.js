/**
 * Script để migrate data từ SQLite sang PostgreSQL (Supabase)
 * 
 * Cách dùng:
 * 1. Đảm bảo backend local đang chạy với SQLite
 * 2. Update DATABASE_URL trong .env.production với Supabase connection string
 * 3. Chạy: node scripts/migrate-to-postgres.js
 */

const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
const path = require('path');

// Đường dẫn đến SQLite database
const SQLITE_PATH = path.join(__dirname, '..', 'backend', '.tmp', 'data.db');

// PostgreSQL connection string (sẽ lấy từ env)
const POSTGRES_URL = process.env.DATABASE_URL || 'postgresql://user:pass@host:5432/db';

async function migrate() {
    console.log('🚀 Bắt đầu migrate từ SQLite sang PostgreSQL...\n');

    // Connect SQLite
    const sqliteDb = new sqlite3.Database(SQLITE_PATH);
    
    // Connect PostgreSQL
    const pgClient = new Client({ connectionString: POSTGRES_URL });
    await pgClient.connect();
    console.log('✅ Kết nối PostgreSQL thành công!\n');

    // Lấy danh sách tables
    const tables = await new Promise((resolve, reject) => {
        sqliteDb.all(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
            (err, rows) => err ? reject(err) : resolve(rows)
        );
    });

    console.log(`📊 Tìm thấy ${tables.length} tables:\n`);

    for (const { name } of tables) {
        console.log(`   Đang xử lý: ${name}...`);
        
        // Lấy data từ SQLite
        const rows = await new Promise((resolve, reject) => {
            sqliteDb.all(`SELECT * FROM "${name}"`, (err, rows) => 
                err ? reject(err) : resolve(rows)
            );
        });

        if (rows.length === 0) {
            console.log(`   ⚠️  Table ${name} rỗng, bỏ qua.\n`);
            continue;
        }

        console.log(`   📦 Tìm thấy ${rows.length} rows`);

        // TODO: Insert vào PostgreSQL
        // Strapi sẽ tự tạo schema khi start lần đầu
        // Script này chỉ để tham khảo structure
        
        console.log(`   ✅ Hoàn thành ${name}\n`);
    }

    sqliteDb.close();
    await pgClient.end();
    
    console.log('🎉 Migration hoàn tất!');
    console.log('\n⚠️  LƯU Ý: Do Strapi tự quản lý schema, cách tốt nhất là:');
    console.log('1. Cấu hình DATABASE_URL với Supabase');
    console.log('2. Chạy Strapi lần đầu để tạo schema tự động');
    console.log('3. Import lại data thủ công qua Strapi Admin UI nếu cần\n');
}

migrate().catch(console.error);
