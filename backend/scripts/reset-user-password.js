/**
 * Script để reset mật khẩu cho user
 */

const strapi = require('@strapi/strapi');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function resetPassword() {
  console.log('🔐 Reset mật khẩu user\n');

  const app = await strapi().load();

  try {
    // Get all users
    const users = await strapi.db.query('plugin::users-permissions.user').findMany({
      select: ['id', 'username', 'email'],
      limit: 100,
    });

    if (users.length === 0) {
      console.log('❌ Không tìm thấy user nào.\n');
      return;
    }

    console.log('📋 Danh sách users:\n');
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (${user.email})`);
    });
    console.log('');

    const choice = await question('Chọn user (nhập số thứ tự hoặc email/username): ');
    
    let selectedUser;
    if (!isNaN(choice)) {
      selectedUser = users[parseInt(choice) - 1];
    } else {
      selectedUser = users.find(u => u.email === choice || u.username === choice);
    }

    if (!selectedUser) {
      console.log('❌ User không hợp lệ.\n');
      return;
    }

    const newPassword = await question('Nhập mật khẩu mới (hoặc Enter để dùng "Admin@123456"): ');
    const finalPassword = newPassword.trim() || 'Admin@123456';

    // Hash password
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    // Update password
    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: selectedUser.id },
      data: { password: hashedPassword },
    });

    console.log('\n✅ Reset mật khẩu thành công!\n');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`\n👤 User:     ${selectedUser.username}`);
    console.log(`📧 Email:    ${selectedUser.email}`);
    console.log(`🔑 Password: ${finalPassword}`);
    console.log(`🌐 URL:      http://localhost:3000/admin-login\n`);
    console.log('═══════════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    rl.close();
    await app.destroy();
  }
}

resetPassword();
