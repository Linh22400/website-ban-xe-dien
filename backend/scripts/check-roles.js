const { Client } = require('pg');
require('dotenv').config();

async function checkRoles() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    await client.connect();
    
    // Get all roles
    const rolesResult = await client.query(`
      SELECT id, name, type, description 
      FROM up_roles 
      ORDER BY id
    `);
    
    console.log('📋 Available Roles:\n');
    rolesResult.rows.forEach(role => {
      console.log(`  ID: ${role.id}`);
      console.log(`  Name: ${role.name}`);
      console.log(`  Type: ${role.type}`);
      console.log(`  Description: ${role.description || 'N/A'}\n`);
    });
    
    // Check current admin user role
    const userResult = await client.query(`
      SELECT u.id, u.username, u.email, r.name as role_name, r.type as role_type
      FROM up_users u
      LEFT JOIN up_users_role_lnk url ON u.id = url.user_id
      LEFT JOIN up_roles r ON url.role_id = r.id
      WHERE u.email = 'admin@xediendducduy.com'
    `);
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('👤 Current Admin User:');
      console.log(`  Username: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role_name} (${user.role_type})\n`);
      
      if (user.role_type === 'authenticated') {
        console.log('⚠️  User has "authenticated" role but needs admin permissions!');
        console.log('💡 Options:');
        console.log('   1. Set Strapi permissions for authenticated role (in Strapi admin panel)');
        console.log('   2. Create custom admin role with full permissions\n');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkRoles();
