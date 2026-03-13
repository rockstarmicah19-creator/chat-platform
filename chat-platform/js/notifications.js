/**
 * Notifications Module
 * Handles notifications and mentioning users
 */

import {
    db,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    getCurrentUserUID,
    createNotification
} from './firebase.js';

let notificationsUnsubscribe = null;

/**
 * Load notifications for current user
 */
export function loadNotifications() {
    const userId = getCurrentUserUID();
    if (!userId) return;
    
    try {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId)
        );
        
        notificationsUnsubscribe = onSnapshot(q, (querySnapshot) => {
            const unreadCount = querySnapshot.docs.filter(d => !d.data().read).length;
            updateNotificationBadge(unreadCount);
        });
        
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId) {
    try {
        await updateDoc(doc(db, 'notifications', notificationId), {
            read: true
        });
    } catch (error) {
        console.error('Error marking notification read:', error);
    }
}

/**
 * Send notification to user
 */
export async function sendNotification(userId, type, title, message, data = {}) {
    try {
        await createNotification(userId, type, title, message, data);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

/**
 * Update notification badge
 */
function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

/**
 * Mention user in message
 */
export async function mentionUser(userId, message) {
    try {
        await createNotification(
            userId,
            'mention',
            'You were mentioned',
            message,
            { messageId: 'messageId' }
        );
    } catch (error) {
        console.error('Error mentioning user:', error);
    }
}

/**
 * Clean up listeners
 */
export function cleanupNotifications() {
    if (notificationsUnsubscribe) {
        notificationsUnsubscribe();
    }
}

console.log('Notifications module loaded');
