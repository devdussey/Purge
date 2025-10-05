# Landing Page Deployment Guide

## What's Included

The landing page features:
- ✅ Hero section with CTA buttons
- ✅ Real-time beta stats (from your Firebase data)
- ✅ 6 feature cards showcasing Purge's capabilities
- ✅ Beta signup form (saves to Firebase)
- ✅ Responsive design (mobile-friendly)
- ✅ Brand colors (cyan/purple gradient theme)

## Quick Start (Local Testing)

1. Open `landing-page/index.html` in your browser
2. Update Firebase config (lines 359-365) with your credentials
3. Test the beta signup form

## Deployment Options

### Option 1: Firebase Hosting (Recommended - Free)

**Why Firebase Hosting?**
- Free tier includes 10GB storage, 360MB/day transfer
- Automatic HTTPS
- Global CDN
- Perfect integration with your existing Firebase project

**Steps:**

1. Install Firebase CLI (if not already):
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Initialize hosting in your project:
   ```bash
   firebase init hosting
   ```
   - Select your existing project
   - Set public directory to: `landing-page`
   - Configure as single-page app: **No**
   - Set up automatic builds: **No**

4. Update Firebase config in `index.html`:
   - Replace `YOUR_API_KEY` with your actual Firebase credentials
   - Update Discord/Twitter/GitHub links

5. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

6. Your site will be live at: `https://YOUR_PROJECT_ID.web.app`

7. (Optional) Add custom domain:
   - Go to Firebase Console → Hosting → Add custom domain
   - Follow DNS setup instructions
   - Example: `purge.io` or `getpurge.app`

### Option 2: Vercel (Alternative - Also Free)

1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. Deploy:
   ```bash
   cd landing-page
   vercel
   ```
4. Follow prompts, then your site is live!

### Option 3: Netlify (Alternative)

1. Drag & drop the `landing-page` folder to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Done! Site is live instantly.

### Option 4: GitHub Pages (Free but requires GitHub)

1. Create a new GitHub repo: `purge-landing`
2. Push landing-page folder:
   ```bash
   cd landing-page
   git init
   git add .
   git commit -m "Initial landing page"
   git remote add origin https://github.com/YOUR_USERNAME/purge-landing.git
   git push -u origin main
   ```
3. Enable GitHub Pages in repo settings
4. Site live at: `https://YOUR_USERNAME.github.io/purge-landing/`

## Post-Deployment Checklist

### 1. Update Firestore Rules for Beta Signups

Add this to your `firestore.rules`:

```javascript
// Beta Signups - Write only
match /beta_signups/{signupId} {
  allow read: if false; // Never allow clients to read signups
  allow write: if request.auth == null && // Allow anonymous writes
                  request.resource.data.email is string &&
                  request.resource.data.email.matches('.*@.*\\..*') && // Basic email validation
                  request.resource.data.timestamp is timestamp &&
                  request.resource.data.source is string;
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### 2. Update Links in Landing Page

Edit `landing-page/index.html`:

- **Line 359-365**: Firebase config
- **Line 231**: Discord invite link
- **Line 419**: Discord link (footer)
- **Line 420**: Twitter link (footer)
- **Line 421**: GitHub link (footer)

### 3. Test Beta Signup Flow

1. Visit your deployed site
2. Enter test email in signup form
3. Check Firebase Console → Firestore → `beta_signups` collection
4. Verify email appears with timestamp

### 4. Set Up Email Automation (Optional)

**Option A: Firebase Cloud Functions (Automated)**

Create a function to auto-send emails when someone signs up:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendBetaInvite = functions.firestore
  .document('beta_signups/{signupId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    // Send email with download link & Discord invite
    // (Setup nodemailer with your email service)
  });
```

**Option B: Manual (Simpler for Beta)**

1. Export signups from Firebase Console
2. Manually send invite emails weekly
3. Include:
   - Download link for Purge installer
   - Discord invite link
   - Quick start guide

### 5. Add Analytics (Optional)

Add Google Analytics to track visitors:

```html
<!-- Add before </head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Custom Domain Setup

### Recommended Domains
- `purge.io` (premium, ~$3000/year)
- `getpurge.app` (~$15/year)
- `purgecrypto.com` (~$12/year)
- `purgesecurity.io` (~$30/year)

### Steps (Firebase Hosting)
1. Buy domain from Namecheap/Google Domains
2. Firebase Console → Hosting → Add custom domain
3. Add DNS records as shown:
   - A record: `151.101.1.195`
   - A record: `151.101.65.195`
4. Wait 24-48hrs for DNS propagation
5. Firebase auto-provisions SSL certificate

## Monitoring Beta Signups

### View Signups in Firebase Console

1. Firebase Console → Firestore Database
2. Click `beta_signups` collection
3. See all signups with timestamps

### Export to CSV

1. Use Firebase Console export feature, OR
2. Run this script:

```javascript
// Export signups
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

async function exportSignups() {
  const snapshot = await db.collection('beta_signups').get();
  snapshot.forEach(doc => {
    console.log(doc.data().email, doc.data().timestamp);
  });
}

exportSignups();
```

## Next Steps After Launch

1. **Post to Reddit** (r/CryptoSecurity, r/cryptocurrency)
   - Include landing page link
   - Highlight unique features vs traditional AV

2. **Submit to Product Hunt**
   - Best day: Tuesday-Thursday
   - Include screenshots, demo video
   - Engage with comments

3. **Tweet Launch**
   - Tag crypto influencers
   - Include stats from Beta dashboard
   - Add demo GIF/video

4. **Update Landing Page Stats**
   - Manually update stats in HTML (lines 197-216)
   - OR connect to Firebase analytics_summary collection

## Troubleshooting

**Firebase config not working:**
- Check browser console for errors
- Verify API key is correct
- Ensure Firestore rules are deployed

**Signups not appearing in Firebase:**
- Check browser console for errors
- Verify `beta_signups` collection exists
- Check Firestore rules allow writes

**Images not loading:**
- Move images to `landing-page/` folder
- Update image paths in HTML
- For Firebase Hosting, use relative paths

---

**Need help?** Check Firebase docs or Discord community!
