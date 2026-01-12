/**
 * Script tạo admin user mới cho frontend
 */

const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function createAdminUser() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? {
      rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false'
    } : false,
  });

  try {
    await client.connect();
    console.log('🚀 Đang tạo admin user...\n');

    // Thông tin admin mặc định
    const adminData = {
      username: 'admin',
      email: 'admin@xediendducduy.com',
      password: 'Admin@123456',
    };

    // Check if admin already exists
    const existingUser = await client.query(
      'SELECT id, username, email FROM up_users WHERE email = $1 OR username = $2',
      [adminData.email, adminData.username]
    );

    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      console.log('⚠️  User đã tồn tại!');
      console.log(`   Username: ${user.username}`);
      console.log(`   Email:    ${user.email}\n`);
      console.log('💡 Để xem thông tin, chạy: node scripts/check-admin-users.js');
      console.log('💡 Nếu quên mật khẩu, chạy: node scripts/reset-user-password.js\n');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const documentId = uuidv4();

    // Create user - Strapi v5 format (no role column in up_users, role set via link table)
    const result = await client.query(
      `INSERT INTO up_users (
        document_id, username, email, password, confirmed, blocked, 
        provider, created_at, updated_at, published_at
      )
       VALUES ($1, $2, $3, $4, true, false, 'local', NOW(), NOW(), NOW())
       RETURNING id, username, email`,
      [documentId, adminData.username, adminData.email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Get authenticated role
    const roleResult = await client.query(
      "SELECT id FROM up_roles WHERE type = 'authenticated' LIMIT 1"
    );

    if (roleResult.rows.length > 0) {
      const roleId = roleResult.rows[0].id;
      
      // Link user to role (Strapi v5 uses link tables)
      await client.query(
        `INSERT INTO up_users_role_lnk (user_id, role_id, user_ord)
         VALUES ($1, $2, 1)
         ON CONFLICT DO NOTHING`,
        [newUser.id, roleId]
      );
    }

    console.log('✅ Tạo admin user thành công!\n');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('\n🎉 THÔNG TIN ĐĂNG NHẬP:\n');
    console.log(`   Username:  ${adminData.username}`);
    console.log(`   Email:     ${adminData.email}`);
    console.log(`   Password:  ${adminData.password}`);
    console.log(`   URL:       http://localhost:3000/admin-login`);
    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('\n⚠️  LƯU Ý: Hãy đổi mật khẩu sau khi đăng nhập lần đầu!\n');

  } catch (error) {
    console.error('❌ Lỗi khi tạo admin user:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
  }
}

createAdminUser();
