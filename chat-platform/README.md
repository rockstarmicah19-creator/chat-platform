# ChatHub - Discord & WhatsApp Style Chat Platform

A full-featured real-time chat application built with HTML, CSS, JavaScript, and Firebase. Features servers, channels, direct messages, and a complete admin dashboard.

## 📋 Project Structure

```
chat-platform/
├── index.html          # Login/Signup page
├── app.html            # Main chat application
├── admin.html          # Admin dashboard
├── css/
│   ├── style.css       # Main application styles
│   └── admin.css       # Admin dashboard styles
├── js/
│   ├── firebase.js     # Firebase configuration
│   ├── auth.js         # Authentication module
│   ├── servers.js      # Server management
│   ├── channels.js     # Channel management
│   ├── chat.js         # Messaging system
│   ├── notifications.js # Notifications module
│   ├── profile.js      # User profile management
│   ├── admin.js        # Admin panel functionality
│   └── moderation.js   # Content moderation
└── assets/             # Images and media files
```

## 🚀 Features

### User Features
- ✅ Authentication (Sign up, Login, Password reset)
- ✅ User profiles with avatar, bio, status
- ✅ Servers with channels (Discord style)
- ✅ Direct messages (WhatsApp style)
- ✅ Real-time messaging
- ✅ Message reactions and replies
- ✅ Message editing and deletion
- ✅ Typing indicators
- ✅ Online/Offline status
- ✅ Notifications system
- ✅ **12 Stunning Themes** 🎨
  - Discord, WhatsApp, Light
  - Rainbow Neon, Space Nebula, Fire
  - Dragon, AI, Discord Purple
  - Cyberpunk, Forest, Ocean

### Admin Features
- ✅ User management (View, ban, delete)
- ✅ Server management
- ✅ Channel management
- ✅ Reports system
- ✅ Moderation tools
  - Spam detection
  - Bad words filter
  - Link filtering
- ✅ Analytics dashboard
- ✅ Audit logs
- ✅ User warnings and mutes

## 🎨 Themes

ChatHub includes **12 awesome themes** to personalize your chat experience:

| Theme | Style | Best For |
|-------|-------|----------|
| 🔷 Discord | Professional | Default, productivity |
| 🟢 WhatsApp | Messaging-focused | Mobile feel |
| ☀️ Light | Bright & clean | Daytime use |
| 🌈 Rainbow Neon | Vibrant & energetic | Gaming, creative |
| 🌌 Space Nebula | Cosmic | Sci-fi fans |
| 🔥 Fire | Hot & intense | Gaming communities |
| 🐉 Dragon | Fantasy | Fantasy gaming |
| 🧠 AI | Tech & futuristic | Developers |
| 💜 Discord Purple | Modern & sleek | Creative pros |
| 💻 Cyberpunk | Fast & futuristic | Tech enthusiasts |
| 🌲 Forest | Natural & calming | Nature lovers |
| 🌊 Ocean | Peaceful | Relaxation |

**Switch themes:** Click the 🎨 palette icon in the chat header!

👉 **See [THEMES.md](THEMES.md) for detailed theme documentation**

## 🔧 Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable these services:
   - Authentication (Email/Password)
   - Firestore Database
   - Realtime Database (optional)
   - Storage

### 2. Get Firebase Credentials
1. In Firebase Console, go to Project Settings
2. Click "Add App" → Web
3. Copy the configuration

### 3. Update Firebase Config
Edit `js/firebase.js` and replace with your credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "YOUR_DATABASE_URL"
};
```

### 4. Setup Firestore Collections
Create these collections in Firestore:

```
users/
  - uid (document)
    - username
    - email
    - avatar
    - bio
    - status
    - role (user/admin)
    - createdAt
    - banned

servers/
  - serverId
    - name
    - description
    - ownerId
    - members []
    - channels []
    - createdAt

channels/
  - channelId
    - serverId
    - name
    - description
    - type (text/voice)
    - createdAt

messages/
  - messageId
    - channelId or dmId
    - userId
    - text
    - timestamp
    - reactions
    - edited

reports/
  - reportId
    - reporterId
    - targetType
    - targetId
    - reason
    - status
    - timestamp

dms/
  - dmId
    - members []
    - messages []
    - createdAt

auditLogs/
  - logId
    - action
    - adminId
    - targetType
    - targetId
    - timestamp

notifications/
  - notificationId
    - userId
    - type
    - title
    - message
    - read
    - timestamp
```

### 5. Set Security Rules
In Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth != null; // Others can view profiles
    }
    
    // Servers - readable by members
    match /servers/{serverId} {
      allow read: if request.auth.uid in resource.data.members;
      allow write: if request.auth.uid == resource.data.ownerId;
    }
    
    // Messages - readable by channel members
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.userId;
      allow delete: if request.auth.uid == resource.data.userId;
    }
    
    // Admin logs - admin only
    match /auditLogs/{logId} {
      allow read, write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 6. Create First Admin User
1. Sign up with email/password
2. In Firestore, manually update the user's `role` to `admin`

### 7. Serve Your App
Use a local server (like Live Server in VS Code):
```bash
python -m http.server 8000
```

Then visit: `http://localhost:8000`

## 📱 Pages

### index.html - Authentication
- Login form
- Signup form
- Password reset

### app.html - Main Chat
- Server list (left sidebar)
- Channel list (second sidebar)
- Messages area (center)
- Member list (right sidebar)

### admin.html - Admin Dashboard
- Dashboard with statistics
- User management
- Server management
- Reports
- Moderation tools
- Analytics
- Audit logs

## 🔐 Security Features
- Firebase authentication
- Role-based access control
- Content moderation
- Audit logging
- User banning system
- Message reporting

## 🎨 UI/UX
- Dark mode by default
- Responsive design
- Real-time updates
- Smooth animations
- Status indicators
- Typing indicators

## 📚 Database Schema

### Users Collection
```json
{
  "uid": "userId",
  "username": "john_doe",
  "email": "john@example.com",
  "avatar": "https://...",
  "bio": "Hello!",
  "status": "online",
  "role": "user",
  "createdAt": "timestamp",
  "lastSeen": "timestamp",
  "banned": false
}
```

### Servers Collection
```json
{
  "name": "Gaming Server",
  "description": "For gamers",
  "ownerId": "userId",
  "members": ["userId1", "userId2"],
  "channels": ["channelId1"],
  "createdAt": "timestamp"
}
```

### Messages Collection
```json
{
  "channelId": "channelId",
  "userId": "userId",
  "text": "Hello!",
  "timestamp": "timestamp",
  "reactions": { "👍": ["userId1", "userId2"] },
  "edited": false,
  "imageUrl": "https://..."
}
```

## 🚀 Deployment

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Deploy: `firebase deploy`

### Deploy to Vercel
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy

### Deploy to Netlify
1. Push to GitHub
2. Connect repository to Netlify
3. Deploy

## 💡 Future Enhancements
- Video/Voice calls with WebRTC
- Screen sharing
- File uploads to storage
- End-to-end encryption
- Message search
- Status stories (24-hour posts)
- User presence map
- Rich text editor
- Bot support
- Integration with third-party APIs

## ⚠️ Important Notes

1. **Firebase Configuration**: You must set up a Firebase project and configure credentials
2. **Security Rules**: Review and update security rules for production
3. **Admin User**: Create at least one admin user in Firestore
4. **CORS**: Configure CORS if deploying on different domain
5. **Environment Variables**: Don't commit Firebase credentials to version control

## 🔗 Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth](https://firebase.google.com/docs/auth)

## 📝 License
This project is open source and available for educational purposes.

## 🤝 Contributing
Feel free to submit issues and enhancement requests!

---

**Built with ❤️ using Firebase and Vanilla JavaScript**
