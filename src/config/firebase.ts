import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > Your apps > Web app
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: process.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || 'YOUR_MEASUREMENT_ID'
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let analytics: Analytics | null = null;

// Initialize Firebase
export function initializeFirebase() {
  try {
    // Check if we're in a browser environment and not already initialized
    if (typeof window !== 'undefined' && !app) {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);

      // Analytics only works in browser, not in Electron main process
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn('Firebase Analytics not available (this is normal in Electron)');
      }

      console.log('Firebase initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
}

// Get Firestore instance
export function getDb(): Firestore {
  if (!db) {
    initializeFirebase();
  }
  return db;
}

// Get Auth instance
export function getFirebaseAuth(): Auth {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
}

// Get Analytics instance (may be null in Electron)
export function getFirebaseAnalytics(): Analytics | null {
  return analytics;
}

// Check if Firebase is configured (not using placeholder values)
export function isFirebaseConfigured(): boolean {
  return firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
         firebaseConfig.projectId !== 'YOUR_PROJECT_ID';
}

// Firestore collection names
export const COLLECTIONS = {
  TELEMETRY_EVENTS: 'telemetry_events',
  CRASH_REPORTS: 'crash_reports',
  FEEDBACK: 'beta_feedback',
  USERS: 'beta_users',
  ANALYTICS: 'analytics_summary'
} as const;
