/**
 * ChatHub - Configuration & Setup Guide
 * 
 * This file documents the complete project structure and how to integrate all modules
 */

// ============================================================================
// 1. FIREBASE SETUP
// ============================================================================

/*
Firebase is the backbone of this application. It provides:
- Authentication (user accounts)
- Firestore (real-time database)
- Storage (file uploads)
- Realtime Database (optional)

To set up:
1. Create project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password)
3. Create Firestore Database (test mode for development)
4. Create Storage bucket
5. Copy config to js/firebase.js
*/

// ============================================================================
// 2. DATABASE STRUCTURE
// ============================================================================

/*
COLLECTIONS TO CREATE IN FIRESTORE:

1. users/
   Document ID: Firebase UID
   Fields:
   - username: string
   - email: string
   - avatar: string (URL)
   - bio: string
   - status: "online" | "offline" | "idle" | "dnd"
   - role: "user" | "admin" | "moderator"
   - createdAt: timestamp
   - lastSeen: timestamp
   - banned: boolean
   - banReason: string (optional)

2. servers/
   Document ID: auto-generated
   Fields:
   - name: string
   - description: string
   - ownerId: string (user UID)
   - members: array (user UIDs)
   - channels: array (channel IDs)
   - icon: string (URL)
   - createdAt: timestamp
   - rules: array (server rules)

3. channels/
   Document ID: auto-generated
   Fields:
   - serverId: string
   - name: string
   - description: string
   - type: "text" | "voice"
   - createdAt: timestamp
   - createdBy: string (user UID)

4. messages/
   Document ID: auto-generated
   Fields:
   - channelId: string (for channels)
   - dmId: string (for DMs)
   - userId: string (sender UID)
   - authorName: string
   - text: string
   - timestamp: timestamp
   - reactions: object {emoji: [userIds]}
   - imageUrl: string (optional)
   - edited: boolean
   - editedAt: timestamp (optional)
   - pinned: boolean (optional)
   - pinnedBy: string (optional)

5. dms/
   Document ID: auto-generated
   Fields:
   - members: array (2 user UIDs)
   - lastMessage: string
   - lastMessageTime: timestamp
   - createdAt: timestamp

6. reports/
   Document ID: auto-generated
   Fields:
   - reporterId: string
   - reporterName: string
   - targetType: "user" | "message" | "server"
   - targetId: string
   - reason: string
   - details: string
   - status: "pending" | "reviewed" | "resolved"
   - createdAt: timestamp
   - reviewedBy: string (optional)
   - reviewedAt: timestamp (optional)

7. auditLogs/
   Document ID: auto-generated
   Fields:
   - action: string (e.g., "user_banned", "message_deleted")
   - adminId: string (admin UID)
   - adminName: string
   - targetType: string
   - targetId: string
   - details: object
   - timestamp: timestamp

8. notifications/
   Document ID: auto-generated
   Fields:
   - userId: string (recipient)
   - type: "mention" | "message" | "report" | "warning"
   - title: string
   - message: string
   - read: boolean
   - data: object
   - timestamp: timestamp

9. violations/
   Document ID: auto-generated
   Fields:
   - userId: string
   - messageContent: string (first 200 chars)
   - violations: array
   - timestamp: timestamp
   - reviewed: boolean
   - action: string (optional)

10. mutes/
   Document ID: auto-generated
   Fields:
   - userId: string
   - mutedAt: timestamp
   - duration: number (milliseconds)
   - expiresAt: timestamp
   - active: boolean

11. warnings/
   Document ID: auto-generated
   Fields:
   - userId: string
   - reason: string
   - timestamp: timestamp
   - acknowledged: boolean
*/

// ============================================================================
// 3. FIRESTORE SECURITY RULES
// ============================================================================

/*
Apply these rules in Firestore Console:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read and write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Servers - readable by members
    match /servers/{serverId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.ownerId;
    }
    
    // Channels - readable by server members
    match /channels/{channelId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.createdBy;
    }
    
    // Messages - readable by authenticated users
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow write: if request.auth.uid == resource.data.userId;
      allow delete: if request.auth.uid == resource.data.userId;
    }
    
    // Admin collections - admin only
    match /auditLogs/{logId} {
      allow read, write: if isAdmin();
    }
    
    match /violations/{violationId} {
      allow read, write: if isAdmin();
    }
    
    // Helper function
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
*/

// ============================================================================
// 4. MODULE INTEGRATION
// ============================================================================

/*
Each module handles a specific aspect:

firebase.js
- Initializes Firebase SDK
- Exports database references
- Provides helper functions
- Handle authentication state

auth.js
- Imports: firebase.js
- Handles: Sign up, login, password reset
- Protects: Pages, checks admin access
- Exports: handleLogout, updateUserStatus

servers.js
- Imports: firebase.js
- Handles: Server creation, selection, joining
- Exports: createServer, selectServer, leaveServer

channels.js
- Imports: firebase.js
- Handles: Channel creation and deletion
- Exports: createChannel, deleteChannel, getServerChannels

chat.js
- Imports: firebase.js
- Handles: Real-time messaging, reactions, editing
- Exports: loadMessages, sendMessage, deleteMessage

notifications.js
- Imports: firebase.js
- Handles: Notifications and mentions
- Exports: loadNotifications, sendNotification

profile.js
- Imports: firebase.js
- Handles: User profile management
- Exports: getUserProfile, updateUserProfile

admin.js
- Imports: firebase.js, auth.js
- Handles: Admin dashboard functionality
- Exports: initAdmin, various admin functions

moderation.js
- Imports: firebase.js
- Handles: Content moderation, spam detection
- Exports: checkMessageContent, muteUser, warnUser
*/

// ============================================================================
// 5. USAGE EXAMPLES
// ============================================================================

/*
// Initialize on page load:
import { initServers } from './servers.js';
import { initChat } from './chat.js';
import { initModeration } from './moderation.js';

// Authentication
import { handleLogout } from './auth.js';
document.getElementById('logoutBtn').onclick = handleLogout;

// Create a server
import { createServer } from './servers.js';
// Called from form submission in HTML

// Send message
import { sendMessage } from './chat.js';
sendMessage("Hello, world!");

// Check moderation
import { checkMessageContent } from './moderation.js';
const violations = await checkMessageContent("message text", userId);
if (violations.length > 0) {
  console.log('Violations found:', violations);
}

// Admin functions
import { adminBanUser, adminDeleteServer } from './admin.js';
await adminBanUser(userId);
await adminDeleteServer(serverId);

// Get user profile
import { getUserProfile } from './profile.js';
const userProfile = await getUserProfile(userId);
console.log(userProfile.username);
*/

// ============================================================================
// 6. COMMON TASKS
// ============================================================================

/*
Create a Server:
- User clicks "+" button
- handleCreateServer() triggered
- Creates document in "servers" collection
- Creates default "general" channel
- Updates user's server list

Send a Message:
- User types and presses Enter
- sendMessage() called
- createNotification() for mentions
- checkMessageContent() for moderation
- Adds to messages collection
- Updates UI in real-time via onSnapshot

Ban a User:
- Admin clicks Ban button
- adminBanUser() called
- Updates users/{userId} with banned: true
- logAuditAction() records action
- User automatically redirected on next login

Report a Message:
- User clicks Report button
- addDoc to reports collection
- Triggers notification to admins
- Admin reviewed in admin panel

Moderate Content:
- Message sent to Firestore
- autoModerateMessage() checks content
- Violation detected triggers warning/mute
- Admin review in violations section
*/

// ============================================================================
// 7. DEPLOYMENT CHECKLIST
// ============================================================================

/*
Before deploying to production:

□ Update Firebase Config (js/firebase.js)
□ Set strict Firestore security rules
□ Enable production authentication
□ Set up Storage security rules
□ Create at least one admin user
□ Test all authentication flows
□ Test server/channel creation
□ Test messaging
□ Test admin functions
□ Test moderation
□ Set up error logging
□ Test on multiple browsers
□ Test on mobile devices
□ Set up email notifications
□ Enable CORS if needed
□ Configure domain settings
□ Set up SSL/HTTPS
□ Test rate limiting
□ Document admin procedures
□ Set up backup strategy
□ Create user documentation
*/

// ============================================================================
// 8. PERFORMANCE TIPS
// ============================================================================

/*
Optimization strategies:

1. Lazy Load Images
   - Load channel icons only when visible
   - Use thumbnail versions for avatars

2. Pagination
   - Load messages in batches of 50
   - Load users in pages

3. Caching
   - Store user data in localStorage
   - Cache server listings

4. Compression
   - Use gzip compression
   - Minimize CSS/JS files

5. CDN
   - Serve static files from CDN
   - Cache assets with long expiry

6. Database Indexing
   - Create composite indexes for queries
   - Monitor query performance

7. Query Optimization
   - Use specific fields in queries
   - Avoid N+1 queries

8. Rate Limiting
   - Limit message sends per user
   - Throttle API calls
*/

// ============================================================================
// 9. SECURITY CONSIDERATIONS
// ============================================================================

/*
Security best practices:

1. Authentication
   - Enforce strong passwords
   - Implement rate limiting on login
   - Add 2FA for admin accounts

2. Authorization
   - Always verify user role before admin actions
   - Check permissions server-side
   - Never trust client-side role claims

3. Data Protection
   - Validate all input
   - Sanitize user-generated content
   - Use parameterized queries

4. API Security
   - Use HTTPS only
   - Implement CORS properly
   - Validate API requests
   - Implement rate limiting

5. Admin Security
   - Log all admin actions
   - Require strong passwords for admins
   - Implement audit trails
   - Regular security audits

6. Content Security
   - Implement content moderation
   - Filter XSS attacks
   - Validate file uploads
   - Scan for malware

7. Privacy
   - Implement data retention policies
   - Allow users to delete accounts
   - Implement GDPR compliance
   - Privacy policy and ToS
*/

// ============================================================================
// 10. TROUBLESHOOTING
// ============================================================================

/*
Common issues and solutions:

Issue: "Not authenticated"
Solution: Check if user is logged in, verify Firebase config

Issue: "Messages not loading"
Solution: Check Firestore rules, verify channel ID, check console

Issue: "Admin panel blocked"
Solution: Verify user role is "admin" in Firestore

Issue: "Real-time updates not working"
Solution: Check Firestore listener subscription, verify data structure

Issue: "File upload failing"
Solution: Check Storage bucket exists, verify permissions

Issue: "CORS errors"
Solution: Configure CORS in Firebase, update security rules

Issue: "High latency"
Solution: Optimize queries, add indexes, use caching

Issue: "Users can't find each other"
Solution: Check server membership, verify channel access

Issue: "Notifications not appearing"
Solution: Check notifications collection, verify user ID, check rules
*/

console.log('Configuration guide loaded - Do not add to HTML');
