# Firebase Realtime Database Setup Guide for Milady Pill Tracker

## Quick Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it: `milady-pill-tracker`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Realtime Database
1. In your Firebase project, go to "Realtime Database"
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location (Asia-Southeast1)
5. Click "Done"

### 3. Enable Authentication
1. Go to "Authentication" in the Firebase console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### 4. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add web app
4. Register app name: `milady-pill-tracker`
5. Copy the config object

### 5. Update Firebase Configuration
Your config in `src/utils/firebase.js` should include the databaseURL:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAo7ZfcJLBEKgVof-iMLofdMLKK_KjFo1Q",
  authDomain: "milady-bc86b.firebaseapp.com",
  databaseURL: "https://milady-bc86b-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "milady-bc86b",
  storageBucket: "milady-bc86b.firebasestorage.app",
  messagingSenderId: "152644290185",
  appId: "1:152644290185:web:0c508ff8139e594f786858",
  measurementId: "G-RSLCLNDYH6"
};
```

### 6. Set Realtime Database Security Rules (Development)
In Realtime Database > Rules tab, use these rules for development:

**Important Note:** This project uses **Firebase Realtime Database**, not Cloud Firestore.

```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": "$userId === auth.uid",
        ".write": "$userId === auth.uid"
      }
    },
    "pillTracking": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$trackingId": {
        ".validate": "newData.hasChildren(['userId', 'date', 'taken'])"
      }
    },
    "pillTypes": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "quotes": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "reminders": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$reminderId": {
        ".validate": "newData.hasChildren(['userId'])"
      }
    }
  }
}
```

### 7. Verify Your Configuration is for Realtime Database
Your `src/utils/firebase.js` should import Realtime Database functions:

```javascript
// ✅ CORRECT for Realtime Database
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Realtime Database
import { getAuth } from "firebase/auth";

// ❌ WRONG - This would be for Firestore
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Your config (databaseURL required for Realtime Database)
  apiKey: "AIzaSyAo7ZfcJLBEKgVof-iMLofdMLKK_KjFo1Q",
  authDomain: "milady-bc86b.firebaseapp.com",
  databaseURL: "https://milady-bc86b-default-rtdb.asia-southeast1.firebasedatabase.app/", // Required!
  projectId: "milady-bc86b",
  storageBucket: "milady-bc86b.firebasestorage.app",
  messagingSenderId: "152644290185",
  appId: "1:152644290185:web:0c508ff8139e594f786858"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); // ✅ Realtime Database
export const auth = getAuth(app);
```

## Initialize Data

After setting up Firebase, run this in your browser console on your app to initialize data:

```javascript
// Initialize Realtime Database data (pill types and quotes)
import { api } from './src/utils/api.js';
await api.initializeFirebaseData();
```

## Key Differences: Realtime Database vs Firestore

**Your app now uses Realtime Database:**

| Feature | Realtime Database (Your Setup) | Firestore |
|---------|--------------------------------|-----------|
| Import | `getDatabase()` | `getFirestore()` |
| API | `ref()`, `onValue()`, `set()` | `collection()`, `doc()` |
| Config | Needs `databaseURL` | Uses `projectId` |
| Data Structure | JSON tree | Documents/Collections |
| Queries | Limited querying | Rich querying |
| Rules | Path-based | Document-based |

## Realtime Database Structure

Your data will be stored in a JSON tree format:

```json
{
  "users": {
    "userId1": {
      "email": "user@example.com",
      "nickname": "UserName",
      "capybaraName": "CappyName",
      "pillType": "Diane-35",
      "startDate": "2025-01-01",
      "role": "user",
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  },
  "pillTypes": {
    "typeId1": {
      "name": "Diane-35",
      "activeDays": 21,
      "breakDays": 7,
      "placeboDays": 0,
      "description": "Combined oral contraceptive",
      "createdAt": 1234567890
    }
  },
  "pillTracking": {
    "userId1_2025-01-01": {
      "userId": "userId1",
      "date": "2025-01-01",
      "taken": true,
      "notes": null,
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  },
  "quotes": {
    "quoteId1": {
      "message": "You're doing amazing! 🦫💕",
      "category": "motivation",
      "createdAt": 1234567890
    }
  },
  "reminders": {
    "reminderId1": {
      "userId": "userId1",
      "reminderTime": "09:00",
      "enabled": true,
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  }
}
```

## Benefits of Realtime Database Migration

No more CORS issues - Direct client-side database access
Better reliability - Google's infrastructure
Real-time updates - Live data synchronization as name suggests
Built-in authentication - Secure user management
Automatic scaling - Handles traffic spikes
Offline support - Works without internet
Simple JSON structure - Easy to understand and debug
Real-time listeners - Instant updates across all connected clients

## Ready to Use

Once you've completed the setup:
1. Your app will use Realtime Database instead of MySQL
2. No more PHP backend needed
3. No more XAMPP dependency
4. Real-time synchronization across all devices
5. Better performance and reliability
