// 🦫💊 Firebase Configuration for LoveYou Pill Tracker
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

let app = null;
let db = null;
let auth = null;
let analytics = null;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Firebase services
  db = getDatabase(app);
  auth = getAuth(app);
  
  // Analytics might fail in development, so wrap in try-catch
  try {
    analytics = getAnalytics(app);
  } catch (analyticsError) {
    console.warn('Firebase Analytics not available:', analyticsError);
  }
  
  console.log('🔥 Firebase initialized successfully');
} catch (error) {
  console.error('🚫 Firebase initialization failed:', error);
}

export { db, auth, analytics };
export default app;
