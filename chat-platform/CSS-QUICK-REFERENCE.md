# 🎨 CSS Class Quick Reference

## Professional Features CSS Classes

### Status Indicators
```css
.status-badge         /* Base status badge */
.status-badge.online  /* Green - Online */
.status-badge.idle    /* Orange - Idle */
.status-badge.dnd     /* Red - Do Not Disturb */
.status-badge.offline /* Gray - Offline */
```

### Badges & Indicators
```css
.badge-premium        /* Gold premium badge */
.role-badge           /* Role indicator */
.role-badge.admin     /* Admin role */
.role-badge.moderator /* Moderator role */
.role-badge.member    /* Member role */
```

### User Profiles
```css
.user-profile-card    /* Full profile card */
.user-avatar-large    /* Large avatar image */
.member-item          /* Member list item */
.member-avatar        /* Member avatar */
.member-name          /* Member name */
.member-status        /* Member status info */
```

### Buttons
```css
.btn-rich             /* Base enhanced button */
.btn-rich.primary     /* Blue primary button */
.btn-rich.secondary   /* Gray secondary button */
.btn-rich.danger      /* Red danger button */
.btn-rich.success     /* Green success button */
```

### Forms & Input
```css
.input-enhanced       /* Enhanced input field */
.toggle-switch        /* On/off toggle */
.toggle-switch.active /* Toggle enabled */
.settings-section     /* Settings group */
.settings-item        /* Individual setting */
.settings-label       /* Setting label */
.settings-value       /* Setting value */
```

### Cards & Containers
```css
.card                 /* Basic card */
.card-header          /* Card header */
.card-body            /* Card content */
.card-footer          /* Card footer */
.interactive          /* Interactive hover effect */
```

### Notifications & Feedback
```css
.notification         /* Base notification */
.notification.success /* Green success */
.notification.error   /* Red error */
.notification.warning /* Orange warning */
.notification.info    /* Blue info */
.loading-skeleton     /* Animated loader */
```

### Advanced Features
```css
.context-menu         /* Right-click menu */
.dropdown-menu        /* Dropdown selector */
.dropdown-item        /* Dropdown option */
.activity-feed        /* Activity timeline */
.activity-item        /* Activity entry */
.star-rating          /* Star rating display */
.star-rating .star    /* Individual star */
.status-message       /* User bio/status */
.tooltip              /* Hover tooltip */
.border-animated      /* Gradient border animation */
.pulse                /* Pulsing animation */
```

---

## Usage Examples

### Example 1: Member List Item
```html
<div class="member-item interactive">
    <div class="member-avatar">JD</div>
    <div class="member-info">
        <div class="member-name">John Developer</div>
        <div class="member-status">
            <span class="status-badge online">Online</span>
            <span class="role-badge admin">Admin</span>
        </div>
    </div>
</div>
```

### Example 2: User Profile Card
```html
<div class="user-profile-card">
    <div class="user-avatar-large">JD</div>
    <div class="member-name">John Developer</div>
    <div class="member-status">
        <span class="status-badge online">Online</span>
        <span class="badge-premium">Premium</span>
    </div>
    <div class="status-message">@johndeveloper • EST</div>
</div>
```

### Example 3: Settings Section
```html
<div class="settings-section">
    <div class="settings-item">
        <div class="settings-label">
            <span>Dark Mode</span>
            <span>Enable dark theme</span>
        </div>
        <div class="toggle-switch active"></div>
    </div>
</div>
```

### Example 4: Enhanced Buttons
```html
<!-- Primary Button -->
<button class="btn-rich primary">
    <i class="fas fa-plus"></i> Create
</button>

<!-- Danger Button -->
<button class="btn-rich danger">
    <i class="fas fa-trash"></i> Delete
</button>

<!-- Success Button -->
<button class="btn-rich success">
    <i class="fas fa-check"></i> Confirm
</button>
```

### Example 5: Notification
```html
<div class="notification success">
    <i class="fas fa-check-circle"></i>
    <span>Message sent successfully!</span>
</div>

<div class="notification error">
    <i class="fas fa-exclamation-circle"></i>
    <span>Something went wrong</span>
</div>
```

### Example 6: Card with Content
```html
<div class="card">
    <div class="card-header">Settings</div>
    <div class="card-body">
        <!-- Content here -->
    </div>
    <div class="card-footer">
        <button class="btn-rich primary">Save</button>
    </div>
</div>
```

### Example 7: Activity Feed
```html
<div class="activity-feed">
    <div class="activity-item">
        <strong>John</strong> joined the channel
    </div>
    <div class="activity-item">
        <strong>Sarah</strong> sent a message
    </div>
</div>
```

### Example 8: Enhanced Input
```html
<input type="text" class="input-enhanced" placeholder="Search...">
```

---

## Combining Classes

### Complete Member Display
```html
<div class="user-profile-card">
    <div class="user-avatar-large">JD</div>
    <div class="member-name">John Developer</div>
    <div class="member-status">
        <span class="status-badge online">Online</span>
        <span class="role-badge admin">Admin</span>
        <span class="badge-premium">Premium</span>
    </div>
    <div class="status-message">Building amazing apps | 🚀</div>
    <div style="margin-top: 10px;">
        <button class="btn-rich primary"><i class="fas fa-message"></i></button>
        <button class="btn-rich secondary"><i class="fas fa-ellipsis"></i></button>
    </div>
</div>
```

### Settings Panel
```html
<div class="card">
    <div class="card-header">User Settings</div>
    <div class="card-body">
        <div class="settings-section">
            <div class="settings-item">
                <div class="settings-label">
                    <span>Notifications</span>
                    <span>Enable all notifications</span>
                </div>
                <div class="toggle-switch active"></div>
            </div>
            <div class="settings-item">
                <div class="settings-label">
                    <span>Dark Mode</span>
                    <span>Use dark theme</span>
                </div>
                <div class="toggle-switch"></div>
            </div>
        </div>
    </div>
</div>
```

---

## Animation Classes

### Included Animations
```css
slideIn              /* Message entrance animation */
pulse                /* Pulsing effect */
loadingAnimation     /* Loading skeleton animation */
borderAnimation      /* Animated border effect */
```

---

## Color & Theme System

### CSS Variables Available
```css
/* Primary Colors */
--primary-color       /* Theme main color */
--primary-dark        /* Darker variant */
--primary-light       /* Lighter variant */

/* Semantic Colors */
--success-color       /* Green for success */
--error-color         /* Red for errors */
--warning-color       /* Orange for warnings */
--info-color          /* Blue for info */

/* Grays */
--bg-dark             /* Dark background */
--bg-light            /* Light background */
--text-color          /* Main text */
--text-muted          /* Muted text */
```

### Built-in Color Variants
```css
/* Status Colors */
.online              /* Green (#31a24c) */
.idle                /* Orange (#f0b332) */
.dnd                 /* Red (#f04747) */
.offline             /* Gray (#72767d) */

/* Role Colors */
.admin               /* Purple/Blue */
.moderator           /* Light Blue */
.member              /* Gray */
```

---

## Responsive Design

All classes work across breakpoints:
- **Desktop**: 1920px+
- **Laptop**: 1200px+  
- **Tablet**: 768px+
- **Mobile**: 320px+

---

## Best Practices

1. **Combine Intelligently**
   - Use `.member-item.interactive` for clickable items
   - Stack status badges for multiple indicators
   - Nesting cards inside cards is supported

2. **Mobile First**
   - All components responsive by default
   - Test on mobile to verify layout

3. **Accessibility**
   - Use semantic HTML inside classes
   - Add ARIA labels where needed
   - Ensure color contrast meets standards

4. **Performance**
   - Classes use pure CSS (no JS required)
   - Animations use GPU acceleration
   - Minimal repaints and reflows

5. **Theming**
   - All colors adapt to current theme
   - No need to change CSS for different themes
   - Override with CSS variables if needed

---

## Common Patterns

### Pattern 1: Member List
```html
<div class="member-item interactive">
    <div class="member-avatar">Avatar Content</div>
    <div class="member-info">
        <div class="member-name">Name</div>
        <div class="member-status">
            <span class="status-badge online">Status</span>
            <span class="role-badge admin">Role</span>
        </div>
    </div>
</div>
```

### Pattern 2: User Card
```html
<div class="user-profile-card">
    <div class="user-avatar-large">Avatar</div>
    <div class="member-name">Name</div>
    <div class="status-message">Bio/Status</div>
    <button class="btn-rich primary">Action</button>
</div>
```

### Pattern 3: Settings Modal
```html
<div class="card">
    <div class="card-header">Settings</div>
    <div class="card-body">
        <div class="settings-section">
            <div class="settings-item">
                <div class="settings-label">Setting Name</div>
                <div class="toggle-switch"></div>
            </div>
        </div>
    </div>
</div>
```

### Pattern 4: Notification Toast
```html
<div class="notification success">
    <i class="fas fa-icon"></i>
    <span>Message text</span>
</div>
```

---

## Live Preview Classes

Just add these classes and they work instantly:
- ✅ `.btn-rich` - Instantly enhanced buttons
- ✅ `.status-badge` - Status indicators
- ✅ `.role-badge` - Role badges
- ✅ `.badge-premium` - Premium indicator
- ✅ `.input-enhanced` - Better inputs
- ✅ `.toggle-switch` - Toggle buttons
- ✅ `.card` - Professional cards
- ✅ `.notification` - Toast messages
- ✅ All animations - Smooth effects

---

## Customization

### Change Button Color
```css
.btn-rich.custom {
    background: #your-color;
    color: #text-color;
}
```

### Create New Status
```css
.status-badge.custom {
    background: #your-color;
    border-color: #your-color;
}
```

### Adjust Size
```css
.btn-rich.small {
    padding: 6px 12px;
    font-size: 12px;
}
```

---

## No Additional Dependencies

✅ Pure CSS (no Bootstrap needed)
✅ Uses FontAwesome icons (already included)
✅ No JavaScript required
✅ Works with all modern browsers
✅ Fully compatible with existing code

---

**Ready to use! Just add the classes to your HTML elements.** 🎨
