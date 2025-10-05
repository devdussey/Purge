# Firebase Authentication Setup Guide

## Overview

Purge now requires users to create an account before using the app. This guide explains how to enable Firebase Authentication for your project.

## Prerequisites

- Firebase project already created (see `FIREBASE_SETUP.md`)
- Firebase CLI installed
- `.env` file configured with Firebase credentials

## Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your Purge project
3. Click **Authentication** in left sidebar
4. Click **Get Started** (if first time)
5. Click **Sign-in method** tab
6. Click **Email/Password** provider
7. Toggle **Enable** switch
8. Click **Save**

## Step 2: Deploy Firestore Security Rules

The updated `firestore.rules` file now requires authentication for most operations:

```bash
firebase deploy --only firestore:rules
```

### Security Rules Overview

- **`users` collection**: Users can only read/write their own profile
- **Telemetry/Crash/Feedback**: Write-only, authenticated users only
- **Analytics Summary**: Read-only for authenticated users
- **Beta Signups**: Anonymous writes allowed (for landing page)

## Step 3: Configure Email Templates (Optional but Recommended)

1. Firebase Console → Authentication → Templates
2. Customize these email templates:
   - **Email verification** - Sent when users sign up
   - **Password reset** - Sent when users forget password
   - **Email change verification** - Sent when users change email

### Recommended Customizations:

**Email Verification Template:**
```
Subject: Welcome to Purge - Verify Your Email

Hi %DISPLAY_NAME%,

Thanks for joining Purge! Click below to verify your email:

%LINK%

Welcome to the next generation of crypto security.

- The Purge Team
```

**Password Reset Template:**
```
Subject: Reset Your Purge Password

Hi,

Someone requested a password reset for your Purge account. If this was you, click below:

%LINK%

If you didn't request this, you can safely ignore this email.

- The Purge Team
```

## Step 4: Test Authentication Flow

### Signup Flow:
1. Run the app: `npm run electron`
2. Click **Sign up** on auth screen
3. Fill in display name, email, password
4. Click **Create Account**
5. You should see success message
6. Check email for verification link

### Login Flow:
1. Click **Sign in** on auth screen
2. Enter email and password
3. Click **Sign In**
4. You should be logged into the main app

### Password Reset:
1. Click **Forgot password?** on login screen
2. Enter your email
3. Click the button
4. Check email for reset link

## Step 5: Verify Firestore Data

After signup, check Firebase Console → Firestore Database:

### `users` collection:
```json
{
  "uid": "user_id_here",
  "email": "user@example.com",
  "displayName": "John Doe",
  "createdAt": "2025-10-04T...",
  "lastLoginAt": "2025-10-04T...",
  "emailVerified": false,
  "betaTester": true
}
```

### `telemetry_events`, `crash_reports`, `beta_feedback`:
- These collections will populate as users use the app
- Only writable by authenticated users
- Never readable by clients (server/admin only)

## Common Issues

### "Permission denied" errors:
- Make sure Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Check Firebase Console → Firestore → Rules tab

### Email verification not sending:
- Check Firebase Console → Authentication → Templates
- Verify email domain is authorized in Firebase settings
- Check spam folder

### "Email already in use":
- That email is already registered
- Use password reset if you forgot your password
- Or use a different email address

### "Weak password":
- Passwords must be at least 6 characters
- Firebase enforces this minimum

## User Management

### View All Users:
Firebase Console → Authentication → Users

### Delete a User:
1. Find user in Authentication → Users
2. Click **...** menu → Disable/Delete user
3. User's Firestore data will remain (must delete manually if needed)

### Reset User Password (Admin):
1. Firebase Console → Authentication → Users
2. Click user → **Reset password**
3. Firebase sends password reset email

## Email Domain Verification (Production)

For production, you may want to verify your email domain:

1. Firebase Console → Authentication → Settings
2. Scroll to **Authorized domains**
3. Add your domain (e.g., `purge.dussey.dev`)
4. This prevents phishing attacks using your Firebase project

## Next Steps

1. **Test the full flow** with a real email address
2. **Customize email templates** with your branding
3. **Build installer**: `npm run dist`
4. **Deploy updated Firestore rules**: `firebase deploy --only firestore:rules`
5. **Monitor users** in Firebase Console during beta

## Security Best Practices

✅ **DO:**
- Keep Firebase API key in `.env` (not committed to git)
- Deploy Firestore rules before going live
- Regularly review Firebase Console → Authentication → Users
- Enable email verification before allowing critical actions

❌ **DON'T:**
- Commit `.env` file to version control
- Use demo/placeholder Firebase credentials in production
- Allow anonymous auth without proper security rules
- Store sensitive user data in Firestore (use hashing)

## Support

If you encounter issues:
1. Check Firebase Console → Functions → Logs for errors
2. Check browser console for authentication errors
3. Verify Firestore rules are deployed correctly
4. Test with a fresh incognito window (to clear cached auth state)

---

**Need help?** Check the [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
