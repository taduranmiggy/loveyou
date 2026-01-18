// 🦫💊 Firebase Realtime Database Service for Milady Pill Tracker
import { ref, push, set, get, update, remove, onValue, off } from 'firebase/database';
import { db } from './firebase.js';

// Generate unique ID for documents
const generateId = () => push(ref(db)).key;

// User management
export const createUser = async (userId, userData) => {
  try {
    await set(ref(db, `users/${userId}`), {
      ...userData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
};

export const getUser = async (userId) => {
  try {
    const snapshot = await get(ref(db, `users/${userId}`));
    if (snapshot.exists()) {
      return { success: true, user: snapshot.val() };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error getting user:', error);
    return { success: false, error: error.message };
  }
};

export const updateUser = async (userId, userData) => {
  try {
    await update(ref(db, `users/${userId}`), {
      ...userData,
      updatedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
};

// Pill tracking
export const trackPill = async (userId, date, taken, notes = null) => {
  try {
    const trackingId = `${userId}_${date}`;
    await set(ref(db, `pillTracking/${trackingId}`), {
      userId,
      date,
      taken,
      notes,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error tracking pill:', error);
    return { success: false, error: error.message };
  }
};

export const getPillTracking = async (userId, startDate, endDate) => {
  try {
    const snapshot = await get(ref(db, 'pillTracking'));
    if (!snapshot.exists()) {
      return { success: true, data: [] };
    }

    const allTracking = snapshot.val();
    const userTracking = Object.entries(allTracking)
      .filter(([key, value]) => value.userId === userId)
      .filter(([key, value]) => value.date >= startDate && value.date <= endDate)
      .map(([key, value]) => ({ id: key, ...value }));

    return { success: true, data: userTracking };
  } catch (error) {
    console.error('Error getting pill tracking:', error);
    return { success: false, error: error.message };
  }
};

// Pill types
export const getPillTypes = async () => {
  try {
    const snapshot = await get(ref(db, 'pillTypes'));
    if (!snapshot.exists()) {
      return { success: true, data: [] };
    }

    const pillTypes = Object.entries(snapshot.val())
      .map(([key, value]) => ({ id: key, ...value }));

    return { success: true, data: pillTypes };
  } catch (error) {
    console.error('Error getting pill types:', error);
    return { success: false, error: error.message };
  }
};

export const createPillType = async (pillTypeData) => {
  try {
    const newPillTypeRef = push(ref(db, 'pillTypes'));
    await set(newPillTypeRef, {
      ...pillTypeData,
      createdAt: Date.now()
    });
    return { success: true, id: newPillTypeRef.key };
  } catch (error) {
    console.error('Error creating pill type:', error);
    return { success: false, error: error.message };
  }
};

// Quotes
export const getQuotes = async (category = null) => {
  try {
    const snapshot = await get(ref(db, 'quotes'));
    if (!snapshot.exists()) {
      return { success: true, data: [] };
    }

    let quotes = Object.entries(snapshot.val())
      .map(([key, value]) => ({ id: key, ...value }));

    if (category) {
      quotes = quotes.filter(quote => quote.category === category);
    }

    return { success: true, data: quotes };
  } catch (error) {
    console.error('Error getting quotes:', error);
    return { success: false, error: error.message };
  }
};

export const createQuote = async (quoteData) => {
  try {
    const newQuoteRef = push(ref(db, 'quotes'));
    await set(newQuoteRef, {
      ...quoteData,
      createdAt: Date.now()
    });
    return { success: true, id: newQuoteRef.key };
  } catch (error) {
    console.error('Error creating quote:', error);
    return { success: false, error: error.message };
  }
};

// Reminders
export const getUserReminders = async (userId) => {
  try {
    const snapshot = await get(ref(db, 'reminders'));
    if (!snapshot.exists()) {
      return { success: true, data: [] };
    }

    const allReminders = snapshot.val();
    const userReminders = Object.entries(allReminders)
      .filter(([key, value]) => value.userId === userId)
      .map(([key, value]) => ({ id: key, ...value }));

    return { success: true, data: userReminders };
  } catch (error) {
    console.error('Error getting reminders:', error);
    return { success: false, error: error.message };
  }
};

export const createReminder = async (reminderData) => {
  try {
    const newReminderRef = push(ref(db, 'reminders'));
    await set(newReminderRef, {
      ...reminderData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return { success: true, id: newReminderRef.key };
  } catch (error) {
    console.error('Error creating reminder:', error);
    return { success: false, error: error.message };
  }
};

export const updateReminder = async (reminderId, reminderData) => {
  try {
    await update(ref(db, `reminders/${reminderId}`), {
      ...reminderData,
      updatedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating reminder:', error);
    return { success: false, error: error.message };
  }
};

// Initialize database with default data
export const initializeDatabase = async () => {
  try {
    console.log('🦫 Initializing Realtime Database...');

    // Check if pill types exist
    const pillTypesSnapshot = await get(ref(db, 'pillTypes'));
    if (!pillTypesSnapshot.exists()) {
      console.log('📊 Creating pill types...');
      
      const pillTypes = [
        {
          name: 'Diane-35',
          activeDays: 21,
          breakDays: 7,
          placeboDays: 0,
          description: 'Combined oral contraceptive pill with cyproterone acetate'
        },
        {
          name: 'Althea',
          activeDays: 21,
          breakDays: 7,
          placeboDays: 0,
          description: 'Low-dose combined oral contraceptive'
        },
        {
          name: 'Yasmin',
          activeDays: 21,
          breakDays: 7,
          placeboDays: 0,
          description: 'Combined oral contraceptive with drospirenone'
        },
        {
          name: 'Nordette',
          activeDays: 21,
          breakDays: 7,
          placeboDays: 0,
          description: 'Combined oral contraceptive pill'
        }
      ];

      for (const pillType of pillTypes) {
        await createPillType(pillType);
      }
    }

    // Check if quotes exist
    const quotesSnapshot = await get(ref(db, 'quotes'));
    if (!quotesSnapshot.exists()) {
      console.log('💬 Creating motivational quotes...');
      
      const quotes = [
        {
          message: "You're doing amazing! Keep up with your pill routine! 🦫💕",
          category: 'motivation'
        },
        {
          message: "Consistency is key! Your capybara friend believes in you! ✨",
          category: 'motivation'
        },
        {
          message: "Great job taking your pill today! You're so responsible! 🌸",
          category: 'celebration'
        },
        {
          message: "Another day, another step towards your health goals! 💪",
          category: 'celebration'
        },
        {
          message: "Don't forget your pill today! Your capybara is cheering you on! 🦫",
          category: 'reminder'
        },
        {
          message: "Time for your daily pill! You've got this! 💊",
          category: 'reminder'
        },
        {
          message: "Rest day vibes! Enjoy your break, you deserve it! 🌺",
          category: 'rest_day'
        },
        {
          message: "Rest days are just as important! Relax and recharge! 🦫💤",
          category: 'rest_day'
        }
      ];

      for (const quote of quotes) {
        await createQuote(quote);
      }
    }

    console.log('✅ Realtime Database initialized successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return { success: false, error: error.message };
  }
};

// Real-time listeners
export const onUserChange = (userId, callback) => {
  const userRef = ref(db, `users/${userId}`);
  onValue(userRef, callback);
  return () => off(userRef, 'value', callback);
};

export const onPillTrackingChange = (userId, callback) => {
  const trackingRef = ref(db, 'pillTracking');
  onValue(trackingRef, (snapshot) => {
    if (snapshot.exists()) {
      const allTracking = snapshot.val();
      const userTracking = Object.entries(allTracking)
        .filter(([key, value]) => value.userId === userId)
        .map(([key, value]) => ({ id: key, ...value }));
      callback({ val: () => userTracking });
    } else {
      callback({ val: () => [] });
    }
  });
  return () => off(trackingRef, 'value');
};
