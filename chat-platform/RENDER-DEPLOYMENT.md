# ChatHub - Render Deployment Guide

## Prerequisites
- GitHub account with repository containing ChatHub code
- Render account (https://render.com)
- Firebase project (already configured in app)

## Quick Deployment Steps

### 1. Prepare for Deployment

Make sure all files are committed to Git:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Web Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in the following:
   - **Name:** chathub
   - **Environment:** Node
   - **Region:** Oregon (or your preferred region)
   - **Branch:** main
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for better performance)

### 3. Set Environment Variables

In Render dashboard, go to Environment:

```
PORT=3000
NODE_ENV=production
```

### 4. Deploy

Click "Create Web Service" and Render will:
- Pull your code from GitHub
- Install dependencies (`npm install`)
- Start the server (`npm start`)
- Assign a URL (https://chathub-xxxxx.onrender.com)

## Important Notes

### Static Site Deactivation
- This is NOT a static site deployment
- Use Web Service (not Static Site) because we have a Node.js server
- The server at `server.js` serves all files

### Firebase Configuration
- Firebase config is hardcoded in `js/firebase.js`
- Credentials are public (JavaScript SDK limitation)
- This is normal and expected for Firebase web apps
- All sensitive operations use Firebase Security Rules

### Tenor API Key
- GIF picker uses API key: `AIzaSyDVGpa-xoE0MbB272-ZYL_mk3lK1AMKpRY`
- This is in `app.html` and `messages.html`
- Consider regenerating it or moving to environment variables in the future

### Database Structure
- Firebase Firestore must be set up with proper collections
- See `CONFIG.md` for database structure
- Set proper Security Rules in Firebase console

## Troubleshooting

### "Cannot GET /" Error
- Ensure `server.js` is in the root directory
- Check `package.json` has correct start script
- View logs in Render dashboard

### Module Not Found Error
- Ensure `package.json` dependencies are correct
- Check node_modules are not in .gitignore
- Dependencies should be installed from package.json

### Firebase Connection Issues
- Verify Firebase project ID is correct
- Check Firebase Firestore is enabled
- Ensure Firebase Authentication is set up
- Review Firebase Security Rules

### Slow First Load
- Normal on free Render plan
- First request may take 30+ seconds after inactivity
- Upgrade to paid plan for consistent performance

## Maintenance

### Update Code
```bash
git push origin main
```
Render automatically redeploys on push (if auto-deploy is enabled)

### View Logs
- In Render dashboard → Service → Logs
- Check for errors and warnings

### Monitor Performance
- Use Render's analytics dashboard
- Monitor database operations in Firebase console

## Advanced Configuration

### Custom Domain
1. Go to Service Settings in Render
2. Add custom domain
3. Update DNS records as instructed

### Environment Variables
For sensitive data, use .env file (not in repository):
- Create `.env` file locally (do NOT commit)
- Add production secrets
- Render will load from environment settings

### Auto-Deploy Configuration
- In Render dashboard → Settings
- Enable/disable auto-deploy on push
- Configure branch to deploy

## Production Checklist

- [ ] Firebase Firestore Security Rules are set correctly
- [ ] Authentication enabled only for authorized users
- [ ] Moderation rules configured in admin panel
- [ ] Theme system working on all pages
- [ ] GIF picker functioning (test with search)
- [ ] All navigation links working
- [ ] Messages loading and sending properly
- [ ] User profiles displaying correctly
- [ ] Admin panel accessible only to admins
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled (automatic with Render)
- [ ] Error logging configured

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Node.js Docs:** https://nodejs.org/en/docs/

## Security Considerations

⚠️ **Important:**
1. Never commit `.env` files with secrets
2. Rotate API keys periodically
3. Review Firebase Security Rules regularly
4. Monitor admin access logs
5. Use strong passwords for admin accounts
6. Enable 2FA in Firebase console

---

**Deployed ChatHub Version:** 1.0.0
**Last Updated:** March 12, 2026
