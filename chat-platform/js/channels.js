/**
 * Channels Management Module
 * Handles channel creation and management
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
    getCurrentUserUID,
    logAuditAction
} from './firebase.js';

/**
 * Create a new channel
 */
export async function createChannel(serverId, name, description = '', type = 'text') {
    const userId = getCurrentUserUID();
    if (!userId) return;
    
    try {
        const newChannel = {
            serverId,
            name,
            description,
            type,
            createdAt: new Date(),
            createdBy: userId
        };
        
        const docRef = await addDoc(collection(db, 'channels'), newChannel);
        console.log('Channel created:', docRef.id);
        
        return docRef.id;
        
    } catch (error) {
        console.error('Error creating channel:', error);
        alert('Failed to create channel');
    }
}

/**
 * Delete a channel
 */
export async function deleteChannel(channelId) {
    if (!confirm('Are you sure you want to delete this channel?')) return;
    
    try {
        await deleteDoc(doc(db, 'channels', channelId));
        
        const userId = getCurrentUserUID();
        await logAuditAction('channel_deleted', userId, 'channel', channelId, {
            timestamp: new Date()
        });
        
        console.log('Channel deleted');
        
    } catch (error) {
        console.error('Error deleting channel:', error);
        alert('Failed to delete channel');
    }
}

/**
 * Update channel
 */
export async function updateChannel(channelId, updates) {
    try {
        await updateDoc(doc(db, 'channels', channelId), updates);
        console.log('Channel updated');
    } catch (error) {
        console.error('Error updating channel:', error);
        alert('Failed to update channel');
    }
}

/**
 * Get all channels for a server
 */
export async function getServerChannels(serverId) {
    try {
        const q = query(
            collection(db, 'channels'),
            where('serverId', '==', serverId)
        );
        
        const querySnapshot = await getDocs(q);
        const channels = [];
        
        querySnapshot.forEach((doc) => {
            channels.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return channels;
        
    } catch (error) {
        console.error('Error getting channels:', error);
        return [];
    }
}

console.log('Channels module loaded');
