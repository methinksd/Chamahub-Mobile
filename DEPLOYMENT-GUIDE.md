# Chamahub Mobile App - Complete Deployment Guide

## 📱 Overview

This guide covers deploying all three components of Chamahub:
1. **Backend** (Java Spring Boot) → Render
2. **Mobile App** (Ionic/Angular) → Build APK and distribute
3. **Download Page** (Static HTML) → Vercel

---

## 🚀 Step 1: Deploy Backend to Render

### Prerequisites
- GitHub account with Chamahub-Backend repository pushed
- Render account (free tier works fine)

### Deployment Steps

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Evans-dev-code/Chamahub-Backend`
   - Or use direct Git URL

3. **Configure Service Settings:**
   ```
   Name: chama-hub-backend
   Region: Choose nearest to users (e.g., Oregon, Frankfurt)
   Branch: main (or master)
   Runtime: Java
   Build Command: ./gradlew clean build -x test
   Start Command: java -Dspring.profiles.active=prod -jar build/libs/*.jar
   ```

4. **Add Environment Variables:**
   Click "Environment" tab and add:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=your-mysql-or-postgresql-connection-string
   DATABASE_USERNAME=your-db-username
   DATABASE_PASSWORD=your-db-password
   JWT_SECRET=your-super-secret-jwt-key-min-256-bits
   JWT_EXPIRATION=86400000
   PORT=8080
   ```

5. **Create Database (Optional - Use Render PostgreSQL)**
   - Go to "New +" → "PostgreSQL"
   - Name: `chamahub-db`
   - Copy connection string and update backend env variables
   - Note: You'll need to convert MySQL queries to PostgreSQL if using PostgreSQL

6. **Deploy Backend**
   - Click "Create Web Service"
   - Wait for build to complete (5-10 minutes first time)
   - Your backend will be live at: `https://chama-hub-backend.onrender.com`

7. **Test Backend:**
   ```bash
   curl https://chama-hub-backend.onrender.com/api/health
   ```

---

## 📲 Step 2: Build and Deploy Mobile App

### Prerequisites
- Node.js v22+
- Ionic CLI
- Android Studio with SDK
- Java 21 (already installed at C:\Users\User\.jdk\jdk-21.0.8)

### Build Release APK

1. **Set Java Environment** (Already done based on terminal history):
   ```powershell
   $env:JAVA_HOME = "C:\Users\User\.jdk\jdk-21.0.8"
   $env:PATH = "C:\Users\User\.jdk\jdk-21.0.8\bin;$env:PATH"
   ```

2. **Verify Mobile App Configuration:**
   
   Check that `src/environments/environment.prod.ts` has correct backend URL:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://chama-hub-backend.onrender.com/api',
     webAppUrl: 'https://chamahub.vercel.app'
   };
   ```

3. **Build and Sync:**
   ```powershell
   cd C:\Users\User\Projects\Chamahub\Chamahub-Mobile
   
   # Install dependencies if needed
   npm install --legacy-peer-deps
   
   # Build the app
   npm run build
   
   # Sync with Android
   npx cap sync android
   ```

4. **Build Release APK:**
   ```powershell
   cd android
   .\gradlew assembleRelease
   ```

5. **Find Your APK:**
   The release APK will be at:
   ```
   C:\Users\User\Projects\Chamahub\Chamahub-Mobile\android\app\build\outputs\apk\release\app-release.apk
   ```

6. **Sign APK (For Production):**
   
   If you haven't created a keystore yet:
   ```powershell
   # Generate keystore
   keytool -genkey -v -keystore chamahub-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias chamahub
   
   # Sign the APK
   jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore chamahub-release-key.jks android\app\build\outputs\apk\release\app-release.apk chamahub
   
   # Verify signature
   jarsigner -verify -verbose -certs android\app\build\outputs\apk\release\app-release.apk
   ```

---

## 🌐 Step 3: Deploy Download Page to Vercel

### Prerequisites
- Vercel account linked to GitHub
- Vercel CLI installed globally

### Deployment Steps

1. **Login to Vercel** (Already done based on terminal history):
   ```powershell
   cd C:\Users\User\Projects\Chamahub\Chamahub-Mobile\download-page
   npx vercel login
   ```

2. **Initial Setup:**
   ```powershell
   npx vercel
   ```
   - Select scope (your account)
   - Link to existing project? **No**
   - Project name: **chamahub-mobile-download**
   - Directory: **./download-page** (or current directory if already in it)
   - Override settings? **No**

3. **Deploy to Production:**
   ```powershell
   npx vercel --prod
   ```

4. **Update APK Download Link:**
   
   After building the APK, upload it to a hosting service:
   - **Option A:** GitHub Releases (Recommended)
   - **Option B:** Firebase Storage
   - **Option C:** AWS S3/Cloudfront
   
   Then update `download-page/index.html` with the direct download URL.

---

## ✅ Step 4: Testing the Complete Flow

### 1. Test Backend Connectivity:
```bash
# Health check
curl https://chama-hub-backend.onrender.com/api

# Test signup
curl -X POST https://chama-hub-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!","role":"user"}'

# Test login
curl -X POST https://chama-hub-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"testuser","password":"Test123!"}'
```

### 2. Install and Test Mobile App:

1. Transfer APK to Android device:
   ```powershell
   # Option 1: USB transfer
   adb install android\app\build\outputs\apk\release\app-release.apk
   
   # Option 2: Email/Cloud transfer
   # Send APK to your phone and install manually
   ```

2. **Enable "Install from Unknown Sources"** on Android device

3. **Test the app:**
   - Open Chamahub app
   - Try signup with a new account
   - Verify you can login
   - Check that you can select/join a chama
   - Navigate through tabs (Home, Loans, Payments, Profile)

### 3. Monitor Backend Logs:
   - Go to Render Dashboard → Your Service → Logs tab
   - Watch for incoming requests from mobile app
   - Check for any CORS errors (should be none now)

---

## 🔧 Troubleshooting

### Issue: "Network Error" or "Failed to fetch"

**Cause:** CORS or network connectivity issue

**Solution:**
1. ✅ **Already Fixed:** Updated backend CORS configuration
2. ✅ **Already Fixed:** Updated Android network security config
3. Verify backend is running on Render
4. Check device has internet connection
5. Try on WiFi vs Mobile data

### Issue: "401 Unauthorized" after login

**Cause:** JWT token not being stored or sent correctly

**Solution:**
1. Clear app data: Settings → Apps → Chamahub → Storage → Clear Data
2. Reinstall the app
3. Check if token is being saved: Look at AuthService logs

### Issue: Backend is slow to respond (Cold start)

**Cause:** Render free tier spins down after 15 minutes of inactivity

**Solution:**
- First request after idle takes 30-60 seconds (cold start)
- Consider upgrading to Render paid tier for always-on instances
- Or: Use a cron job to ping your backend every 10 minutes

### Issue: APK won't install on device

**Cause:** Unsigned APK or wrong architecture

**Solution:**
1. Make sure device allows installation from unknown sources
2. Sign the APK with a keystore (see signing steps above)
3. Build specific architecture:
   ```powershell
   .\gradlew assembleRelease -PbuildArch=arm64-v8a
   ```

---

## 📊 Post-Deployment Checklist

- [ ] Backend deployed and accessible at `https://chama-hub-backend.onrender.com`
- [ ] Database connected and tables created
- [ ] Environment variables set on Render
- [ ] CORS allows mobile app origins
- [ ] Mobile app built with production environment
- [ ] APK signed with release keystore
- [ ] APK tested on physical device
- [ ] Signup/Login flow works end-to-end
- [ ] Network connectivity confirmed (can select chama)
- [ ] Download page deployed to Vercel
- [ ] Download link works (returns APK file)

---

## 🎯 Next Steps After Deployment

1. **Set up CI/CD:**
   - Automatic deployments from GitHub on push to main
   - Render auto-deploys backend on git push
   - Use GitHub Actions for mobile builds

2. **Monitor Application:**
   - Set up error tracking (Sentry, Bugsnag)
   - Monitor API usage on Render
   - Track user analytics

3. **Publish to Google Play Store:**
   - Create Google Play Developer account ($25 one-time fee)
   - Create app listing
   - Upload signed APK (or better: AAB bundle)
   - Fill out privacy policy, screenshots, etc.
   - Submit for review

4. **Future Enhancements:**
   - Push notifications with Firebase Cloud Messaging
   - Offline mode with local SQLite database
   - Biometric authentication
   - Dark mode implementation

---

## 📞 Support

If you encounter issues:
1. Check Render logs for backend errors
2. Use Chrome DevTools to inspect mobile app network requests
3. Review Android logcat: `adb logcat | grep Chamahub`

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Ionic Deployment Guide](https://ionicframework.com/docs/deployment/app-store)
- [Vercel Documentation](https://vercel.com/docs)

---

**Last Updated:** February 12, 2026  
**Status:** ✅ Ready for deployment with fixed CORS and network security
