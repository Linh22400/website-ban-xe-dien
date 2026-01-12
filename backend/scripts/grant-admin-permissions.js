/**
 * Script to grant admin permissions to authenticated role
 * This allows frontend admin users to access all APIs
 */

const { Client } = require('pg');
require('dotenv').config();

async function grantAdminPermissions() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    await client.connect();
    console.log('🔧 Granting admin permissions to authenticated role...\n');

    // Get authenticated role ID
    const roleResult = await client.query(
      "SELECT id FROM up_roles WHERE type = 'authenticated' LIMIT 1"
    );
    
    if (roleResult.rows.length === 0) {
      throw new Error('Authenticated role not found');
    }
    
    const roleId = roleResult.rows[0].id;
    console.log(`✓ Found authenticated role (ID: ${roleId})\n`);

    // List of permissions to grant (all CRUD operations)
    const permissions = [
      // Users
      { action: 'plugin::users-permissions.user.find', enabled: true },
      { action: 'plugin::users-permissions.user.findOne', enabled: true },
      { action: 'plugin::users-permissions.user.count', enabled: true },
      { action: 'plugin::users-permissions.user.create', enabled: true },
      { action: 'plugin::users-permissions.user.update', enabled: true },
      { action: 'plugin::users-permissions.user.destroy', enabled: true },
      { action: 'plugin::users-permissions.user.me', enabled: true },
      
      // Products (car-models)
      { action: 'api::car-model.car-model.find', enabled: true },
      { action: 'api::car-model.car-model.findOne', enabled: true },
      { action: 'api::car-model.car-model.create', enabled: true },
      { action: 'api::car-model.car-model.update', enabled: true },
      { action: 'api::car-model.car-model.delete', enabled: true },
      
      // Categories
      { action: 'api::category.category.find', enabled: true },
      { action: 'api::category.category.findOne', enabled: true },
      { action: 'api::category.category.create', enabled: true },
      { action: 'api::category.category.update', enabled: true },
      { action: 'api::category.category.delete', enabled: true },
      
      // Orders
      { action: 'api::order.order.find', enabled: true },
      { action: 'api::order.order.findOne', enabled: true },
      { action: 'api::order.order.create', enabled: true },
      { action: 'api::order.order.update', enabled: true },
      { action: 'api::order.order.delete', enabled: true },
      
      // Leads
      { action: 'api::lead.lead.find', enabled: true },
      { action: 'api::lead.lead.findOne', enabled: true },
      { action: 'api::lead.lead.create', enabled: true },
      { action: 'api::lead.lead.update', enabled: true },
      { action: 'api::lead.lead.delete', enabled: true },
      
      // Upload
      { action: 'plugin::upload.content-api.upload', enabled: true },
      { action: 'plugin::upload.content-api.destroy', enabled: true },
      { action: 'plugin::upload.content-api.find', enabled: true },
      { action: 'plugin::upload.content-api.findOne', enabled: true },
    ];

    console.log('📝 Setting permissions...\n');

    for (const perm of permissions) {
      try {
        // Check if permission exists
        const existingPerm = await client.query(
          `SELECT id FROM up_permissions WHERE action = $1`,
          [perm.action]
        );

        let permId;
        if (existingPerm.rows.length > 0) {
          permId = existingPerm.rows[0].id;
          console.log(`  ✓ Found existing: ${perm.action}`);
        } else {
          // Create permission
          const newPerm = await client.query(
            `INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at)
             VALUES (gen_random_uuid()::text, $1, NOW(), NOW(), NOW())
             RETURNING id`,
            [perm.action]
          );
          permId = newPerm.rows[0].id;
          console.log(`  ✓ Created: ${perm.action}`);
        }

        // Link permission to role
        const linkExists = await client.query(
          `SELECT id FROM up_permissions_role_lnk 
           WHERE permission_id = $1 AND role_id = $2`,
          [permId, roleId]
        );

        if (linkExists.rows.length === 0) {
          await client.query(
            `INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord)
             VALUES ($1, $2, 1)`,
            [permId, roleId]
          );
          console.log(`    → Linked to role`);
        }

      } catch (error) {
        console.log(`  ⚠️  Skipped: ${perm.action} (${error.message})`);
      }
    }

    console.log('\n✅ Permissions granted successfully!\n');
    console.log('💡 Now you can access admin APIs with authenticated user token.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

grantAdminPermissions();
