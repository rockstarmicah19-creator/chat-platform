/**
 * Servers Management Module
 * Handles server creation, management, and member operations
 */

import {
    db,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    getCurrentUserUID,
    logAuditAction
} from './firebase.js';

let currentServer = null;
let currentServerData = null;

/**
 * Create a new server
 */
export async function createServer(event) {
    if (event) event.preventDefault();
    
    const name = document.getElementById('serverNameInput')?.value;
    const description = document.getElementById('serverDescInput')?.value || '';
    
    const userId = getCurrentUserUID();
    if (!userId) return;
    
    try {
        const newServer = {
            name,
            description,
            ownerId: userId,
            members: [userId],
            channels: [],
            icon: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
            createdAt: new Date(),
            rules: [],
            muted: false
        };
        
        const docRef = await addDoc(collection(db, 'servers'), newServer);
        
        // Create default channel
        await addDoc(collection(db, 'channels'), {
            serverId: docRef.id,
            name: 'general',
            description: 'General discussion',
            type: 'text',
            createdAt: new Date()
        });
        
        console.log('Server created:', docRef.id);
        
        // Close modal and refresh
        const modal = document.getElementById('createServerModal');
        if (modal) {
            modal.classList.remove('active');
            document.getElementById('serverNameInput').value = '';
            document.getElementById('serverDescInput').value = '';
        }
        
        loadServers();
        
    } catch (error) {
        console.error('Error creating server:', error);
        alert('Failed to create server');
    }
}

/**
 * Load all servers for current user
 */
export async function loadServers() {
    const userId = getCurrentUserUID();
    if (!userId) return;
    
    try {
        const q = query(
            collection(db, 'servers'),
            where('members', 'array-contains', userId)
        );
        
        const querySnapshot = await getDocs(q);
        const serversList = document.getElementById('serversList');
        
        if (!serversList) return;
        
        serversList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const server = doc.data();
            const serverItem = document.createElement('div');
            serverItem.className = 'server-item';
            serverItem.textContent = server.name.charAt(0).toUpperCase();
            serverItem.title = server.name;
            serverItem.onclick = () => selectServer(doc.id);
            serverItem.dataset.serverId = doc.id;
            
            serversList.appendChild(serverItem);
        });
        
    } catch (error) {
        console.error('Error loading servers:', error);
    }
}

/**
 * Select a server
 */
export async function selectServer(serverId) {
    currentServer = serverId;
    
    try {
        // Get server data
        const serverDoc = await getDoc(doc(db, 'servers', serverId));
        if (!serverDoc.exists()) return;
        
        currentServerData = serverDoc.data();
        
        // Update UI
        document.getElementById('serverName').textContent = currentServerData.name;
        document.querySelectorAll('.server-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-serverId="${serverId}"]`).classList.add('active');
        
        // Load channels for this server
        await loadChannels(serverId);
        
        // Load members for this server
        await loadMembers(serverId);
        
    } catch (error) {
        console.error('Error selecting server:', error);
    }
}

/**
 * Load channels for a server
 */
async function loadChannels(serverId) {
    try {
        const q = query(
            collection(db, 'channels'),
            where('serverId', '==', serverId)
        );
        
        const querySnapshot = await getDocs(q);
        const channelsList = document.getElementById('channelsList');
        
        if (!channelsList) return;
        
        channelsList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const channel = doc.data();
            const channelItem = document.createElement('div');
            channelItem.className = 'channel-item';
            channelItem.innerHTML = `<i class="fas fa-${channel.type === 'voice' ? 'microphone' : 'hashtag'}"></i> ${channel.name}`;
            channelItem.onclick = () => selectChannel(doc.id, channel);
            channelItem.dataset.channelId = doc.id;
            
            channelsList.appendChild(channelItem);
        });
        
    } catch (error) {
        console.error('Error loading channels:', error);
    }
}

/**
 * Load members for a server
 */
async function loadMembers(serverId) {
    try {
        const serverDoc = await getDoc(doc(db, 'servers', serverId));
        const memberIds = serverDoc.data()?.members || [];
        
        const membersList = document.getElementById('membersList');
        if (!membersList) return;
        
        membersList.innerHTML = '';
        
        for (const memberId of memberIds) {
            const userDoc = await getDoc(doc(db, 'users', memberId));
            if (userDoc.exists()) {
                const user = userDoc.data();
                const memberItem = document.createElement('div');
                memberItem.className = 'member-item';
                memberItem.innerHTML = `
                    <div class="member-avatar">${user.username.charAt(0).toUpperCase()}</div>
                    <div class="member-info">
                        <div class="member-name">${user.username}</div>
                        <div class="member-status">
                            <span class="status-indicator ${user.status === 'online' ? '' : 'offline'}"></span>
                            ${user.status}
                        </div>
                    </div>
                `;
                membersList.appendChild(memberItem);
            }
        }
        
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

/**
 * Select a channel
 */
function selectChannel(channelId, channelData) {
    // Update UI
    document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-channelId="${channelId}"]`)?.classList.add('active');
    
    // Update chat header
    document.getElementById('chatTitle').textContent = channelData.name;
    document.getElementById('chatSubtitle').textContent = channelData.description || '';
    
    // Load messages for this channel
    import('./chat.js').then(module => {
        module.loadMessages(channelId, 'channel');
    });
}

/**
 * Delete server (admin only)
 */
export async function deleteServer(serverId) {
    if (!confirm('Are you sure you want to delete this server?')) return;
    
    try {
        await deleteDoc(doc(db, 'servers', serverId));
        
        // Log audit action
        const userId = getCurrentUserUID();
        await logAuditAction('server_deleted', userId, 'server', serverId, {
            timestamp: new Date()
        });
        
        loadServers();
        
    } catch (error) {
        console.error('Error deleting server:', error);
        alert('Failed to delete server');
    }
}

/**
 * Join a server
 */
export async function joinServer(serverId) {
    const userId = getCurrentUserUID();
    if (!userId) return;
    
    try {
        const serverRef = doc(db, 'servers', serverId);
        const serverDoc = await getDoc(serverRef);
        
        if (!serverDoc.exists()) {
            throw new Error('Server not found');
        }
        
        const members = serverDoc.data().members || [];
        if (!members.includes(userId)) {
            members.push(userId);
            await updateDoc(serverRef, { members });
        }
        
        loadServers();
        
    } catch (error) {
        console.error('Error joining server:', error);
        alert('Failed to join server');
    }
}

/**
 * Leave server
 */
export async function leaveServer(serverId) {
    const userId = getCurrentUserUID();
    if (!userId) return;
    
    if (!confirm('Leave this server?')) return;
    
    try {
        const serverRef = doc(db, 'servers', serverId);
        const serverDoc = await getDoc(serverRef);
        
        if (!serverDoc.exists()) throw new Error('Server not found');
        
        const members = serverDoc.data().members || [];
        const index = members.indexOf(userId);
        
        if (index > -1) {
            members.splice(index, 1);
            await updateDoc(serverRef, { members });
        }
        
        if (currentServer === serverId) {
            currentServer = null;
        }
        
        loadServers();
        
    } catch (error) {
        console.error('Error leaving server:', error);
        alert('Failed to leave server');
    }
}

/**
 * Initialize servers module
 */
export function initServers() {
    // Load servers on page load
    loadServers();
    
    // Setup event listeners
    const createServerBtn = document.getElementById('createServerBtn');
    if (createServerBtn) {
        createServerBtn.addEventListener('click', () => {
            const modal = document.getElementById('createServerModal');
            if (modal) {
                modal.classList.add('active');
            }
        });
    }
    
    // Close modal on X click
    const closeButtons = document.querySelectorAll('.btn-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });
    
    // Close modal on background click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Export for access
export { currentServer, currentServerData };

console.log('Servers module loaded');
