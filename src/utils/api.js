/**
 * 🦫💊 API Configuration - Firebase + LocalStorage Fallback
 * Migrated from MySQL to Firebase for better reliability
 * Falls back to localStorage when Firebase is not configured
 */

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase.js';
import * as realtimeService from './realtimeService.js';
import localStorageService from './localStorageService.js';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  try {
    return auth.app.options.databaseURL && 
           !auth.app.options.apiKey.includes('demo') && 
           !auth.app.options.apiKey.includes('Demo');
  } catch (error) {
    return false;
  }
};

// Use Firebase or localStorage based on configuration
const useFirebase = isFirebaseConfigured();

// Auth state management
let currentUser = null;

// Listen for auth state changes (only if Firebase is configured)
if (useFirebase) {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
  });
}

console.log(useFirebase ? '🔥 Using Firebase for database' : '💾 Using localStorage for offline mode');

// API utility functions with Firebase + LocalStorage fallback
export const api = {
  // Authentication
  register: async (userData) => {
    try {
      if (useFirebase) {
        // Use Firebase
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          userData.email, 
          userData.password
        );
        
        const result = await realtimeService.createUser(userCredential.user.uid, {
          email: userData.email,
          nickname: userData.nickname,
          age: userData.age,
          pillType: userData.pillType,
          startDate: userData.startDate,
          customCycle: userData.customCycle
        });
        
        if (result.success) {
          return {
            success: true,
            message: 'Registration successful! Welcome to LoveYou! 🦫💕',
            user: {
              id: result.userId,
              email: userData.email,
              nickname: userData.nickname,
              capybaraName: result.capybaraName,
              role: result.role
            }
          };
        } else {
          await userCredential.user.delete();
          return { success: false, error: result.error };
        }
      } else {
        // Use localStorage
        const result = await localStorageService.createUser(userData);
        
        if (result.success) {
          return {
            success: true,
            message: 'Registration successful! Welcome to LoveYou! 🦫💕 (Offline Mode)',
            user: {
              id: result.userId,
              email: userData.email,
              nickname: userData.nickname,
              capybaraName: result.capybaraName,
              role: result.role
            }
          };
        } else {
          return result;
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.code === 'auth/email-already-in-use' 
          ? 'Email already registered' 
          : error.message 
      };
    }
  },

  login: async (credentials) => {
    try {
      if (useFirebase) {
        // Use Firebase
        const userCredential = await signInWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        );
        
        const result = await realtimeService.getUser(userCredential.user.uid);
        
        if (result.success) {
          return {
            success: true,
            user: {
              id: result.user.id,
              email: result.user.email,
              nickname: result.user.nickname,
              capybaraName: result.user.capybaraName,
              role: result.user.role || 'user'
            }
          };
        } else {
          return { success: false, error: 'User data not found' };
        }
      } else {
        // Use localStorage
        const result = await localStorageService.authenticateUser(credentials.email, credentials.password);
        
        if (result.success) {
          return {
            success: true,
            user: {
              id: result.user.id,
              email: result.user.email,
              nickname: result.user.nickname,
              capybaraName: result.user.capybaraName,
              role: result.user.role || 'user'
            }
          };
        } else {
          return result;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.code === 'auth/invalid-credential' 
          ? 'Invalid email or password' 
          : error.message 
      };
    }
  },

  logout: async () => {
    try {
      if (useFirebase) {
        await signOut(auth);
      } else {
        await localStorageService.logout();
      }
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  // User data
  getUser: async () => {
    try {
      if (useFirebase) {
        if (!currentUser) {
          return { success: false, error: 'Not authenticated' };
        }
        
        const result = await realtimeService.getUser(currentUser.uid);
        return result;
      } else {
        const result = await localStorageService.getCurrentUser();
        return result;
      }
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, error: error.message };
    }
  },

  updateUser: async (userData) => {
    try {
      if (useFirebase) {
        if (!currentUser) {
          return { success: false, error: 'Not authenticated' };
        }
        
        const result = await realtimeService.updateUser(currentUser.uid, userData);
        return result;
      } else {
        const currentUserResult = await localStorageService.getCurrentUser();
        if (!currentUserResult.success) {
          return { success: false, error: 'Not authenticated' };
        }
        
        const result = await localStorageService.updateUser(currentUserResult.user.id, userData);
        return result;
      }
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  },

  // Calendar and tracking
  getCalendar: async () => {
    try {
      let userId;
      
      if (useFirebase) {
        if (!currentUser) {
          return { success: false, error: 'Not authenticated' };
        }
        userId = currentUser.uid;
      } else {
        const currentUserResult = await localStorageService.getCurrentUser();
        if (!currentUserResult.success) {
          return { success: false, error: 'Not authenticated' };
        }
        userId = currentUserResult.user.id;
      }
      
      // Get user data
      const userResult = useFirebase 
        ? await realtimeService.getUser(userId)
        : await localStorageService.getCurrentUser();
      if (!userResult.success) {
        return userResult;
      }
      
      // Get pill types
      const pillTypesResult = useFirebase
        ? await realtimeService.getPillTypes()
        : await localStorageService.getPillTypes();
      if (!pillTypesResult.success) {
        return pillTypesResult;
      }
      
      // Get tracking history
      const trackingResult = useFirebase
        ? await realtimeService.getPillTracking(userId, '2020-01-01', '2030-12-31')
        : await localStorageService.getPillTrackingHistory(userId);
      if (!trackingResult.success) {
        return trackingResult;
      }
      
      const user = userResult.user;
      const pillTypes = pillTypesResult.data;
      const trackingHistory = trackingResult.data;
      
      // Find user's pill type
      const pillType = pillTypes.find(p => p.name === user.pillType);
      
      // Generate calendar data
      const calendarData = generateCalendarData(user, pillType, trackingHistory);
      
      return {
        success: true,
        calendarData: calendarData,
        pillType: pillType,
        startDate: user.startDate
      };
    } catch (error) {
      console.error('Get calendar error:', error);
      return { success: false, error: error.message };
    }
  },

  trackPill: async (date, taken, notes = null) => {
    try {
      let userId;
      
      if (useFirebase) {
        if (!currentUser) {
          return { success: false, error: 'Not authenticated' };
        }
        userId = currentUser.uid;
        
        const result = await realtimeService.trackPill(userId, date, taken, notes);
        return result;
      } else {
        const currentUserResult = await localStorageService.getCurrentUser();
        if (!currentUserResult.success) {
          return { success: false, error: 'Not authenticated' };
        }
        userId = currentUserResult.user.id;
        
        const result = await localStorageService.trackPill(userId, date, taken, notes);
        return result;
      }
    } catch (error) {
      console.error('Track pill error:', error);
      return { success: false, error: error.message };
    }
  },

  // Pill types
  getPillTypes: async () => {
    try {
      const result = useFirebase
        ? await realtimeService.getPillTypes()
        : await localStorageService.getPillTypes();
      
      if (result.success) {
        return { success: true, pillTypes: result.data };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Get pill types error:', error);
      return { success: false, error: error.message };
    }
  },

  // Quotes
  getQuotes: async (category = null) => {
    try {
      const result = useFirebase
        ? await realtimeService.getQuotes(category)
        : await localStorageService.getQuotes(category);
      return result;
    } catch (error) {
      console.error('Get quotes error:', error);
      return { success: false, error: error.message };
    }
  },

  // Initialize Firebase data (run once, only if Firebase is configured)
  initializeFirebaseData: async () => {
    try {
      if (!useFirebase) {
        return { success: false, error: 'Firebase not configured. Using localStorage instead.' };
      }
      
      console.log('🦫 Initializing Realtime Database data...');
      
      // Initialize all data (pill types and quotes)
      const result = await realtimeService.initializeDatabase();
      
      if (result.success) {
        return { success: true, message: 'Realtime Database data initialized successfully!' };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Initialize Realtime Database data error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get current database mode
  getDatabaseMode: () => {
    return useFirebase ? 'realtime' : 'localStorage';
  },

  // Get database status for UI
  getDatabaseStatus: () => {
    return {
      mode: useFirebase ? 'realtime' : 'localStorage',
      configured: isFirebaseConfigured(),
      description: useFirebase 
        ? 'Using Firebase Realtime Database' 
        : 'Using offline localStorage mode'
    };
  }
};

// Helper function to generate calendar data
function generateCalendarData(user, pillType, trackingHistory) {
  if (!pillType) return [];
  
  const startDate = new Date(user.startDate);
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 1); // Next month
  
  const calendar = [];
  const current = new Date(startDate);
  
  // Convert tracking history to object for quick lookup
  const tracking = {};
  trackingHistory.forEach(track => {
    tracking[track.date] = track;
  });
  
  while (current <= endDate) {
    const daysSinceStart = Math.floor((current - startDate) / (1000 * 60 * 60 * 24));
    const cycleLength = pillType.activeDays + pillType.breakDays;
    const dayInCycle = (daysSinceStart % cycleLength) + 1;
    
    const isActiveDay = dayInCycle <= pillType.activeDays;
    const dateStr = current.toISOString().split('T')[0];
    
    calendar.push({
      date: dateStr,
      isActiveDay: isActiveDay,
      dayInCycle: dayInCycle,
      taken: tracking[dateStr] ? tracking[dateStr].taken : false,
      notes: tracking[dateStr] ? tracking[dateStr].notes : null
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return calendar;
}

// Pill cycle calculation utilities
export const pillUtils = {
  // Calculate if a given date is an active pill day
  isActiveDay: (startDate, currentDate, activeDays, breakDays) => {
    const start = new Date(startDate);
    const current = new Date(currentDate);
    const daysSinceStart = Math.floor((current - start) / (1000 * 60 * 60 * 24));
    const cycleLength = activeDays + breakDays;
    const dayInCycle = (daysSinceStart % cycleLength) + 1;
    return dayInCycle <= activeDays;
  },

  // Get the current day in the cycle
  getDayInCycle: (startDate, currentDate, activeDays, breakDays) => {
    const start = new Date(startDate);
    const current = new Date(currentDate);
    const daysSinceStart = Math.floor((current - start) / (1000 * 60 * 60 * 24));
    const cycleLength = activeDays + breakDays;
    return (daysSinceStart % cycleLength) + 1;
  },

  // Calculate next pill date
  getNextPillDate: (startDate, activeDays, breakDays) => {
    const today = new Date();
    const start = new Date(startDate);
    const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    const cycleLength = activeDays + breakDays;
    const dayInCycle = (daysSinceStart % cycleLength) + 1;
    
    if (dayInCycle <= activeDays) {
      return today; // Today is a pill day
    } else {
      // Calculate next cycle start
      const daysUntilNextCycle = cycleLength - dayInCycle + 1;
      const nextPillDate = new Date(today);
      nextPillDate.setDate(today.getDate() + daysUntilNextCycle);
      return nextPillDate;
    }
  },
};

// Capybara utilities
export const capybaraUtils = {
  // Random capybara names
  names: [
    'Cappy', 'Bubbles', 'Sunny', 'Mochi', 'Peanut', 'Biscuit',
    'Marshmallow', 'Cocoa', 'Honey', 'Caramel', 'Vanilla', 'Cinnamon',
    'Butterscotch', 'Maple', 'Cookie', 'Cupcake', 'Truffle', 'Toffee'
  ],

  // Random motivational quotes
  quotes: [
    "You're doing amazing! Keep it up! 🌸",
    "Every pill taken is self-care in action! 💕",
    "Your capybara friend is proud of you! 🦫",
    "Consistency is key, and you're nailing it! ✨",
    "Taking care of yourself is beautiful! 🌺",
    "You've got this, lovely! 💪",
    "One pill at a time, one day at a time! 🌟",
    "Self-care is the best care! 💖",
    "You're your own best friend! 🤗",
    "Keep swimming like a capybara! 🏊‍♀️"
  ],

  // Get random name
  getRandomName: () => {
    return capybaraUtils.names[Math.floor(Math.random() * capybaraUtils.names.length)];
  },

  // Get random quote
  getRandomQuote: () => {
    return capybaraUtils.quotes[Math.floor(Math.random() * capybaraUtils.quotes.length)];
  },
};

// Date formatting utilities
export const dateUtils = {
  // Format date for display
  formatDate: (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  },

  // Format date for API
  formatApiDate: (date) => {
    return new Date(date).toISOString().split('T')[0];
  },

  // Check if date is today
  isToday: (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
  },

  // Get days difference
  getDaysDifference: (date1, date2) => {
    const first = new Date(date1);
    const second = new Date(date2);
    return Math.floor((second - first) / (1000 * 60 * 60 * 24));
  },
};

// Notification utilities (for future browser notifications)
export const notificationUtils = {
  // Request notification permission
  requestPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },

  // Show notification
  showNotification: (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/capybara-icon.png',
        badge: '/capybara-badge.png',
        ...options,
      });
    }
  },

  // Schedule daily reminder
  scheduleDailyReminder: (time = '09:00') => {
    // This would be implemented with service workers for persistent notifications
    console.log(`Daily reminder scheduled for ${time}`);
  },
};

export default api;
