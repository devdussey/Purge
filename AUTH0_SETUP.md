# Auth0 Setup Guide for Purge

## Quick Setup

1. **Create Auth0 Account**
   - Go to https://auth0.com
   - Sign up for free (supports 7,000 active users)
   - Create a new tenant (e.g., "purge-beta")

2. **Create Application**
   - Go to **Applications** → **Create Application**
   - Name: "Purge"
   - Type: **Single Page Application**
   - Click **Create**

3. **Configure Application Settings**
   - In your application settings, add these URLs:
     - **Allowed Callback URLs**: `https://purge.dussey.dev, http://localhost:5173`
     - **Allowed Logout URLs**: `https://purge.dussey.dev, http://localhost:5173`
     - **Allowed Web Origins**: `https://purge.dussey.dev, http://localhost:5173`
   - Click **Save Changes**

4. **Get Your Credentials**
   - Copy your **Domain** (e.g., `dev-abc123.us.auth0.com`)
   - Copy your **Client ID** (e.g., `Ab1Cd2Ef3Gh4Ij5Kl6Mn7Op8`)

5. **Update .env File**
   ```env
   VITE_AUTH0_DOMAIN=dev-abc123.us.auth0.com
   VITE_AUTH0_CLIENT_ID=Ab1Cd2Ef3Gh4Ij5Kl6Mn7Op8
   VITE_AUTH0_REDIRECT_URI=https://purge.dussey.dev
   ```

6. **Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

## Features Enabled

- ✅ Email/Password authentication
- ✅ Social logins (Google, GitHub, etc.) - Enable in **Authentication** → **Social**
- ✅ Multi-factor authentication (MFA) - Enable in **Security** → **Multi-factor Auth**
- ✅ User management dashboard
- ✅ Forgot password flows
- ✅ Email verification

## Testing

1. Build and run locally:
   ```bash
   npm run build-electron && npm run electron
   ```

2. Click "Sign In / Sign Up"
3. Create a test account
4. Verify email (if enabled)
5. You're in!

## Production Checklist

- [ ] Add your real Auth0 credentials to `.env`
- [ ] Enable email verification in Auth0 dashboard
- [ ] Customize Auth0 login page branding
- [ ] Set up social logins (optional)
- [ ] Configure password policies
- [ ] Deploy to production

## Support

- Auth0 Docs: https://auth0.com/docs
- Purge Support: https://github.com/devdussey/Purge/issues
