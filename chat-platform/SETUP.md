# ChatHub - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Create Firebase Project
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project"
3. Name it "ChatHub"
4. Click "Create Project"

### Step 2: Enable Services
1. Go to Authentication → Sign-in method
2. Enable "Email/Password"
3. Go to Firestore Database
4. Click "Create Database" → Select "Start in test mode"
5. Go to Storage → "Get started"

### Step 3: Get Project Credentials
1. Click Project Settings (gear icon)
2. Go to "Your apps" section
3. Click "Add App" → "Web"
4. Copy the configuration code

### Step 4: Update firebase.js
Replace the config in `js/firebase.js`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "YOUR_DATABASE_URL"
};
```

### Step 5: Create First Admin
1. Open `index.html` in browser
2. Sign up new account
3. In Firebase Console → Firestore → users collection
4. Find your user document
5. Edit the `role` field to `"admin"`

### Step 6: Start Using
- **User App**: Open `app.html` after login
- **Admin Panel**: Open `admin.html` (admin access only)

## 🌐 Running Locally

### Using Python
```bash
cd chat-platform
python -m http.server 8000
```
Visit: `http://localhost:8000`

### Using Node.js (http-server)
```bash
npm install -g http-server
http-server .
```
Visit: `http://localhost:8080`

### Using VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Click "Open with Live Server"

## 📊 Testing the Features

### Create a Server
1. Login to `app.html`
2. Click the `+` button in left sidebar
3. Enter server name
4. Click "Create"

### Create a Channel
1. Click on a server
2. Click `+` in channels section
3. Enter channel name
4. Default "general" channel is created automatically

### Send a Message
1. Click on a channel
2. Type message in input box
3. Press Enter or click Send button

### Access Admin Panel
1. Login with admin account
2. Navigate to `admin.html`
3. View dashboard statistics
4. Manage users, servers, reports

## 🛠️ Troubleshooting

### "Not authenticated" Error
- Make sure you've logged in
- Check if Firebase credentials are correct in `firebase.js`
- Clear browser cache and reload

### Can't connect to Firestore
- Verify Firebase project exists
- Check internet connection
- Review Firebase security rules
- Check browser console for errors

### Admin panel not loading
- Make sure your user `role` is set to `"admin"` in Firestore
- Verify you're logged in
- Check browser console for errors

### Messages not appearing
- Check Firestore security rules
- Verify messages are being added to correct collection
- Check browser console for errors
- Reload the page

## 📱 File Descriptions

| File | Purpose |
|------|---------|
| `index.html` | Login/Signup interface |
| `app.html` | Main chat application |
| `admin.html` | Admin dashboard |
| `js/firebase.js` | Firebase setup & exports |
| `js/auth.js` | User authentication |
| `js/servers.js` | Server management |
| `js/channels.js` | Channel management |
| `js/chat.js` | Real-time messaging |
| `js/admin.js` | Admin functionality |
| `js/moderation.js` | Content moderation |
| `css/style.css` | User app styling |
| `css/admin.css` | Admin app styling |

## 🔑 Key Functions

### Authentication
```javascript
handleLogin()      // Login user
handleSignup()     // Create account
handleLogout()     // Logout user
handlePasswordReset() // Reset password
```

### Servers
```javascript
createServer()     // Create new server
selectServer()     // Switch server
deleteServer()     // Delete server
joinServer()       // Join existing server
leaveServer()      // Leave server
```

### Channels
```javascript
createChannel()    // Create channel
deleteChannel()    // Delete channel
loadChannels()     // Load server channels
selectChannel()    // Switch channel
```

### Messages
```javascript
loadMessages()     // Load channel messages
sendMessage()      // Send message
deleteMessage()    // Delete message
editMessage()      // Edit message
reactToMessage()   // Add emoji reaction
```

### Admin
```javascript
loadUsers()        // Load all users
adminBanUser()     // Ban user
adminDeleteUser()  // Delete user account
loadReports()      // Load user reports
loadAuditLogs()    // Load admin actions
```

### Moderation
```javascript
checkMessageContent() // Scan for violations
muteUser()         // Mute user
warnUser()         // Issue warning
isUserMuted()      // Check mute status
```

## 🎯 Next Steps

1. **Customize Branding**
   - Change "ChatHub" to your app name
   - Update colors in CSS files
   - Add custom logo

2. **Add More Features**
   - Video/voice calls
   - File uploads
   - Message search
   - User presence map

3. **Enhance Security**
   - Update Firestore rules
   - Add input validation
   - Enable reCAPTCHA
   - Add 2FA for admins

4. **Deploy Your App**
   - Firebase Hosting
   - Vercel
   - Netlify
   - Custom server

5. **Add Analytics**
   - Track user activity
   - Monitor server health
   - Analyze usage patterns

## 📞 Support

For issues or questions:
1. Check console for error messages
2. Review Firestore security rules
3. Verify Firebase configuration
4. Check Firebase Console for quota limits
5. Review React/JS documentation

## 🚀 You're All Set!

Your chat platform is ready to use. Start by creating a server, Adding channels, and inviting friends!

Happy chatting! 🎉
