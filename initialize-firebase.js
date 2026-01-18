// 🦫💊 Firebase Database Initialization Script for Milady
// Run this in the browser console to set up your Firebase database

console.log('🦫💊 Initializing Milady Firebase Database...');

// Initialize Firebase data
async function initializeFirebaseDatabase() {
  try {
    // Import the API functions
    const { default: api } = await import('./src/utils/api.js');
    
    console.log('📊 Checking database status...');
    const status = await api.getDatabaseStatus();
    console.log('Database status:', status);
    
    if (status.mode === 'firebase') {
      console.log('🔥 Firebase detected! Initializing database...');
      
      // Initialize Firebase data
      await api.initializeFirebaseData();
      console.log('✅ Firebase database initialized successfully!');
      
      // Create admin user
      console.log('👑 Creating admin user...');
      const adminResult = await api.register({
        email: 'johnmigueltaduran09@gmail.com',
        password: '123456',
        name: 'John Miguel Taduran',
        role: 'admin'
      });
      
      if (adminResult.success) {
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: johnmigueltaduran09@gmail.com');
        console.log('🔑 Password: 123456');
        console.log('👑 Role: Admin');
      } else {
        console.log('ℹ️ Admin user might already exist:', adminResult.message);
      }
      
      console.log('🎉 Firebase setup complete!');
      console.log('🦫 Your Milady Pill Tracker is ready with Firebase!');
      
    } else {
      console.log('💾 LocalStorage mode detected - Firebase not configured');
      console.log('ℹ️ The app will continue working in offline mode');
    }
    
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    console.log('💾 Falling back to LocalStorage mode...');
  }
}

// Auto-run when script is loaded
initializeFirebaseDatabase();

// Export for manual use
window.initializeFirebaseDatabase = initializeFirebaseDatabase;

console.log('🚀 Script loaded! Firebase initialization in progress...');
console.log('📱 Visit http://localhost:5176 to use your Milady Pill Tracker!');
