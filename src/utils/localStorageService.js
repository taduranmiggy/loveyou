/**
 * 🦫💊 Local Storage Fallback Service
 * Provides offline functionality when Firebase is not configured
 */

export class LocalStorageService {
  constructor() {
    this.initializeLocalData();
  }
  
  // Initialize default data in localStorage
  initializeLocalData() {
    if (!localStorage.getItem('milady_pill_types')) {
      const defaultPillTypes = [
        {
          id: '1',
          name: 'Diane',
          activeDays: 21,
          breakDays: 7,
          placeboDays: 0,
          description: 'Diane-35: 21 active pills followed by 7-day break. Effective for acne treatment and contraception. Perfect for clear skin goals! 💊✨'
        },
        {
          id: '2',
          name: 'Althea',
          activeDays: 21,
          breakDays: 7,
          placeboDays: 0,
          description: 'Althea: 21 active pills followed by 7-day break. Popular daily contraceptive pill with reliable protection. Trusted by many! 🌸'
        },
        {
          id: '3',
          name: 'Yasmin',
          activeDays: 21,
          breakDays: 7,
          placeboDays: 0,
          description: 'Yasmin: 21 active pills followed by 7-day break. Low-dose hormonal contraceptive with fewer side effects. Gentle and effective! 💕'
        },
        {
          id: '4',
          name: 'Marvelon',
          activeDays: 21,
          breakDays: 7,
          placeboDays: 0,
          description: 'Marvelon: 21 active pills followed by 7-day break. Trusted contraceptive with mood benefits. Keep feeling great! 🦫'
        },
        {
          id: '5',
          name: 'Trust',
          activeDays: 21,
          breakDays: 7,
          placeboDays: 0,
          description: 'Trust Pills: 21 active pills followed by 7-day break. Affordable and effective contraceptive option. Budget-friendly choice! 💎'
        },
        {
          id: '6',
          name: 'Custom',
          activeDays: 0,
          breakDays: 0,
          placeboDays: 0,
          description: 'Custom cycle defined by user. Perfect for unique schedules and special needs. Your personalized approach! 🎯'
        }
      ];
      
      localStorage.setItem('milady_pill_types', JSON.stringify(defaultPillTypes));
    }
    
    if (!localStorage.getItem('milady_quotes')) {
      const defaultQuotes = [
        { id: '1', message: 'Great job taking your pill today! Your capybara friend is so proud! 🦫💕', category: 'motivation' },
        { id: '2', message: 'Consistency is key! You\'re building amazing healthy habits! ✨', category: 'motivation' },
        { id: '3', message: 'Another day, another step towards your health goals! 💪', category: 'motivation' },
        { id: '4', message: 'Your capybara companion believes in you! Keep going! 🌟', category: 'motivation' },
        { id: '5', message: 'Woohoo! Perfect streak! You\'re absolutely amazing! 🎉', category: 'celebration' },
        { id: '6', message: 'Celebration time! You\'re rocking this routine! 💃', category: 'celebration' },
        { id: '7', message: 'Time for your daily dose of self-care! 💊💖', category: 'reminder' },
        { id: '8', message: 'Your health, your choice, your power! 👑', category: 'reminder' },
        { id: '9', message: 'Rest day achieved! Time to relax and recharge! 🛌✨', category: 'rest_day' },
        { id: '10', message: 'Enjoy your break - you\'ve earned it! 🌺', category: 'rest_day' }
      ];
      
      localStorage.setItem('milady_quotes', JSON.stringify(defaultQuotes));
    }
  }
  
  // Generate random ID
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
  
  // ======== PILL TYPES ========
  
  async getPillTypes() {
    try {
      const pillTypes = JSON.parse(localStorage.getItem('milady_pill_types') || '[]');
      return { success: true, data: pillTypes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // ======== USERS ========
  
  async createUser(userData) {
    try {
      const users = JSON.parse(localStorage.getItem('loveyou_users') || '[]');
      
      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'Email already registered' };
      }
      
      // Generate random capybara name
      const capybaraNames = ['Cappy', 'Bubbles', 'Sunny', 'Mochi', 'Peanut', 'Biscuit', 'Marshmallow', 'Cocoa'];
      const capybaraName = capybaraNames[Math.floor(Math.random() * capybaraNames.length)];
      
      // Check if this is an admin email
      const isAdmin = userData.email === 'johnmigueltaduran09@gmail.com' || userData.email === 'admin@loveyou.com';
      
      const newUser = {
        id: this.generateId(),
        email: userData.email,
        password: userData.password,
        name: userData.nickname,
        nickname: userData.nickname,
        age: userData.age,
        pillType: userData.pillType,
        startDate: userData.startDate,
        customCycle: userData.customCycle || null,
        themePreference: 'light',
        capybaraName: capybaraName,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('loveyou_users', JSON.stringify(users));
      
      // Set current user
      localStorage.setItem('loveyou_user', JSON.stringify(newUser));
      localStorage.setItem('loveyou_token', 'mock-token-' + Date.now());
      
      return { 
        success: true, 
        userId: newUser.id,
        capybaraName: capybaraName,
        role: newUser.role 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async getUserByEmail(email) {
    try {
      const users = JSON.parse(localStorage.getItem('loveyou_users') || '[]');
      const user = users.find(u => u.email === email);
      
      if (user) {
        return { success: true, user: user };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async authenticateUser(email, password) {
    try {
      const result = await this.getUserByEmail(email);
      
      if (result.success && result.user.password === password) {
        // Set current user
        localStorage.setItem('loveyou_user', JSON.stringify(result.user));
        localStorage.setItem('loveyou_token', 'mock-token-' + Date.now());
        return { success: true, user: result.user };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async getCurrentUser() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('loveyou_user') || 'null');
      
      if (currentUser) {
        return { success: true, user: currentUser };
      } else {
        return { success: false, error: 'Not authenticated' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async updateUser(userId, updateData) {
    try {
      const users = JSON.parse(localStorage.getItem('milady_users') || '[]');
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }
      
      users[userIndex] = {
        ...users[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('milady_users', JSON.stringify(users));
      
      // Update current user if it's the same user
      const currentUser = JSON.parse(localStorage.getItem('milady_current_user') || 'null');
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem('milady_current_user', JSON.stringify(users[userIndex]));
      }
      
      return { success: true, message: 'User updated successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async logout() {
    try {
      localStorage.removeItem('loveyou_user');
      localStorage.removeItem('loveyou_token');
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // ======== PILL TRACKING ========
  
  async trackPill(userId, date, taken, notes = null) {
    try {
      const tracking = JSON.parse(localStorage.getItem('milady_pill_tracking') || '[]');
      
      // Find existing record
      const existingIndex = tracking.findIndex(t => t.userId === userId && t.date === date);
      
      if (existingIndex >= 0) {
        // Update existing record
        tracking[existingIndex] = {
          ...tracking[existingIndex],
          taken: taken,
          notes: notes,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Create new record
        tracking.push({
          id: this.generateId(),
          userId: userId,
          date: date,
          taken: taken,
          notes: notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem('milady_pill_tracking', JSON.stringify(tracking));
      
      return { success: true, message: 'Pill tracking updated successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async getPillTrackingHistory(userId, days = 90) {
    try {
      const tracking = JSON.parse(localStorage.getItem('milady_pill_tracking') || '[]');
      
      // Calculate date 90 days ago
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - days);
      const pastDateStr = pastDate.toISOString().split('T')[0];
      
      const userTracking = tracking
        .filter(t => t.userId === userId && t.date >= pastDateStr)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      return { success: true, data: userTracking };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // ======== QUOTES ========
  
  async getQuotes(category = null) {
    try {
      let quotes = JSON.parse(localStorage.getItem('milady_quotes') || '[]');
      
      if (category) {
        quotes = quotes.filter(q => q.category === category);
      }
      
      return { success: true, data: quotes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new LocalStorageService();
