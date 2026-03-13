# 🛠️ Admin Pages Developer Reference

## Quick File Reference

| Page | File Path | Purpose |
|------|-----------|---------|
| **Dashboard** | `admin-dashboard.html` | Platform overview & statistics |
| **Users** | `admin-users.html` | User management & moderation |
| **Servers** | `admin-servers.html` | Server monitoring & control |
| **Channels** | `admin-channels.html` | Channel management |
| **Reports** | `admin-reports.html` | Report handling workflow |
| **Moderation** | `admin-moderation.html` | Moderation actions |
| **Analytics** | `admin-analytics.html` | Platform analytics & metrics |
| **Storage** | `admin-storage.html` | Storage usage tracking |
| **Audit Logs** | `admin-audit-logs.html` | System action logging |
| **Settings** | `admin-settings.html` | Platform configuration |

---

## CSS Files
- **`css/style.css`** - Main styles + 12 themes (1900+ lines)
- **`css/admin.css`** - Admin-specific styling (250+ lines)

---

## JavaScript Files Used
- **`js/theme.js`** - Theme system management
- **`js/firebase.js`** - Database connections
- **`js/auth.js`** - Authentication & authorization

---

## Page Structure

Each admin page includes:

```html
<!-- Navigation Sidebar -->
<nav id="sidebar">
  <!-- Links to all 10 admin pages -->
</nav>

<!-- Header -->
<div class="admin-header">
  <!-- Theme selector & logout -->
</div>

<!-- Main Content -->
<main class="admin-main">
  <!-- Stats grid, tables, charts -->
</main>

<!-- Theme Modal -->
<div id="themeModal" class="modal">
  <!-- Theme selector -->
</div>
```

---

## Common CSS Classes

### Layout
- `.admin-container` - Page wrapper
- `.admin-header` - Header bar
- `.admin-main` - Main content area
- `.admin-sidebar` - Navigation sidebar

### Components
- `.stat-card` - Statistics cards
- `.data-table` - Data tables
- `.action-button` - Action buttons
- `.badge` - Status badges
- `.modal` - Modal dialogs
- `.chart` - Chart components

### Utilities
- `.active` - Active state
- `.warning` - Warning color
- `.success` - Success color
- `.error` - Error color

---

## Data Structures

### User Object
```javascript
{
  id: "user123",
  username: "john_doe",
  email: "john@example.com",
  role: "user", // "admin", "moderator", "user"
  status: "online", // "online", "offline", "idle"
  joinDate: "2024-01-15",
  messageCount: 1234,
  handle: "@johndoe"
}
```

### Server Object
```javascript
{
  id: "server123",
  name: "Gaming Hub",
  owner: "john_doe",
  members: 245,
  channels: 12,
  createdDate: "2024-01-01",
  status: "active", // "active", "inactive"
  icon: "server-icon-url"
}
```

### Channel Object
```javascript
{
  id: "channel123",
  name: "general",
  type: "public", // "public", "private"
  server: "server123",
  members: 245,
  messages: 5678,
  createdDate: "2024-01-01"
}
```

### Moderation Object
```javascript
{
  id: "mod123",
  user: "user123",
  action: "ban", // "ban", "mute", "warning"
  reason: "Spam",
  duration: "permanent", // "1h", "1d", "7d", "permanent"
  moderator: "admin_user",
  date: "2024-01-20",
  timestamp: 1705700400
}
```

---

## API Integration Points

### Dashboard
- `GET /api/stats/users` - Total users
- `GET /api/stats/servers` - Total servers
- `GET /api/stats/messages` - Daily messages
- `GET /api/stats/reports` - Open reports
- `GET /api/analytics/growth` - User activity chart

### Users
- `GET /api/users` - List all users
- `GET /api/users?role=admin` - Filter by role
- `GET /api/users?status=active` - Filter by status
- `POST /api/users/{id}/ban` - Ban user
- `POST /api/users/{id}/unban` - Unban user
- `PUT /api/users/{id}` - Edit user

### Servers
- `GET /api/servers` - List all servers
- `GET /api/servers/{id}` - Server details
- `DELETE /api/servers/{id}` - Delete server
- `POST /api/servers` - Create server

### Channels
- `GET /api/channels` - List all channels
- `GET /api/channels?type=public` - Filter by type
- `POST /api/channels` - Create channel
- `DELETE /api/channels/{id}` - Delete channel

### Reports
- `GET /api/reports` - List reports
- `GET /api/reports?status=open` - Filter by status
- `PUT /api/reports/{id}` - Update report status
- `DELETE /api/reports/{id}` - Close report

### Moderation
- `GET /api/moderation` - List moderation actions
- `POST /api/moderation/ban` - Ban user
- `POST /api/moderation/mute` - Mute user
- `POST /api/moderation/warn` - Warn user

### Analytics
- `GET /api/analytics/growth` - User growth
- `GET /api/analytics/servers` - Top servers
- `GET /api/analytics/distribution` - User distribution

### Storage
- `GET /api/storage/usage` - Storage stats
- `GET /api/storage/breakdown` - Storage by category
- `POST /api/storage/cleanup` - Start cleanup

### Audit Logs
- `GET /api/logs` - Get audit logs
- `GET /api/logs?action=ban` - Filter by action
- `POST /api/logs/export` - Export logs

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings
- `POST /api/settings/reset` - Reset to defaults

---

## Theme Variables

All pages use these CSS variables:

```css
/* Primary Colors */
--primary-color: #7289da;
--secondary-color: #40444b;
--accent-color: #00f0ff;

/* Background Colors */
--bg-primary: #36393f;
--bg-secondary: #2f3136;
--bg-tertiary: #202225;

/* Text Colors */
--text-primary: #dcddde;
--text-secondary: #72767d;
--text-muted: #72767d;

/* Other Colors */
--success-color: #43b581;
--warning-color: #faa61a;
--error-color: #f04747;
```

---

## Navigation Between Pages

### Static Links
```html
<a href="admin-dashboard.html">Dashboard</a>
<a href="admin-users.html">Users</a>
<a href="admin-servers.html">Servers</a>
```

### JavaScript Navigation
```javascript
window.location.href = 'admin-dashboard.html';
// or
window.location.replace('admin-users.html');
```

### Sidebar Menu
- Click sidebar items to navigate
- Current page is highlighted
- Active indicator shows current section

---

## Common Functions

### Apply Theme
```javascript
document.documentElement.style.setProperty('--primary-color', '#7289da');
```

### Show Modal
```javascript
document.getElementById('themeModal').style.display = 'flex';
```

### Close Modal
```javascript
document.getElementById('themeModal').style.display = 'none';
```

### Format Date
```javascript
const date = new Date(timestamp);
const formatted = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});
```

### Format Numbers
```javascript
const formatted = number.toLocaleString('en-US');
```

---

## Responsive Breakpoints

All admin pages are responsive:

```css
/* Desktop: 1200px+ */
@media (max-width: 1200px) {
  /* Desktop adjustments */
}

/* Tablet: 768px - 1024px */
@media (max-width: 1024px) {
  /* Tablet layout */
}

/* Mobile: < 768px */
@media (max-width: 768px) {
  /* Mobile layout */
}
```

---

## Browser Dev Tools Tips

### Check Theme
```javascript
// In console
getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
```

### Get All Settings
```javascript
// In console
JSON.parse(localStorage.getItem('adminSettings'));
```

### Force Theme
```javascript
// In console
document.documentElement.setAttribute('data-theme', 'discord');
```

### Check Permissions
```javascript
// In console
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log(user.role); // Should be 'admin'
```

---

## Testing Checklist

Before deploying admin pages:

- [ ] All 10 pages load without errors
- [ ] Sidebar navigation works on all pages
- [ ] Theme changes apply instantly
- [ ] Theme persists on page reload
- [ ] Theme works on all 10 pages
- [ ] All stat cards display correctly
- [ ] All buttons are clickable
- [ ] Modals open and close properly
- [ ] Search/filter functionality works
- [ ] Tables display data correctly
- [ ] Responsive design works on mobile
- [ ] Responsive design works on tablet
- [ ] Logout button works on all pages
- [ ] No console errors on any page

---

## Performance Optimization

For large datasets:

```javascript
// Use pagination
const pageSize = 50;
const currentPage = 1;
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const pageData = allData.slice(startIndex, endIndex);

// Implement virtual scrolling for large tables
// Cache filtered results
// Load data on demand
// Use web workers for heavy processing
```

---

## Security Best Practices

- ✅ Verify user is admin before displaying
- ✅ Validate all inputs
- ✅ Escape HTML output
- ✅ Use HTTPS for all connections
- ✅ Implement CSRF tokens
- ✅ Log all admin actions
- ✅ Rate limit API calls
- ✅ Sanitize search inputs
- ✅ Confirm destructive actions
- ✅ Mask sensitive data

---

## Database Schema (Firebase)

### Collections
- `users` - User accounts
- `servers` - Server configurations
- `channels` - Channel data
- `messages` - Chat messages
- `reports` - User reports
- `moderation` - Moderation actions
- `settings` - Platform settings
- `logs` - Audit logs

---

## Quick Start for Development

1. **Setup Firebase**
   ```javascript
   import { db } from './js/firebase.js';
   ```

2. **Load User Data**
   ```javascript
   const user = JSON.parse(localStorage.getItem('currentUser'));
   ```

3. **Check Admin Status**
   ```javascript
   if (user.role !== 'admin') {
     window.location.href = 'index.html';
   }
   ```

4. **Fetch Data**
   ```javascript
   const data = await db.collection('users').get();
   ```

5. **Update UI**
   ```javascript
   document.getElementById('userCount').textContent = data.docs.length;
   ```

---

## Common Issues & Solutions

### Issue: Pages not loading
- **Solution:** Check file paths, verify theme.js is loaded

### Issue: Sidebar not showing
- **Solution:** Check admin.css is linked, verify display property

### Issue: Theme not changing
- **Solution:** Check localStorage, verify CSS variables, check theme.js

### Issue: Data not displaying
- **Solution:** Check API calls, verify data format, check console errors

### Issue: Mobile layout broken
- **Solution:** Check responsive CSS, test viewport settings, verify media queries

---

## Useful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [ES6 JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)

---

**All admin pages are production-ready and waiting for Firebase integration!** 🚀
