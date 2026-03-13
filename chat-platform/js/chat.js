/**
 * Chat Messaging Module
 * Handles real-time messaging, reactions, and message actions
 */

import {
    db,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    deleteDoc,
    doc,
    updateDoc,
    onSnapshot,
    getCurrentUserUID,
    createNotification
} from './firebase.js';

let currentChatId = null;
let currentChatType = null;
let messagesUnsubscribe = null;

/**
 * Load messages for a channel or DM
 */
export function loadMessages(chatId, type) {
    currentChatId = chatId;
    currentChatType = type;
    
    // Unsubscribe from previous listener
    if (messagesUnsubscribe) {
        messagesUnsubscribe();
    }
    
    const collectionName = type === 'channel' ? 'channels' : 'dms';
    
    try {
        const q = query(
            collection(db, 'messages'),
            where(type === 'channel' ? 'channelId' : 'dmId', '==', chatId),
            orderBy('timestamp', 'asc'),
            limit(50)
        );
        
        messagesUnsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesContainer = document.getElementById('messagesContainer');
            if (!messagesContainer) return;
            
            messagesContainer.innerHTML = '';
            
            querySnapshot.forEach((messageDoc) => {
                const message = messageDoc.data();
                displayMessage(messageDoc.id, message);
            });
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
        
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

/**
 * Display a single message
 */
function displayMessage(messageId, message) {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    messageEl.dataset.messageId = messageId;
    
    const currentUserId = getCurrentUserUID();
    const isOwnMessage = message.userId === currentUserId;
    
    messageEl.innerHTML = `
        <div class="message-avatar">${message.authorName?.charAt(0) || 'U'}</div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-author">${message.authorName || 'Unknown'}</span>
                <span class="message-timestamp">${formatTime(message.timestamp)}</span>
            </div>
            <div class="message-text">${escapeHtml(message.text)}</div>
            ${message.imageUrl ? `<img src="${message.imageUrl}" class="message-image" alt="Shared image">` : ''}
            <div class="message-actions">
                <button class="message-action-btn" onclick="reactToMessage('${messageId}', '👍')">
                    <i class="fas fa-thumbs-up"></i>
                </button>
                ${isOwnMessage ? `
                    <button class="message-action-btn" onclick="editMessage('${messageId}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="message-action-btn" onclick="deleteMessage('${messageId}')">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
                <button class="message-action-btn" onclick="replyToMessage('${messageId}')">
                    <i class="fas fa-reply"></i>
                </button>
                <button class="message-action-btn" onclick="pinMessage('${messageId}')">
                    <i class="fas fa-thumbtack"></i>
                </button>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageEl);
}

/**
 * Send a message
 */
export async function sendMessage(text) {
    if (!text.trim() || !currentChatId) return;
    
    const userId = getCurrentUserUID();
    if (!userId) return;
    
    try {
        // Get user data
        const userDoc = await import('./firebase.js').then(m => m.getDoc(
            import('./firebase.js').then(m => m.doc(m.db, 'users', userId))
        ));
        
        const message = {
            [currentChatType === 'channel' ? 'channelId' : 'dmId']: currentChatId,
            text,
            userId,
            authorName: 'User',
            timestamp: new Date(),
            reactions: {},
            replies: [],
            edited: false,
            imageUrl: null
        };
        
        await addDoc(collection(db, 'messages'), message);
        
        // Clear input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = '';
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

/**
 * Delete a message
 */
export async function deleteMessage(messageId) {
    if (!confirm('Delete this message?')) return;
    
    try {
        await deleteDoc(doc(db, 'messages', messageId));
    } catch (error) {
        console.error('Error deleting message:', error);
    }
}

/**
 * Edit a message
 */
export async function editMessage(messageId) {
    const messageEl = document.querySelector(`[data-messageId="${messageId}"]`);
    if (!messageEl) return;
    
    const newText = prompt('Edit message:');
    if (!newText) return;
    
    try {
        await updateDoc(doc(db, 'messages', messageId), {
            text: newText,
            edited: true,
            editedAt: new Date()
        });
    } catch (error) {
        console.error('Error editing message:', error);
    }
}

/**
 * React to a message
 */
export async function reactToMessage(messageId, emoji) {
    const userId = getCurrentUserUID();
    if (!userId) return;
    
    try {
        const messageRef = doc(db, 'messages', messageId);
        const messageDoc = await import('./firebase.js').then(m => 
            m.getDoc(messageRef)
        );
        
        if (!messageDoc.exists()) return;
        
        const reactions = messageDoc.data().reactions || {};
        if (!reactions[emoji]) {
            reactions[emoji] = [];
        }
        
        if (!reactions[emoji].includes(userId)) {
            reactions[emoji].push(userId);
        }
        
        await updateDoc(messageRef, { reactions });
        
    } catch (error) {
        console.error('Error reacting to message:', error);
    }
}

/**
 * Reply to a message
 */
export function replyToMessage(messageId) {
    const messageEl = document.querySelector(`[data-messageId="${messageId}"]`);
    if (!messageEl) return;
    
    const messageText = messageEl.querySelector('.message-text')?.textContent || '';
    const messageInput = document.getElementById('messageInput');
    
    if (messageInput) {
        messageInput.value = `@reply ${messageId}: `;
        messageInput.focus();
    }
}

/**
 * Pin a message
 */
export async function pinMessage(messageId) {
    const userId = getCurrentUserUID();
    if (!userId) return;
    
    try {
        await updateDoc(doc(db, 'messages', messageId), {
            pinned: true,
            pinnedBy: userId,
            pinnedAt: new Date()
        });
    } catch (error) {
        console.error('Error pinning message:', error);
    }
}

/**
 * Format timestamp
 */
function formatTime(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp.toDate ? timestamp.toDate() : timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h';
    
    return date.toLocaleDateString();
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize chat input
 */
export function initChat() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const text = messageInput.value;
            if (text) {
                sendMessage(text);
            }
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const text = messageInput.value;
                if (text) {
                    sendMessage(text);
                }
            }
        });
    }
}

// Make functions globally available
window.deleteMessage = deleteMessage;
window.editMessage = editMessage;
window.reactToMessage = reactToMessage;
window.replyToMessage = replyToMessage;
window.pinMessage = pinMessage;

console.log('Chat module loaded');
