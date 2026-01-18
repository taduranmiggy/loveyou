#!/usr/bin/env node

/**
 * Milady Backend Services Information
 * Lists all available API services and endpoints
 */

console.log('\n💕 Milady Backend Services 💕\n');
console.log('🌸 Available API Services:\n');

const services = [
  {
    name: '👤 Authentication Service',
    endpoints: [
      'POST /api/auth/register - User registration',
      'POST /api/auth/login - User login',
      'POST /api/auth/logout - User logout',
      'GET /api/auth/profile - Get user profile',
      'PUT /api/auth/profile - Update user profile'
    ]
  },
  {
    name: '💊 Pill Management Service',
    endpoints: [
      'GET /api/pills - List all pills',
      'POST /api/pills - Create new pill',
      'GET /api/pills/:id - Get pill details',
      'PUT /api/pills/:id - Update pill',
      'DELETE /api/pills/:id - Delete pill'
    ]
  },
  {
    name: '📅 Pill Intake Tracking Service',
    endpoints: [
      'GET /api/intake - Get intake history',
      'POST /api/intake - Record pill intake',
      'PUT /api/intake/:id - Update intake record',
      'DELETE /api/intake/:id - Delete intake record'
    ]
  },
  {
    name: '🌺 Menstrual Cycle Service',
    endpoints: [
      'GET /api/cycles - Get cycle history',
      'POST /api/cycles - Start new cycle',
      'PUT /api/cycles/:id - Update cycle',
      'GET /api/cycles/predictions - Get cycle predictions'
    ]
  },
  {
    name: '📊 Health Analytics Service',
    endpoints: [
      'GET /api/analytics/overview - Health overview',
      'GET /api/analytics/patterns - Pattern analysis',
      'GET /api/analytics/reminders - Reminder settings'
    ]
  },
  {
    name: '🗄️ Database Service',
    endpoints: [
      'GET /api/database/health - Database health check',
      'GET /api/database/users/count - User count',
      'GET /api/database/pills/count - Pill count',
      'GET /api/database/users - List users (admin)',
      'GET /api/database/export - Export data'
    ]
  }
];

services.forEach(service => {
  console.log(`\n${service.name}`);
  console.log('═'.repeat(service.name.length));
  service.endpoints.forEach(endpoint => {
    console.log(`  ${endpoint}`);
  });
});

console.log('\n🔧 Service Configuration:');
console.log('═'.repeat(20));
console.log('  • Server Port: 3001');
console.log('  • Database: MySQL (milady_tracker)');
console.log('  • Authentication: JWT tokens');
console.log('  • CORS: Enabled for frontend');
console.log('  • Rate Limiting: Enabled');
console.log('  • Security: Helmet middleware');

console.log('\n📋 Available NPM Scripts:');
console.log('═'.repeat(25));
console.log('  • npm run dev - Start development server');
console.log('  • npm start - Start production server');
console.log('  • npm run migrate - Run database migrations');
console.log('  • npm run seed - Seed database with sample data');
console.log('  • npm run services - Show this services list');
console.log('  • npm run health - Check server health');

console.log('\n💖 Happy tracking with Milady! 💖\n');
