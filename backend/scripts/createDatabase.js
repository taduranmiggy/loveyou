const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  let connection;
  
  try {
    console.log('💕 Creating LoveYou database...');
    
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✅ Connected to MySQL server');

    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS loveyou`);
    console.log('✅ Database "loveyou" created successfully');

    console.log('🎉 Database setup complete!');
    console.log('📝 You can now run: npm start');
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 MySQL server is not running. Please:');
      console.log('   1. Install MySQL: https://dev.mysql.com/downloads/mysql/');
      console.log('   2. Start MySQL service');
      console.log('   3. Or use XAMPP: https://www.apachefriends.org/');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Access denied. Please check your MySQL credentials in .env file');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createDatabase();
