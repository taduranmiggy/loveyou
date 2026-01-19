/**
 * Seed Admin and Viewer accounts
 * Run with: node scripts/seedAccounts.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const User = require('../models/User');

const seedAccounts = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Admin account credentials
    const adminEmail = 'admin@loveyou.com';
    const adminPassword = 'Admin123!';

    // Viewer account credentials
    const viewerEmail = 'viewer@loveyou.com';
    const viewerPassword = 'Viewer123!';

    // Hash passwords
    const salt = await bcrypt.genSalt(12);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);
    const hashedViewerPassword = await bcrypt.hash(viewerPassword, salt);

    // Create or update Admin account
    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        email: adminEmail,
        password: hashedAdminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
      }
    });

    if (!adminCreated) {
      await admin.update({ role: 'admin', password: hashedAdminPassword });
      console.log('🔄 Admin account updated');
    } else {
      console.log('✅ Admin account created');
    }

    // Create or update Viewer account
    const [viewer, viewerCreated] = await User.findOrCreate({
      where: { email: viewerEmail },
      defaults: {
        email: viewerEmail,
        password: hashedViewerPassword,
        firstName: 'Viewer',
        lastName: 'User',
        role: 'viewer',
        isEmailVerified: true,
        isActive: true,
      }
    });

    if (!viewerCreated) {
      await viewer.update({ role: 'viewer', password: hashedViewerPassword });
      console.log('🔄 Viewer account updated');
    } else {
      console.log('✅ Viewer account created');
    }

    console.log('\n📋 Account Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 ADMIN:');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('');
    console.log('👁️ VIEWER:');
    console.log(`   Email:    ${viewerEmail}`);
    console.log(`   Password: ${viewerPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding accounts:', error);
    process.exit(1);
  }
};

seedAccounts();
