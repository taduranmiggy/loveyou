/**
 * 🦫💊 Create Demo Admin User
 * Sets up a demo admin user in localStorage for testing
 */

export const createDemoAdmin = () => {
  const demoAdmin = {
    id: 'demo-admin-001',
    email: 'johnmigueltaduran09@gmail.com',
    password: '123456',
    nickname: 'Demo Admin',
    age: 25,
    pillType: 'Diane',
    startDate: '2025-07-28',
    customCycle: null,
    themePreference: 'light',
    capybaraName: 'AdminCappy',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Get existing users or create empty array
  const users = JSON.parse(localStorage.getItem('loveyou_users') || '[]');
  
  // Check if admin already exists
  const existingAdmin = users.find(u => u.email === demoAdmin.email);
  
  if (!existingAdmin) {
    users.push(demoAdmin);
    localStorage.setItem('loveyou_users', JSON.stringify(users));
    console.log('🦫👑 Demo admin user created!');
    console.log('Email: johnmigueltaduran09@gmail.com');
    console.log('Password: 123456');
    return { success: true, message: 'Demo admin created successfully!' };
  } else {
    console.log('🦫👑 Demo admin user already exists!');
    return { success: true, message: 'Demo admin already exists!' };
  }
};

// Auto-create demo admin when using localStorage
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => {
    createDemoAdmin();
  }, 1000);
}

export default createDemoAdmin;
