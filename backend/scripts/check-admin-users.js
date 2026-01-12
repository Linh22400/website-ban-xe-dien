/**
 * Script kiểm tra admin users trong database
 */

const { Client } = require('pg');
require('dotenv').config();

async function checkAdminUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? {
      rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false'
    } : false,
  });

  try {
    await client.connect();
    console.log('🔍 Đang kiểm tra admin users...\n');

    // First, check table structure
    const columnsResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'up_users'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Columns in up_users table:', columnsResult.rows.map(r => r.column_name).join(', '), '\n');

    // Query users - try simple query first
    const result = await client.query(`
      SELECT * FROM up_users ORDER BY id LIMIT 10
    `);

    const users = result.rows;

    if (users.length === 0) {
      console.log('❌ Không tìm thấy user nào trong hệ thống.\n');
      console.log('💡 Tạo user mới với lệnh:');
      console.log('   node scripts/create-admin-user.js\n');
      return;
    }

    console.log(`✅ Tìm thấy ${users.length} user(s):\n`);
    console.log('═══════════════════════════════════════════════════════════════════');

    users.forEach((user, index) => {
      console.log(`\n👤 User #${index + 1}:`);
      console.log(`   ID:        ${user.id}`);
      console.log(`   Username:  ${user.username}`);
      console.log(`   Email:     ${user.email}`);
      console.log(`   Role:      ${user.role_name || 'N/A'} (type: ${user.role_type || 'N/A'})`);
      console.log(`   Confirmed: ${user.confirmed ? '✅ Yes' : '❌ No'}`);
      console.log(`   Blocked:   ${user.blocked ? '⛔ Yes' : '✅ No'}`);
      
      if (user.role_type === 'authenticated' && !user.blocked && user.confirmed) {
        console.log(`   ⭐ CÓ THỂ ĐĂNG NHẬP VÀO /admin-login`);
        console.log(`   🌐 URL: http://localhost:3000/admin-login`);
      }
    });

    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('\n📝 Ghi chú:');
    console.log('   - Nếu quên mật khẩu, chạy: node scripts/reset-user-password.js');
    console.log('   - Để tạo user mới, chạy: node scripts/create-admin-user.js\n');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await client.end();
  }
}

checkAdminUsers();
