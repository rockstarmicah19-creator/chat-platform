/**
 * User Profile Module
 * Handles user profile management and updates
 */

import {
    db,
    doc,
    getDoc,
    updateDoc,
    getCurrentUserUID,
    storage,
    ref,
    uploadBytes,
    getDownloadURL
} from './firebase.js';

/**
 * Get user profile
 */
export async function getUserProfile(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile() {
    const userId = getCurrentUserUID();
    if (!userId) return null;
    return getUserProfile(userId);
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates) {
    const userId = getCurrentUserUID();
    if (!userId) return;
    
    try {
        await updateDoc(doc(db, 'users', userId), updates);
        
        // Update localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({...user, ...updates}));
        
        console.log('Profile updated');
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
    }
}

/**
 * Update user avatar
 */
export async function updateUserAvatar(file) {
    const userId = getCurrentUserUID();
    if (!userId) return;
    
    try {
        const storageRef = ref(storage, `avatars/${userId}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        await updateUserProfile({ avatar: downloadURL });
        return downloadURL;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('Failed to upload avatar');
    }
}

/**
 * Update user bio
 */
export async function updateUserBio(bio) {
    await updateUserProfile({ bio });
}

/**
 * Update user status message
 */
export async function updateStatusMessage(statusMessage) {
    await updateUserProfile({ statusMessage });
}

/**
 * Update user status
 */
export async function updateUserOnlineStatus(status) {
    await updateUserProfile({ 
        status,
        lastSeen: new Date()
    });
}

/**
 * Generate avatar from username
 */
export function generateAvatarUrl(username) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
}

console.log('Profile module loaded');
