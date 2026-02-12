# Chamahub Mobile App Download Page

This folder contains everything needed to host the Chamahub mobile app download page.

## Files
- `index.html` - The download page
- `app-release.apk` - The Android app (6.5 MB)

## Deployment Options

### Option 1: GitHub Pages (FREE - Recommended)

1. **Create a GitHub Repository**
   - Go to https://github.com/new
   - Name it: `chamahub-app-download`
   - Make it Public
   - Click "Create repository"

2. **Upload Files**
   ```bash
   cd C:\Users\User\Projects\Chamahub\Chamahub-Mobile\download-page
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/chamahub-app-download.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `(root)`
   - Click Save

4. **Your Download Link**
   - Will be: `https://YOUR_USERNAME.github.io/chamahub-app-download/`
   - Available in ~2 minutes

### Option 2: Vercel (FREE)

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd C:\Users\User\Projects\Chamahub\Chamahub-Mobile\download-page
   vercel
   ```

3. **Follow Prompts**
   - Login to Vercel (creates free account)
   - Set up and deploy? Yes
   - Project name: chamahub-app-download
   - Directory: ./
   - Override settings? No

4. **Your Download Link**
   - Will be: `https://chamahub-app-download.vercel.app/`
   - Available immediately

### Option 3: Netlify Drop (Easiest - No CLI)

1. Go to https://app.netlify.com/drop
2. Drag and drop the entire `download-page` folder
3. Get instant link: `https://random-name-12345.netlify.app/`
4. Optional: Change to custom domain in Netlify settings

## Updating the App

When you build a new version:

1. Copy the new APK to this folder
2. Update version in `index.html` (line 55)
3. Redeploy using the same method you chose

## Important Notes

⚠️ **GitHub has a 100MB file size limit** - Your APK (6.5MB) is well under this.

⚠️ **Keep the keystore file safe** - You'll need it for future app updates:
- Location: `C:\Users\User\Projects\Chamahub\Chamahub-Mobile\android\chamahub-release.keystore`
- Password: chamahub2026

## Support

Users can download the app by visiting your hosted URL and following the on-screen instructions.

---

**Built with ❤️ for Chamahub Community**
