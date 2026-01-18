// 🦫💊 Initialize Firebase Realtime Database
// Run this in the browser console to set up initial data

console.log('🔥 Initializing Firebase Realtime Database...');

// Function to initialize the database
async function initializeRealtimeDatabase() {
  try {
    // Import the API
    const { default: api } = await import('./src/utils/api.js');
    
    console.log('📊 Checking database status...');
    const status = api.getDatabaseStatus();
    console.log('Database status:', status);
    
    if (status.mode === 'realtime') {
      console.log('🔥 Realtime Database detected! Initializing...');
      
      // Initialize database data
      const result = await api.initializeFirebaseData();
      
      if (result.success) {
        console.log('✅ Database initialized successfully!');
        
        // Try to create demo admin user
        console.log('👑 Creating demo admin user...');
        try {
          const adminResult = await api.register({
            email: 'johnmigueltaduran09@gmail.com',
            password: '123456',
            nickname: 'John Miguel',
            age: '25',
            pillType: 'Diane',
            startDate: '2025-01-01'
          });
          
          if (adminResult.success) {
            console.log('✅ Demo admin user created!');
            console.log('📧 Email: johnmigueltaduran09@gmail.com');
            console.log('🔑 Password: 123456');
          } else {
            console.log('ℹ️ Admin user might already exist:', adminResult.error);
          }
        } catch (regError) {
          console.log('ℹ️ Could not create admin user (might already exist)');
        }
        
        console.log('🎉 Setup complete!');
        console.log('🦫 Your Milady Pill Tracker is ready!');
        
      } else {
        console.error('❌ Failed to initialize database:', result.error);
      }
      
    } else {
      console.log('💾 LocalStorage mode detected');
      console.log('ℹ️ Using offline mode - data stored locally');
    }
    
  } catch (error) {
    console.error('❌ Error during initialization:', error);
  }
}

// Auto-initialize
initializeRealtimeDatabase();

// Make it available globally
window.initializeRealtimeDatabase = initializeRealtimeDatabase;

console.log('🚀 Firebase initialization script loaded!');
console.log('💡 If initialization fails, run: initializeRealtimeDatabase()');
