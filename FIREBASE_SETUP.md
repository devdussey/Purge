# Firebase Setup Guide for Purge Beta Telemetry

## Overview
This guide will help you set up Firebase for Purge's beta telemetry, crash reporting, and feedback system.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Name your project: `purge-antivirus-beta` (or your preferred name)
4. Disable Google Analytics (optional for telemetry project)
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Register app name: `Purge Antivirus`
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the `firebaseConfig` object (you'll need this next)

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase credentials from Step 2:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=purge-antivirus-beta.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=purge-antivirus-beta
   VITE_FIREBASE_STORAGE_BUCKET=purge-antivirus-beta.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_FIREBASE_MEASUREMENT_ID=G-ABC123 (optional)
   ```

3. Add `.env` to `.gitignore` (should already be there)

## Step 4: Set Up Firestore Database

1. In Firebase Console, click **Firestore Database** (left sidebar)
2. Click "Create database"
3. Choose **Production mode** (we have custom rules)
4. Select your region (choose closest to your users, e.g., `us-central1`)
5. Click "Enable"

## Step 5: Deploy Firestore Security Rules

1. Install Firebase CLI (if not installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```
   - Select your project
   - Use default `firestore.rules` file (already created)
   - Use default `firestore.indexes.json`

4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Step 6: Create Firestore Indexes (Optional but Recommended)

Add these indexes for better query performance:

1. Go to Firebase Console > Firestore Database > Indexes
2. Create composite indexes:

   **Index 1: Telemetry Events by Time**
   - Collection ID: `telemetry_events`
   - Fields: `type` (Ascending), `timestamp` (Descending)

   **Index 2: Crash Reports by Time**
   - Collection ID: `crash_reports`
   - Fields: `timestamp` (Descending)

   **Index 3: Feedback by Type**
   - Collection ID: `beta_feedback`
   - Fields: `type` (Ascending), `timestamp` (Descending)

## Step 7: Test the Connection

1. Rebuild your app:
   ```bash
   npm run build-electron
   ```

2. Run the app:
   ```bash
   npm run electron
   ```

3. Check browser console - you should see:
   ```
   Firebase initialized successfully
   ```

4. Navigate to the Beta tab and submit test feedback
5. Check Firebase Console > Firestore Database to verify data appears

## Firestore Collections Created

Your telemetry system will use these collections:

- **`telemetry_events`** - App telemetry (detections, performance, errors)
- **`crash_reports`** - Crash reports with stack traces
- **`beta_feedback`** - User feedback (bugs, features, praise)
- **`beta_users`** - User session tracking
- **`analytics_summary`** - Aggregated analytics (manual/Cloud Functions)

## Security Notes

✅ **What's Protected:**
- All writes are anonymous (no auth required)
- Clients can only write, never read
- Data is sanitized before upload
- No PII collected by default

⚠️ **Important:**
- Never commit your `.env` file
- Firebase API key is safe to expose (protected by Firestore rules)
- Keep your Firebase project private

## Viewing Analytics Data

### Option 1: Firebase Console (Simple)
1. Go to Firebase Console > Firestore Database
2. Click on collections to view raw data
3. Export to CSV for analysis

### Option 2: Build Analytics Dashboard (Advanced)
You can build a separate admin dashboard that reads from `analytics_summary` collection:
```javascript
// Admin-only code (separate project)
const analytics = await getDoc(doc(db, 'analytics_summary', 'latest'));
```

### Option 3: Cloud Functions (Recommended for Scale)
Create Cloud Functions to aggregate data automatically:
```javascript
// functions/index.js
exports.aggregateAnalytics = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    // Aggregate telemetry_events → analytics_summary
  });
```

## Troubleshooting

**Issue: "Firebase not configured" warning**
- Check that `.env` file exists and has correct values
- Verify `VITE_` prefix on all environment variables
- Restart dev server after changing `.env`

**Issue: Permission denied errors**
- Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Check that data structure matches interfaces in `FirebaseTelemetry.ts`

**Issue: Data not appearing in Firestore**
- Check browser console for errors
- Verify internet connection
- Check Firebase Console > Firestore Database > Usage tab

## Next Steps

1. ✅ Set up Discord server for beta community
2. ✅ Create landing page for beta signup
3. ✅ Monitor telemetry data for first beta users
4. ✅ Use analytics to improve product

---

**Need help?** Check [Firebase Documentation](https://firebase.google.com/docs/firestore) or ask in Discord.
